#!/usr/bin/env node
// Diagnostic Script 3: Test mouse-controlled frequency changes at 125Hz
// This combines mouse capture with audio frequency changes to test the full integration
// Usage: node dist/diagnostics/test-mouse-audio.js

import { createAudioOutput } from "../audio/output.js";
import { getMousePosition, getScreenSize } from "../mouse/position.js";

const SAMPLE_RATE = 48000;
const UPDATE_RATE_HZ = 125; // How often to check mouse and update frequency
const UPDATE_INTERVAL_MS = 1000 / UPDATE_RATE_HZ; // 8ms for 125Hz
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * UPDATE_INTERVAL_MS) / 1000);
const TEST_DURATION_MS = 5000; // 5 seconds

// Frequency ranges for mouse mapping
const FREQ_MIN = 220; // A3
const FREQ_MAX = 1760; // A6

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
 * Simple sine wave oscillator
 */
class SineOscillator {
    private frequency: number = 440;
    private phase: number = 0;
    private sampleRate: number;

    constructor(sampleRate: number) {
        this.sampleRate = sampleRate;
    }

    setFrequency(freq: number): void {
        this.frequency = freq;
    }

    getFrequency(): number {
        return this.frequency;
    }

    generateSamples(buffer: Int16Array, frameCount: number): void {
        const phaseIncrement = this.frequency / this.sampleRate;

        for (let i = 0; i < frameCount; i++) {
            // Generate sine wave
            const amplitude = Math.sin(this.phase * 2 * Math.PI);

            // Convert to 16-bit signed integer with volume reduction
            buffer[i] = Math.floor(amplitude * 16384);

            // Advance phase
            this.phase += phaseIncrement;
            if (this.phase >= 1.0) {
                this.phase -= 1.0;
            }
        }
    }
}

interface FrequencyUpdate {
    timestamp: number;
    mouseX: number;
    mouseY: number;
    frequency: number;
}

/**
 * Test mouse-controlled frequency changes
 */
async function testMouseAudio(): Promise<void> {
    console.log("=== Mouse-Controlled Audio Test ===");
    console.log(`Sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Update rate: ${UPDATE_RATE_HZ} Hz`);
    console.log(`Update interval: ${UPDATE_INTERVAL_MS.toFixed(2)} ms`);
    console.log(`Test duration: ${TEST_DURATION_MS} ms`);
    console.log("\nMove your mouse horizontally to change frequency!");
    console.log(`Frequency range: ${FREQ_MIN} Hz (left) -> ${FREQ_MAX} Hz (right)\n`);

    const screen = getScreenSize();
    console.log(`Screen size: ${screen.width}x${screen.height}`);

    console.log("\nStarting audio in 2 seconds...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create oscillator and audio output
    const oscillator = new SineOscillator(SAMPLE_RATE);
    const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16);

    // Start audio stream
    audioOutput.start((buffer, frameCount) => {
        oscillator.generateSamples(buffer, frameCount);
    }, FRAMES_PER_BUFFER);

    console.log("Audio started. Move your mouse!\n");

    const updates: FrequencyUpdate[] = [];
    const startTime = Date.now();
    let updateCount = 0;
    let freqChangeCount = 0;
    let lastFreq = oscillator.getFrequency();

    return new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;

            if (elapsed >= TEST_DURATION_MS) {
                clearInterval(intervalId);
                setTimeout(() => {
                    audioOutput.stop();
                    analyzeResults(updates, startTime, updateCount, freqChangeCount);
                    resolve();
                }, 500); // Let last audio finish
                return;
            }

            try {
                updateCount++;
                const pos = getMousePosition();

                // Map mouse X to frequency
                const freq = mapRange(pos.x, 0, screen.width, FREQ_MIN, FREQ_MAX);
                oscillator.setFrequency(freq);

                // Check if frequency actually changed
                const currentFreq = oscillator.getFrequency();
                if (Math.abs(currentFreq - lastFreq) > 0.5) {
                    // Changed by more than 0.5 Hz
                    freqChangeCount++;
                    updates.push({
                        timestamp: elapsed,
                        mouseX: pos.x,
                        mouseY: pos.y,
                        frequency: currentFreq,
                    });
                    lastFreq = currentFreq;
                }

                // Display progress every ~250ms
                if (updateCount % Math.floor(UPDATE_RATE_HZ / 4) === 0) {
                    process.stdout.write(
                        `\r[${(elapsed / 1000).toFixed(1)}s] Updates: ${updateCount}, Freq changes: ${freqChangeCount}, Current: ${currentFreq.toFixed(1)} Hz`
                    );
                }
            } catch (error) {
                // Ignore mouse errors
            }
        }, UPDATE_INTERVAL_MS);
    });
}

/**
 * Analyze and display test results
 */
function analyzeResults(
    updates: FrequencyUpdate[],
    startTime: number,
    updateCount: number,
    freqChangeCount: number
): void {
    const endTime = Date.now();
    const actualDuration = endTime - startTime;

    console.log("\n\n=== Test Results ===");
    console.log(`Actual test duration: ${actualDuration} ms`);
    console.log(`Total mouse checks: ${updateCount}`);
    console.log(`Frequency changes detected: ${freqChangeCount}`);
    console.log(`Actual check rate: ${((updateCount / actualDuration) * 1000).toFixed(2)} Hz`);
    console.log(
        `Frequency change rate: ${((freqChangeCount / actualDuration) * 1000).toFixed(2)} Hz`
    );

    if (freqChangeCount === 0) {
        console.log("\n⚠️  WARNING: No frequency changes detected!");
        console.log("Please move your mouse horizontally during the test.");
        return;
    }

    // Analyze timing between frequency changes
    if (updates.length > 1) {
        const intervals: number[] = [];
        for (let i = 1; i < updates.length; i++) {
            intervals.push(updates[i].timestamp - updates[i - 1].timestamp);
        }

        intervals.sort((a, b) => a - b);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const minInterval = intervals[0];
        const maxInterval = intervals[intervals.length - 1];
        const medianInterval = intervals[Math.floor(intervals.length / 2)];

        console.log(`\nTime between frequency changes:`);
        console.log(`  Average: ${avgInterval.toFixed(2)} ms`);
        console.log(`  Median: ${medianInterval.toFixed(2)} ms`);
        console.log(`  Min: ${minInterval.toFixed(2)} ms`);
        console.log(`  Max: ${maxInterval.toFixed(2)} ms`);
    }

    // Show first few frequency changes
    console.log(`\n=== First 10 Frequency Changes ===`);
    updates.slice(0, 10).forEach((update, index) => {
        console.log(
            `${index + 1}. t=${update.timestamp.toFixed(0)}ms, mouse=(${update.mouseX},${update.mouseY}), freq=${update.frequency.toFixed(1)}Hz`
        );
    });

    // Diagnosis
    console.log(`\n=== Diagnosis ===`);
    const changeRate = (freqChangeCount / actualDuration) * 1000;

    if (changeRate >= 10) {
        console.log("✅ Frequency change rate meets the target!");
        console.log(`   Achieved ${changeRate.toFixed(2)} Hz (target: ≥10 Hz)`);
        console.log("   Mouse-controlled audio is working well.");
    } else if (changeRate >= 5) {
        console.log("⚠️  Frequency change rate is acceptable but below target.");
        console.log(`   Achieved ${changeRate.toFixed(2)} Hz (target: ≥10 Hz)`);
        console.log("   This might be due to slow mouse movement.");
    } else if (changeRate >= 1) {
        console.log("⚠️  Frequency change rate is low.");
        console.log(`   Achieved ${changeRate.toFixed(2)} Hz (target: ≥10 Hz)`);
        console.log("   Possible issues:");
        console.log("   - Mouse was moved very slowly");
        console.log("   - Integration between mouse and audio has problems");
    } else {
        console.log("❌ Frequency change rate is very low!");
        console.log(`   Achieved ${changeRate.toFixed(2)} Hz (target: ≥10 Hz)`);
        console.log("   This indicates a serious problem with the integration.");
    }

    console.log(`\nPercentage of checks that changed frequency: ${((freqChangeCount / updateCount) * 100).toFixed(2)}%`);
}

// Handle Ctrl+C
process.on("SIGINT", () => {
    console.log("\n\nTest interrupted.");
    process.exit(0);
});

// Run the test
console.log("Starting mouse-controlled audio test...");
testMouseAudio()
    .then(() => {
        console.log("\nTest completed successfully.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Test failed:", error);
        process.exit(1);
    });
