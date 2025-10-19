#!/usr/bin/env node
// Cat Oscillator Sync - TypeScript/Node.js CLI version for Windows
// Mouse-controlled hard sync oscillator synthesizer

import { createAudioOutput } from "./audio/output.js";
import { getMousePosition, getScreenSize } from "./mouse/position.js";
import { SimpleSynth } from "./synth/simple.js";
import { SmoothSynth } from "./synth/smooth.js";

// Audio configuration
const SAMPLE_RATE = 48000;
const POLLING_INTERVAL_MS = 8;
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * POLLING_INTERVAL_MS) / 1000);

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
    console.log(`Buffer size: ${FRAMES_PER_BUFFER} frames`);
    console.log(`Polling interval: ${POLLING_INTERVAL_MS} ms`);
    console.log();

    // Create synthesizer
    const synth =
        mode === "smooth"
            ? new SmoothSynth(SAMPLE_RATE, TIME_CONSTANT_MS)
            : new SimpleSynth(SAMPLE_RATE);

    // Create audio output
    const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16);

    // Start audio stream
    audioOutput.start((buffer, frameCount) => {
        synth.generateSamples(buffer, frameCount);
    }, FRAMES_PER_BUFFER);

    console.log("Audio stream started. Move your mouse to control the sound.");
    console.log();

    let running = true;
    let statusCounter = 0;

    // Handle Ctrl+C
    process.on("SIGINT", () => {
        running = false;
        console.log("\n\n終了しました。");
        audioOutput.stop();
        process.exit(0);
    });

    // Mouse polling loop
    const pollInterval = setInterval(() => {
        try {
            const pos = getMousePosition();

            // Map mouse X to master frequency
            const freqMaster = mapRange(pos.x, 0, screen.width, MASTER_FREQ_MIN, MASTER_FREQ_MAX);

            // Map mouse Y to slave frequency (inverted Y axis)
            const freqSlave = mapRange(screen.height - pos.y, 0, screen.height, SLAVE_FREQ_MIN, SLAVE_FREQ_MAX);

            // Update synth frequencies
            synth.setMasterFrequency(freqMaster);
            synth.setSlaveFrequency(freqSlave);

            // Display status every ~500ms (every ~62 iterations at 8ms interval)
            if (++statusCounter >= 62) {
                const line = `\rMaster: ${synth.getMasterFrequency().toFixed(1)} Hz | Slave: ${synth
                    .getSlaveFrequency()
                    .toFixed(1)} Hz`;
                process.stdout.write(line);
                statusCounter = 0;
            }
        } catch (error) {
            // Ignore mouse position errors
        }
    }, POLLING_INTERVAL_MS);

    // Cleanup on exit
    process.on("exit", () => {
        clearInterval(pollInterval);
        audioOutput.stop();
    });
}

// Run main function
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
