#!/usr/bin/env node
// Diagnostic Script 2: Test frequency changes at 125Hz using simple sine wave
// This script tests if we can change audio frequency 125 times per second
// without mouse input, using a simple sine wave oscillator
// Usage: node dist/diagnostics/test-frequency-sweep.js

import { createAudioOutput } from "../audio/output.js";

const SAMPLE_RATE = 48000;
const UPDATE_RATE_HZ = 125; // How often to update frequency
const UPDATE_INTERVAL_MS = 1000 / UPDATE_RATE_HZ; // 8ms for 125Hz
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * UPDATE_INTERVAL_MS) / 1000);

// Frequency sweep parameters
const FREQ_START = 440; // A4
const FREQ_END = 1760; // A6 (4 octaves up)
const SWEEP_DURATION_MS = 1000; // 1 second sweep
const TOTAL_UPDATES = Math.floor(SWEEP_DURATION_MS / UPDATE_INTERVAL_MS); // 125 updates

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

/**
 * Test frequency changes at specified rate
 */
async function testFrequencySweep(): Promise<void> {
    console.log("=== Frequency Sweep Test ===");
    console.log(`Sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Update rate: ${UPDATE_RATE_HZ} Hz`);
    console.log(`Update interval: ${UPDATE_INTERVAL_MS.toFixed(2)} ms`);
    console.log(`Buffer size: ${FRAMES_PER_BUFFER} frames`);
    console.log(`Sweep: ${FREQ_START} Hz -> ${FREQ_END} Hz in ${SWEEP_DURATION_MS} ms`);
    console.log(`Total frequency updates: ${TOTAL_UPDATES}`);
    console.log("\nStarting audio in 2 seconds...\n");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create oscillator and audio output
    const oscillator = new SineOscillator(SAMPLE_RATE);
    const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16);

    // Start audio stream
    audioOutput.start((buffer, frameCount) => {
        oscillator.generateSamples(buffer, frameCount);
    }, FRAMES_PER_BUFFER);

    console.log("Audio started. Beginning frequency sweep...\n");

    let updateCount = 0;
    let currentFreq = FREQ_START;
    const freqStep = (FREQ_END - FREQ_START) / TOTAL_UPDATES;
    const startTime = Date.now();

    // Track actual update times
    const updateTimes: number[] = [];

    return new Promise<void>((resolve) => {
        const intervalId = setInterval(() => {
            updateCount++;
            const elapsed = Date.now() - startTime;
            updateTimes.push(elapsed);

            // Calculate target frequency for this update
            currentFreq = FREQ_START + freqStep * updateCount;
            oscillator.setFrequency(currentFreq);

            // Display progress
            process.stdout.write(
                `\r[${elapsed}ms] Update ${updateCount}/${TOTAL_UPDATES}, Freq: ${currentFreq.toFixed(1)} Hz`
            );

            if (updateCount >= TOTAL_UPDATES) {
                clearInterval(intervalId);
                setTimeout(() => {
                    audioOutput.stop();
                    analyzeResults(updateTimes, startTime);
                    resolve();
                }, 500); // Let last audio finish
            }
        }, UPDATE_INTERVAL_MS);
    });
}

/**
 * Analyze and display test results
 */
function analyzeResults(updateTimes: number[], startTime: number): void {
    const endTime = Date.now();
    const actualDuration = endTime - startTime;
    const updateCount = updateTimes.length;

    console.log("\n\n=== Test Results ===");
    console.log(`Actual test duration: ${actualDuration} ms`);
    console.log(`Total frequency updates: ${updateCount}`);
    console.log(`Actual update rate: ${((updateCount / actualDuration) * 1000).toFixed(2)} Hz`);

    // Analyze timing between updates
    const intervals: number[] = [];
    for (let i = 1; i < updateTimes.length; i++) {
        intervals.push(updateTimes[i] - updateTimes[i - 1]);
    }

    if (intervals.length > 0) {
        intervals.sort((a, b) => a - b);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const minInterval = intervals[0];
        const maxInterval = intervals[intervals.length - 1];
        const medianInterval = intervals[Math.floor(intervals.length / 2)];

        console.log(`\nTime between frequency updates:`);
        console.log(`  Average: ${avgInterval.toFixed(2)} ms`);
        console.log(`  Median: ${medianInterval.toFixed(2)} ms`);
        console.log(`  Min: ${minInterval.toFixed(2)} ms`);
        console.log(`  Max: ${maxInterval.toFixed(2)} ms`);
        console.log(`  Expected: ${UPDATE_INTERVAL_MS.toFixed(2)} ms`);

        // Calculate jitter
        const jitter = intervals.map((i) => Math.abs(i - UPDATE_INTERVAL_MS));
        const avgJitter = jitter.reduce((a, b) => a + b, 0) / jitter.length;
        const maxJitter = Math.max(...jitter);

        console.log(`\nTiming jitter:`);
        console.log(`  Average: ${avgJitter.toFixed(2)} ms`);
        console.log(`  Max: ${maxJitter.toFixed(2)} ms`);
    }

    // Diagnosis
    console.log(`\n=== Diagnosis ===`);
    const actualRate = (updateCount / actualDuration) * 1000;

    if (actualRate >= 120 && actualRate <= 130) {
        console.log("✅ Frequency update rate is excellent!");
        console.log(`   Achieved ${actualRate.toFixed(2)} Hz (target: ${UPDATE_RATE_HZ} Hz)`);
    } else if (actualRate >= 100) {
        console.log("✅ Frequency update rate is good.");
        console.log(`   Achieved ${actualRate.toFixed(2)} Hz (target: ${UPDATE_RATE_HZ} Hz)`);
    } else if (actualRate >= 10) {
        console.log("⚠️  Frequency update rate is acceptable but lower than target.");
        console.log(`   Achieved ${actualRate.toFixed(2)} Hz (target: ${UPDATE_RATE_HZ} Hz)`);
    } else {
        console.log("❌ Frequency update rate is too low!");
        console.log(`   Achieved ${actualRate.toFixed(2)} Hz (target: ${UPDATE_RATE_HZ} Hz)`);
    }

    if (actualRate >= 10) {
        console.log(
            "\n✅ Audio system CAN handle at least 10 frequency updates per second."
        );
    } else {
        console.log(
            "\n❌ Audio system CANNOT handle 10 frequency updates per second."
        );
    }
}

// Handle Ctrl+C
process.on("SIGINT", () => {
    console.log("\n\nTest interrupted.");
    process.exit(0);
});

// Run the test
console.log("Starting frequency sweep test...");
testFrequencySweep()
    .then(() => {
        console.log("\nTest completed successfully.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Test failed:", error);
        process.exit(1);
    });
