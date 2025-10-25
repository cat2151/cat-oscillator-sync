package synth

import (
	"testing"
)

func TestSimpleOscillator(t *testing.T) {
	osc := NewSimpleOscillator(48000, 1920, 1080)

	// Test frequency update
	osc.UpdateFrequencies(960, 540) // Center of screen

	// Expected frequencies at center: master ~320Hz, slave ~1050Hz
	if osc.freqMaster < 300 || osc.freqMaster > 340 {
		t.Errorf("Master frequency out of expected range: %.2f", osc.freqMaster)
	}
	if osc.freqSlave < 1000 || osc.freqSlave > 1100 {
		t.Errorf("Slave frequency out of expected range: %.2f", osc.freqSlave)
	}

	// Test block generation
	samples := osc.GenerateBlock(100)
	if len(samples) != 100 {
		t.Errorf("Expected 100 samples, got %d", len(samples))
	}

	// Check that samples are in range [-1, 1]
	for i, s := range samples {
		if s < -1.0 || s > 1.0 {
			t.Errorf("Sample %d out of range: %.4f", i, s)
		}
	}
}

func TestSmoothOscillator(t *testing.T) {
	osc := NewSmoothOscillator(48000, 16, 1920, 1080)

	// Test smoothness coefficient calculation
	// n = 16 * 48000 / 1000 = 768
	// smoothnessCoeff = 1 / 768 = 0.001302...
	expectedCoeff := float32(1.0 / 768.0)
	if osc.smoothnessCoeff < expectedCoeff*0.99 || osc.smoothnessCoeff > expectedCoeff*1.01 {
		t.Errorf("Smoothness coefficient incorrect: %.6f, expected: %.6f", osc.smoothnessCoeff, expectedCoeff)
	}

	// Test target update
	osc.UpdateTarget(960, 540)

	// Expected frequencies at center: master ~320Hz, slave ~1050Hz
	if osc.targetFreqMaster < 300 || osc.targetFreqMaster > 340 {
		t.Errorf("Target master frequency out of expected range: %.2f", osc.targetFreqMaster)
	}
	if osc.targetFreqSlave < 1000 || osc.targetFreqSlave > 1100 {
		t.Errorf("Target slave frequency out of expected range: %.2f", osc.targetFreqSlave)
	}

	// Test block generation
	samples := osc.GenerateBlock(100)
	if len(samples) != 100 {
		t.Errorf("Expected 100 samples, got %d", len(samples))
	}

	// Check that samples are in range [-1, 1]
	for i, s := range samples {
		if s < -1.0 || s > 1.0 {
			t.Errorf("Sample %d out of range: %.4f", i, s)
		}
	}
}

func TestInterp(t *testing.T) {
	tests := []struct {
		x, x0, x1, y0, y1, expected float32
	}{
		{0, 0, 100, 0, 1000, 0},
		{100, 0, 100, 0, 1000, 1000},
		{50, 0, 100, 0, 1000, 500},
		{25, 0, 100, 100, 200, 125},
	}

	for _, tt := range tests {
		result := interp(tt.x, tt.x0, tt.x1, tt.y0, tt.y1)
		if result < tt.expected*0.99 || result > tt.expected*1.01 {
			t.Errorf("interp(%.2f, %.2f, %.2f, %.2f, %.2f) = %.2f, expected %.2f",
				tt.x, tt.x0, tt.x1, tt.y0, tt.y1, result, tt.expected)
		}
	}
}
