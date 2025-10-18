package synth

// SmoothOscillator implements a hard-sync oscillator with exponential smoothing
type SmoothOscillator struct {
	sampleRate        float32
	phaseMaster       float32
	phaseSlave        float32
	currentFreqMaster float32
	currentFreqSlave  float32
	targetFreqMaster  float32
	targetFreqSlave   float32
	smoothnessCoeff   float32
	screenWidth       int
	screenHeight      int
}

// NewSmoothOscillator creates a new smooth hard-sync oscillator
func NewSmoothOscillator(sampleRate int, timeConstantMs float32, screenWidth, screenHeight int) *SmoothOscillator {
	// Calculate smoothness coefficient from time constant
	// n = time_constant_ms * samplerate / 1000
	// smoothness_coeff = 1.0 / n
	n := timeConstantMs * float32(sampleRate) / 1000.0
	smoothnessCoeff := 1.0 / n

	return &SmoothOscillator{
		sampleRate:        float32(sampleRate),
		phaseMaster:       0.0,
		phaseSlave:        0.0,
		currentFreqMaster: 100.0,
		currentFreqSlave:  100.0,
		targetFreqMaster:  100.0,
		targetFreqSlave:   100.0,
		smoothnessCoeff:   smoothnessCoeff,
		screenWidth:       screenWidth,
		screenHeight:      screenHeight,
	}
}

// UpdateTarget updates the target frequencies based on mouse position
func (s *SmoothOscillator) UpdateTarget(x, y int) {
	// Map X position (0 to screen_width) to master frequency (40Hz to 600Hz)
	s.targetFreqMaster = interp(float32(x), 0, float32(s.screenWidth), 40, 600)

	// Map Y position (0 to screen_height) to slave frequency (2000Hz to 100Hz) - inverted
	s.targetFreqSlave = interp(float32(y), 0, float32(s.screenHeight), 2000, 100)
}

// GenerateBlock generates a block of audio samples with per-sample frequency smoothing
func (s *SmoothOscillator) GenerateBlock(frames int) []float32 {
	out := make([]float32, frames)

	// Temporary variables for per-sample frequency calculation
	tempFreqMaster := s.currentFreqMaster
	tempFreqSlave := s.currentFreqSlave

	for i := 0; i < frames; i++ {
		// Apply exponential smoothing per sample
		tempFreqMaster += (s.targetFreqMaster - tempFreqMaster) * s.smoothnessCoeff
		tempFreqSlave += (s.targetFreqSlave - tempFreqSlave) * s.smoothnessCoeff

		// Calculate phase increments
		incMaster := tempFreqMaster / s.sampleRate
		incSlave := tempFreqSlave / s.sampleRate

		// Update master phase
		s.phaseMaster += incMaster

		// Check for master phase wrap (hard sync)
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

	// Update current frequencies for next block
	s.currentFreqMaster = tempFreqMaster
	s.currentFreqSlave = tempFreqSlave

	return out
}

// GetSmoothnessCoeff returns the smoothness coefficient for debugging
func (s *SmoothOscillator) GetSmoothnessCoeff() float32 {
	return s.smoothnessCoeff
}
