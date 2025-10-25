#!/usr/bin/env node
// Cat Oscillator Sync - TypeScript/Node.js CLI version for Windows
// Mouse-controlled hard sync oscillator synthesizer

import { createAudioOutput } from "./audio/output.js";
import { getMousePosition, getScreenSize } from "./mouse/position.js";
import { SimpleSynth } from "./synth/simple.js";
import { SmoothSynth } from "./synth/smooth.js";

// Audio configuration
const SAMPLE_RATE = 48000;
const BUFFER_DURATION_MS = 50; // バッファの長さ（ミリ秒）- 周波数変化が50msごとに発生
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * BUFFER_DURATION_MS) / 1000);

// Frequency ranges
const MASTER_FREQ_MIN = 40;
const MASTER_FREQ_MAX = 600;
const SLAVE_FREQ_MIN = 100;
const SLAVE_FREQ_MAX = 2000;

// Time constant for smooth version (in milliseconds)
const TIME_CONSTANT_MS = 16;

/**
 * Map a value from one range to another
 */
function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Main function
 */
async function main(): Promise<void> {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const mode = args[0] === "smooth" ? "smooth" : "simple";

    console.log("🎵 Cat Oscillator Sync - TypeScript/Node.js CLI Version");
    console.log(`モード: ${mode === "smooth" ? "スムーズ版" : "シンプル版"}`);
    console.log("マウスを動かして音を制御してください");
    console.log("X軸: マスター周波数 (40Hz - 600Hz)");
    console.log("Y軸: スレーブ周波数 (100Hz - 2000Hz)");
    console.log("Press Ctrl+C to exit");
    console.log();

    // Get screen size
    const screen = getScreenSize();
    console.log(`Screen size: ${screen.width}x${screen.height}`);
    console.log(`Sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Buffer duration: ${BUFFER_DURATION_MS} ms (周波数更新頻度)`);
    console.log(`Buffer size: ${FRAMES_PER_BUFFER} frames`);
    console.log();

    // Create synthesizer
    const synth =
        mode === "smooth"
            ? new SmoothSynth(SAMPLE_RATE, TIME_CONSTANT_MS)
            : new SimpleSynth(SAMPLE_RATE);

    // Create audio output with 50ms buffer
    const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16, BUFFER_DURATION_MS);

    console.log("Audio stream started. Move your mouse to control the sound.");
    console.log();

    let bufferCount = 0;

    // Handle Ctrl+C
    process.on("SIGINT", () => {
        console.log("\n\n終了しました。");
        audioOutput.stop();
        process.exit(0);
    });

    // Start audio stream with frequency updates happening BEFORE each buffer generation
    audioOutput.start((buffer, frameCount) => {
        // Poll mouse position and update frequencies BEFORE generating audio
        // This ensures frequency changes are reflected immediately in the audio
        try {
            const pos = getMousePosition();

            // Map mouse X to master frequency
            const freqMaster = mapRange(pos.x, 0, screen.width, MASTER_FREQ_MIN, MASTER_FREQ_MAX);

            // Map mouse Y to slave frequency (inverted Y axis)
            const freqSlave = mapRange(screen.height - pos.y, 0, screen.height, SLAVE_FREQ_MIN, SLAVE_FREQ_MAX);

            // Update synth frequencies
            synth.setMasterFrequency(freqMaster);
            synth.setSlaveFrequency(freqSlave);

            // Display status every ~10 buffers (every ~500ms at 50ms per buffer)
            if (++bufferCount >= 10) {
                const line = `\rMaster: ${synth.getMasterFrequency().toFixed(1)} Hz | Slave: ${synth
                    .getSlaveFrequency()
                    .toFixed(1)} Hz | Buffer: ${bufferCount}`;
                process.stdout.write(line);
                bufferCount = 0;
            }
        } catch (error) {
            // Ignore mouse position errors but continue audio generation
        }

        // Generate audio with the updated frequencies
        synth.generateSamples(buffer, frameCount);
    }, FRAMES_PER_BUFFER);

    // Cleanup on exit
    process.on("exit", () => {
        audioOutput.stop();
    });
}

// Run main function
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
