#!/usr/bin/env node
// Diagnostic version of main.ts with error logging
// This version logs mouse capture errors to help diagnose the frequency update issue

import { createAudioOutput } from "../audio/output.js";
import { getMousePosition, getScreenSize } from "../mouse/position.js";
import { SimpleSynth } from "../synth/simple.js";
import { SmoothSynth } from "../synth/smooth.js";

// Audio configuration
const SAMPLE_RATE = 48000;
const POLLING_INTERVAL_MS = 8;
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * POLLING_INTERVAL_MS) / 1000);
const BUFFER_SIZE_MS = 50; // Audio buffer size (naudiodon internal buffer is ~170ms)

// Frequency ranges
const MASTER_FREQ_MIN = 40;
const MASTER_FREQ_MAX = 600;
const SLAVE_FREQ_MIN = 100;
const SLAVE_FREQ_MAX = 2000;

// Time constant for smooth version (in milliseconds)
const TIME_CONSTANT_MS = 16;

// Diagnostic counters
let totalPolls = 0;
let successfulPolls = 0;
let errorPolls = 0;
let frequencyUpdates = 0;
let lastFreqMaster = 0;
let lastFreqSlave = 0;

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

    console.log("🎵 Cat Oscillator Sync - TypeScript/Node.js CLI Version (Diagnostic)");
    console.log(`モード: ${mode === "smooth" ? "スムーズ版" : "シンプル版"}`);
    console.log("マウスを動かして音を制御してください");
    console.log("X軸: マスター周波数 (40Hz - 600Hz)");
    console.log("Y軸: スレーブ周波数 (100Hz - 2000Hz)");
    console.log("Press Ctrl+C to exit");
    console.log();
    console.log("⚠️  DIAGNOSTIC MODE: Logging mouse capture errors");
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
    const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16, BUFFER_SIZE_MS);

    // Start audio stream
    audioOutput.start((buffer, frameCount) => {
        synth.generateSamples(buffer, frameCount);
    }, FRAMES_PER_BUFFER);

    console.log("Audio stream started. Move your mouse to control the sound.");
    console.log();

    let running = true;
    let statusCounter = 0;
    const errorLog: string[] = [];
    const diagnosticStartTime = Date.now();

    // Handle Ctrl+C
    process.on("SIGINT", () => {
        running = false;
        printDiagnostics(diagnosticStartTime);
        console.log("\n\n終了しました。");
        audioOutput.stop();
        process.exit(0);
    });

    // Mouse polling loop
    const pollInterval = setInterval(() => {
        totalPolls++;

        try {
            const pos = getMousePosition();
            successfulPolls++;

            // Map mouse X to master frequency
            const freqMaster = mapRange(pos.x, 0, screen.width, MASTER_FREQ_MIN, MASTER_FREQ_MAX);

            // Map mouse Y to slave frequency (inverted Y axis)
            const freqSlave = mapRange(
                screen.height - pos.y,
                0,
                screen.height,
                SLAVE_FREQ_MIN,
                SLAVE_FREQ_MAX
            );

            // Track frequency changes
            if (
                Math.abs(freqMaster - lastFreqMaster) > 0.5 ||
                Math.abs(freqSlave - lastFreqSlave) > 0.5
            ) {
                frequencyUpdates++;
                lastFreqMaster = freqMaster;
                lastFreqSlave = freqSlave;
            }

            // Update synth frequencies
            synth.setMasterFrequency(freqMaster);
            synth.setSlaveFrequency(freqSlave);

            // Display status every ~500ms (every ~62 iterations at 8ms interval)
            if (++statusCounter >= 62) {
                const elapsed = Date.now() - diagnosticStartTime;
                const successRate = ((successfulPolls / totalPolls) * 100).toFixed(1);
                const updateRate = ((frequencyUpdates / elapsed) * 1000).toFixed(2);

                const line = `\rMaster: ${synth.getMasterFrequency().toFixed(1)} Hz | Slave: ${synth
                    .getSlaveFrequency()
                    .toFixed(
                        1
                    )} Hz | Success: ${successRate}% | Updates: ${updateRate} Hz | Errors: ${errorPolls}`;
                process.stdout.write(line);
                statusCounter = 0;
            }
        } catch (error) {
            errorPolls++;

            // Log first 10 errors
            if (errorLog.length < 10) {
                const errorMsg =
                    error instanceof Error ? error.message : String(error);
                errorLog.push(`[${totalPolls}] ${errorMsg}`);
                console.error(`\n⚠️  Mouse error #${errorPolls}: ${errorMsg}`);
            }

            // If too many errors, warn the user
            if (errorPolls === 10) {
                console.error(
                    "\n⚠️  More than 10 mouse errors occurred. Suppressing further error messages."
                );
            }
        }
    }, POLLING_INTERVAL_MS);

    // Cleanup on exit
    process.on("exit", () => {
        clearInterval(pollInterval);
        audioOutput.stop();
    });

    // Print diagnostic info every 10 seconds
    setInterval(() => {
        if (errorLog.length > 0) {
            console.log("\n\n=== Error Log (first 10 errors) ===");
            errorLog.forEach((err) => console.log(err));
        }
    }, 10000);
}

/**
 * Print diagnostic information
 */
function printDiagnostics(startTime: number): void {
    const elapsed = Date.now() - startTime;
    const elapsedSec = elapsed / 1000;

    console.log("\n\n=== Diagnostic Information ===");
    console.log(`Test duration: ${elapsedSec.toFixed(2)} seconds`);
    console.log(`Total polls: ${totalPolls}`);
    console.log(`Successful polls: ${successfulPolls}`);
    console.log(`Error polls: ${errorPolls}`);
    console.log(`Frequency updates: ${frequencyUpdates}`);
    console.log();
    console.log(`Polling rate: ${((totalPolls / elapsed) * 1000).toFixed(2)} Hz`);
    console.log(
        `Success rate: ${((successfulPolls / totalPolls) * 100).toFixed(2)}%`
    );
    console.log(
        `Frequency update rate: ${((frequencyUpdates / elapsed) * 1000).toFixed(2)} Hz`
    );
    console.log();

    if (errorPolls > totalPolls * 0.5) {
        console.log("❌ CRITICAL: More than 50% of polls failed!");
        console.log("   This indicates a serious problem with mouse capture (robotjs).");
        console.log("   Possible causes:");
        console.log("   - Insufficient permissions (try running as administrator)");
        console.log("   - Security software blocking robotjs");
        console.log("   - robotjs not properly installed or compiled");
    } else if (errorPolls > totalPolls * 0.1) {
        console.log("⚠️  WARNING: More than 10% of polls failed.");
        console.log("   This could affect frequency update responsiveness.");
    } else if (errorPolls > 0) {
        console.log("ℹ️  Some polls failed, but success rate is acceptable.");
    } else {
        console.log("✅ All polls succeeded!");
    }

    console.log();
    const targetUpdateRate = 10; // Hz
    if (frequencyUpdates / elapsedSec >= targetUpdateRate) {
        console.log(`✅ Frequency update rate meets target (≥${targetUpdateRate} Hz)`);
    } else {
        console.log(`❌ Frequency update rate is below target (${targetUpdateRate} Hz)`);
        console.log(
            `   Achieved: ${((frequencyUpdates / elapsed) * 1000).toFixed(2)} Hz`
        );
        console.log("   Possible causes:");
        if (errorPolls > 0) {
            console.log("   - High error rate in mouse polling");
        } else {
            console.log("   - Mouse was not moved enough during test");
            console.log("   - setInterval precision issues");
            console.log("   - Performance bottleneck in the polling loop");
        }
    }
}

// Run main function
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
