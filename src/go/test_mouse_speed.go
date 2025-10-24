// +build ignore

// Test program to measure mouse position retrieval speed
// This demonstrates the performance improvement from using X11 directly

package main

import (
	"fmt"
	"time"

	"github.com/cat2151/cat-oscillator-sync/go/internal/mouse"
)

func main() {
	fmt.Println("🐭 Mouse Position Retrieval Speed Test")
	fmt.Println("=====================================")
	fmt.Println()

	// Check if mouse position retrieval is available
	fmt.Println("Testing mouse position retrieval...")
	pos, err := mouse.GetPosition()
	if err != nil {
		fmt.Printf("❌ Error: Mouse position retrieval not available: %v\n", err)
		fmt.Println()
		fmt.Println("This is expected in headless environments or when X11 is not available.")
		fmt.Println("On a real system with X11, this test will show the performance improvement.")
		return
	}

	fmt.Printf("✅ Initial mouse position: (%d, %d)\n", pos.X, pos.Y)
	fmt.Println()

	// Test speed with multiple iterations
	const iterations = 1000
	fmt.Printf("Running %d mouse position queries...\n", iterations)

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
	fmt.Printf("Total time:           %v\n", elapsed)
	fmt.Printf("Average time per query: %v\n", avgTime)
	fmt.Printf("Queries per second:   %.0f Hz\n", queriesPerSecond)
	fmt.Println()

	// Compare with requirements
	const requiredHz = 10.0
	const targetHz = 125.0 // 8ms polling interval = 125 Hz

	fmt.Println("Performance Assessment:")
	fmt.Println("----------------------")
	fmt.Printf("Required rate:  >= %.0f Hz (%s)\n", requiredHz, check(queriesPerSecond >= requiredHz))
	fmt.Printf("Target rate:    >= %.0f Hz (%s)\n", targetHz, check(queriesPerSecond >= targetHz))
	fmt.Println()

	if queriesPerSecond >= targetHz {
		fmt.Println("✅ Performance is excellent! Mouse polling will work smoothly.")
	} else if queriesPerSecond >= requiredHz {
		fmt.Println("⚠️  Performance meets minimum requirements but could be improved.")
	} else {
		fmt.Println("❌ Performance is below requirements. Consider using X11 directly instead of xdotool.")
	}
}

func check(ok bool) string {
	if ok {
		return "✅ PASS"
	}
	return "❌ FAIL"
}
