// Smooth hard sync oscillator synthesizer
// Uses exponential smoothing for frequency changes

/**
 * Smooth hard sync synthesizer state with exponential smoothing
 */
export class SmoothSynth {
    private freqMasterTarget: number = 440;
    private freqSlaveTarget: number = 880;
    private freqMasterCurrent: number = 440;
    private freqSlaveCurrent: number = 880;
    private phaseMaster: number = 0;
    private phaseSlave: number = 0;
    private sampleRate: number;
    private alpha: number; // Smoothing coefficient

    constructor(sampleRate: number, timeConstantMs: number = 16) {
        this.sampleRate = sampleRate;
        // Calculate alpha from time constant
        // alpha = 1 - exp(-1 / (sampleRate * timeConstant))
        this.alpha = 1 - Math.exp(-1 / (sampleRate * (timeConstantMs / 1000)));
    }

    /**
     * Set master frequency target
     */
    setMasterFrequency(freq: number): void {
        this.freqMasterTarget = freq;
    }

    /**
     * Set slave frequency target
     */
    setSlaveFrequency(freq: number): void {
        this.freqSlaveTarget = freq;
    }

    /**
     * Get current master frequency
     */
    getMasterFrequency(): number {
        return this.freqMasterCurrent;
    }

    /**
     * Get current slave frequency
     */
    getSlaveFrequency(): number {
        return this.freqSlaveCurrent;
    }

    /**
     * Generate audio samples using hard sync algorithm with smooth frequency transitions
     */
    generateSamples(buffer: Int16Array, frameCount: number): void {
        for (let i = 0; i < frameCount; i++) {
            // Apply exponential smoothing to frequencies (per sample)
            this.freqMasterCurrent += this.alpha * (this.freqMasterTarget - this.freqMasterCurrent);
            this.freqSlaveCurrent += this.alpha * (this.freqSlaveTarget - this.freqSlaveCurrent);

            const incMaster = this.freqMasterCurrent / this.sampleRate;
            const incSlave = this.freqSlaveCurrent / this.sampleRate;

            // Advance master phase
            this.phaseMaster += incMaster;

            // Check for master phase wrap (hard sync trigger)
            if (this.phaseMaster >= 1.0) {
                this.phaseMaster -= 1.0;
                // Reset slave phase when master wraps (HARD SYNC)
                this.phaseSlave = 0.0;
            } else {
                // Advance slave phase
                this.phaseSlave += incSlave;
                if (this.phaseSlave >= 1.0) {
                    this.phaseSlave -= 1.0;
                }
            }

            // Generate sawtooth wave from slave oscillator
            // Convert phase [0, 1) to amplitude [-1, 1]
            const amplitude = 2.0 * this.phaseSlave - 1.0;

            // Convert to 16-bit signed integer with volume reduction
            buffer[i] = Math.floor(amplitude * 16384); // Reduced volume to prevent clipping
        }
    }
}
