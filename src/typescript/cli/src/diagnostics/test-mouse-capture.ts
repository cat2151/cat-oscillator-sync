#!/usr/bin/env node
// Diagnostic Script 1: Test mouse position capture at 125Hz
// This script verifies if we can actually capture mouse position changes at 125Hz polling rate
// Usage: node dist/diagnostics/test-mouse-capture.js

import { getMousePosition, getScreenSize } from "../mouse/position.js";

const POLLING_RATE_HZ = 125;
const POLLING_INTERVAL_MS = 1000 / POLLING_RATE_HZ; // 8ms for 125Hz
const TEST_DURATION_MS = 5000; // 5 seconds

interface MouseEvent {
    timestamp: number;
    x: number;
    y: number;
}

/**
 * Test mouse position capture at specified polling rate
 */
async function testMouseCapture(): Promise<void> {
    console.log("=== Mouse Position Capture Test ===");
    console.log(`Target polling rate: ${POLLING_RATE_HZ} Hz`);
    console.log(`Polling interval: ${POLLING_INTERVAL_MS.toFixed(2)} ms`);
    console.log(`Test duration: ${TEST_DURATION_MS} ms`);
    console.log("\nMove your mouse around during the test!\n");

    const screen = getScreenSize();
    console.log(`Screen size: ${screen.width}x${screen.height}\n`);

    const events: MouseEvent[] = [];
    const startTime = Date.now();
    let lastPos = getMousePosition();
    let changeCount = 0;
    let totalPolls = 0;

    // Start polling
    const intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;

        if (elapsed >= TEST_DURATION_MS) {
            clearInterval(intervalId);
            analyzeResults(events, startTime, changeCount, totalPolls);
            return;
        }

        try {
            const pos = getMousePosition();
            totalPolls++;

            // Check if position changed
            if (pos.x !== lastPos.x || pos.y !== lastPos.y) {
                changeCount++;
                events.push({
                    timestamp: now - startTime,
                    x: pos.x,
                    y: pos.y,
                });
                lastPos = pos;
            }

            // Show progress every second
            if (totalPolls % POLLING_RATE_HZ === 0) {
                const seconds = Math.floor(elapsed / 1000);
                process.stdout.write(`\r[${seconds}s] Polls: ${totalPolls}, Changes: ${changeCount}`);
            }
        } catch (error) {
            console.error("Error reading mouse position:", error);
        }
    }, POLLING_INTERVAL_MS);
}

/**
 * Analyze and display test results
 */
function analyzeResults(
    events: MouseEvent[],
    startTime: number,
    changeCount: number,
    totalPolls: number
): void {
    const endTime = Date.now();
    const actualDuration = endTime - startTime;

    console.log("\n\n=== Test Results ===");
    console.log(`Actual test duration: ${actualDuration} ms`);
    console.log(`Total polls: ${totalPolls}`);
    console.log(`Mouse position changes detected: ${changeCount}`);
    console.log(`Actual polling rate: ${((totalPolls / actualDuration) * 1000).toFixed(2)} Hz`);

    if (changeCount === 0) {
        console.log("\n⚠️  WARNING: No mouse movement detected!");
        console.log("Please move your mouse during the test.");
        return;
    }

    console.log(`\n=== Mouse Movement Analysis ===`);
    console.log(`Change detection rate: ${((changeCount / actualDuration) * 1000).toFixed(2)} Hz`);
    console.log(
        `Percentage of polls that detected change: ${((changeCount / totalPolls) * 100).toFixed(2)}%`
    );

    // Analyze timing between changes
    if (events.length > 1) {
        const intervals: number[] = [];
        for (let i = 1; i < events.length; i++) {
            intervals.push(events[i].timestamp - events[i - 1].timestamp);
        }

        intervals.sort((a, b) => a - b);
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const minInterval = intervals[0];
        const maxInterval = intervals[intervals.length - 1];
        const medianInterval = intervals[Math.floor(intervals.length / 2)];

        console.log(`\nTime between position changes:`);
        console.log(`  Average: ${avgInterval.toFixed(2)} ms`);
        console.log(`  Median: ${medianInterval.toFixed(2)} ms`);
        console.log(`  Min: ${minInterval.toFixed(2)} ms`);
        console.log(`  Max: ${maxInterval.toFixed(2)} ms`);
    }

    // Show first few position changes
    console.log(`\n=== First 10 Position Changes ===`);
    events.slice(0, 10).forEach((event, index) => {
        console.log(
            `${index + 1}. t=${event.timestamp.toFixed(0)}ms, x=${event.x}, y=${event.y}`
        );
    });

    // Diagnosis
    console.log(`\n=== Diagnosis ===`);
    if (changeCount >= 10) {
        console.log("✅ Mouse capture is working well!");
        console.log(`   Detected ${changeCount} position changes in ${actualDuration}ms.`);
        if (changeCount / (actualDuration / 1000) >= 10) {
            console.log("✅ Change rate is above 10 Hz (target met!)");
        } else {
            console.log(
                "⚠️  Change rate is below 10 Hz. This might be due to slow mouse movement."
            );
        }
    } else {
        console.log("⚠️  Very few position changes detected.");
        console.log("   This could indicate:");
        console.log("   - Mouse was moved very slowly");
        console.log("   - Mouse capture is not working properly");
        console.log("   - Permissions issue with robotjs");
    }
}

// Run the test
console.log("Starting mouse capture test in 2 seconds...");
console.log("Get ready to move your mouse!\n");

setTimeout(() => {
    testMouseCapture().catch((error) => {
        console.error("Test failed:", error);
        process.exit(1);
    });
}, 2000);
