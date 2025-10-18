package synth

import (
	"math"
)

// SimpleOscillator implements a hard-sync oscillator with simple mouse polling
type SimpleOscillator struct {
	sampleRate   float32
	phaseMaster  float32
	phaseSlave   float32
	freqMaster   float32
	freqSlave    float32
	screenWidth  int
	screenHeight int
}

// NewSimpleOscillator creates a new simple hard-sync oscillator
func NewSimpleOscillator(sampleRate int, screenWidth, screenHeight int) *SimpleOscillator {
	return &SimpleOscillator{
		sampleRate:   float32(sampleRate),
		phaseMaster:  0.0,
		phaseSlave:   0.0,
		freqMaster:   440.0,
		freqSlave:    880.0,
		screenWidth:  screenWidth,
		screenHeight: screenHeight,
	}
}

// UpdateFrequencies updates the oscillator frequencies based on mouse position
func (s *SimpleOscillator) UpdateFrequencies(x, y int) {
	// Map X position (0 to screen_width) to master frequency (40Hz to 600Hz)
	s.freqMaster = interp(float32(x), 0, float32(s.screenWidth), 40, 600)

	// Map Y position (0 to screen_height) to slave frequency (2000Hz to 100Hz) - inverted
	s.freqSlave = interp(float32(y), 0, float32(s.screenHeight), 2000, 100)
}

// GenerateBlock generates a block of audio samples
func (s *SimpleOscillator) GenerateBlock(frames int) []float32 {
	out := make([]float32, frames)

	incMaster := s.freqMaster / s.sampleRate
	incSlave := s.freqSlave / s.sampleRate

	// Generate master and slave phases
	for i := 0; i < frames; i++ {
		// Update master phase
		s.phaseMaster += incMaster
		if s.phaseMaster >= 1.0 {
			s.phaseMaster -= 1.0
			// Hard sync: reset slave phase when master wraps
			s.phaseSlave = 0.0
		}

		// Update slave phase
		s.phaseSlave += incSlave
		if s.phaseSlave >= 1.0 {
			s.phaseSlave -= 1.0
		}

		// Generate sawtooth wave from slave phase (-1.0 to 1.0)
		out[i] = 2.0*s.phaseSlave - 1.0
	}

	return out
}

// interp performs linear interpolation
func interp(x, x0, x1, y0, y1 float32) float32 {
	if x1 == x0 {
		return y0
	}
	t := (x - x0) / (x1 - x0)
	t = float32(math.Max(0, math.Min(float64(t), 1)))
	return y0 + t*(y1-y0)
}
