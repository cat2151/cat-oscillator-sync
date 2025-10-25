// +build windows

// Windows mouse polling speed test
// This program measures the actual mouse position query rate
// to verify it meets the 125 Hz (8ms) target for audio synthesis

package main

import (
	"fmt"
	"time"

	"github.com/cat2151/cat-oscillator-sync/go/internal/mouse"
)

func main() {
	fmt.Println("🐭 Windows Mouse Polling Speed Test")
	fmt.Println("====================================")
	fmt.Println()

	// Check if we're on Windows
	pos, err := mouse.GetPosition()
	if err != nil {
		fmt.Printf("❌ Error: %v\n", err)
		fmt.Println()
		fmt.Println("This test must be run on Windows.")
		return
	}

	fmt.Printf("✅ Initial mouse position: (%d, %d)\n", pos.X, pos.Y)
	fmt.Println()

	// Test polling speed
	const iterations = 1000
	fmt.Printf("Measuring mouse query speed with %d iterations...\n", iterations)

	start := time.Now()
	for i := 0; i < iterations; i++ {
		_, err := mouse.GetPosition()
		if err != nil {
			fmt.Printf("❌ Error during iteration %d: %v\n", i, err)
			return
		}
	}
	elapsed := time.Since(start)

	avgTime := elapsed / iterations
	queriesPerSecond := float64(iterations) / elapsed.Seconds()

	fmt.Println()
	fmt.Println("Results:")
	fmt.Println("--------")
	fmt.Printf("Total time:             %v\n", elapsed)
	fmt.Printf("Average time per query: %v\n", avgTime)
	fmt.Printf("Queries per second:     %.0f Hz\n", queriesPerSecond)
	fmt.Println()

	// Performance assessment
	const requiredHz = 10.0   // User's minimum requirement
	const targetHz = 125.0    // Design target (8ms polling)
	const optimalHz = 1000.0  // Optimal for very responsive UI

	fmt.Println("Performance Assessment:")
	fmt.Println("----------------------")
	fmt.Printf("Minimum requirement: >= %.0f Hz  %s\n", requiredHz, check(queriesPerSecond >= requiredHz))
	fmt.Printf("Target rate:         >= %.0f Hz  %s\n", targetHz, check(queriesPerSecond >= targetHz))
	fmt.Printf("Optimal rate:        >= %.0f Hz  %s\n", optimalHz, check(queriesPerSecond >= optimalHz))
	fmt.Println()

	if queriesPerSecond >= optimalHz {
		fmt.Println("✅ Excellent! Mouse polling is extremely fast.")
		fmt.Println("   The 8ms polling interval should work perfectly.")
	} else if queriesPerSecond >= targetHz {
		fmt.Println("✅ Good! Mouse polling meets the design target.")
		fmt.Println("   The synthesizer should be responsive.")
	} else if queriesPerSecond >= requiredHz {
		fmt.Println("⚠️  Performance meets minimum requirements.")
		fmt.Println("   Consider investigating if there are system issues.")
	} else {
		fmt.Println("❌ Performance is below requirements!")
		fmt.Println("   There may be a system-level issue affecting mouse polling.")
	}
	fmt.Println()

	// Test actual polling over time
	fmt.Println("Testing actual polling rate over 2 seconds...")
	fmt.Println("(Move your mouse to see position updates)")
	fmt.Println()

	ticker := time.NewTicker(8 * time.Millisecond)
	defer ticker.Stop()

	updateCount := 0
	startTime := time.Now()
	lastPos := mouse.Position{X: -1, Y: -1}

	timeout := time.After(2 * time.Second)

	for {
		select {
		case <-ticker.C:
			pos, err := mouse.GetPosition()
			if err != nil {
				fmt.Printf("Error: %v\n", err)
				return
			}
			updateCount++

			// Print if position changed
			if pos.X != lastPos.X || pos.Y != lastPos.Y {
				elapsed := time.Since(startTime)
				fmt.Printf("[%6.0fms] Position: (%4d, %4d)\n", 
					elapsed.Seconds()*1000, pos.X, pos.Y)
				lastPos = pos
			}

		case <-timeout:
			elapsed := time.Since(startTime)
			actualRate := float64(updateCount) / elapsed.Seconds()
			fmt.Println()
			fmt.Printf("Actual polling test completed:\n")
			fmt.Printf("  Updates: %d in %.2f seconds\n", updateCount, elapsed.Seconds())
			fmt.Printf("  Actual rate: %.1f Hz\n", actualRate)
			
			if actualRate >= targetHz * 0.9 {
				fmt.Println("  ✅ Polling rate is as expected!")
			} else {
				fmt.Println("  ⚠️  Polling rate is lower than expected.")
				fmt.Println("     This may indicate system performance issues.")
			}
			return
		}
	}
}

func check(ok bool) string {
	if ok {
		return "✅ PASS"
	}
	return "❌ FAIL"
}
