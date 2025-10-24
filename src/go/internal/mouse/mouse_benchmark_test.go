//go:build linux

package mouse

import (
	"testing"
	"time"
)

// BenchmarkGetPosition benchmarks the performance of GetPosition
func BenchmarkGetPosition(b *testing.B) {
	// Check if GetPosition is available
	_, err := GetPosition()
	if err != nil {
		b.Skipf("Skipping benchmark - GetPosition not available: %v", err)
	}

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, err := GetPosition()
		if err != nil {
			b.Fatalf("GetPosition failed: %v", err)
		}
	}
}

// TestGetPositionSpeed tests that GetPosition is fast enough for real-time use
func TestGetPositionSpeed(t *testing.T) {
	const iterations = 100
	const maxTimePerCall = 10 * time.Millisecond // Should be much faster than 10ms

	// Try to get position once to see if the system supports it
	_, err := GetPosition()
	if err != nil {
		t.Skipf("Skipping speed test - GetPosition not available: %v", err)
	}

	start := time.Now()
	for i := 0; i < iterations; i++ {
		_, err := GetPosition()
		if err != nil {
			t.Fatalf("GetPosition failed: %v", err)
		}
	}
	elapsed := time.Since(start)

	avgTime := elapsed / iterations
	t.Logf("Average time per call: %v", avgTime)
	t.Logf("Calls per second: %.0f", float64(iterations)/elapsed.Seconds())

	if avgTime > maxTimePerCall {
		t.Errorf("GetPosition is too slow: avg %v, max %v", avgTime, maxTimePerCall)
	}

	// For real-time audio at 8ms polling interval, we need at least 125 Hz
	minCallsPerSecond := 125.0
	actualCallsPerSecond := float64(iterations) / elapsed.Seconds()
	if actualCallsPerSecond < minCallsPerSecond {
		t.Errorf("GetPosition rate too low: %.0f Hz, need at least %.0f Hz", actualCallsPerSecond, minCallsPerSecond)
	}
}
