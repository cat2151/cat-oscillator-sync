// Simple hard sync oscillator synthesizer
// Updates frequencies at polling interval (8ms steps)

/**
 * Simple hard sync synthesizer state
 */
export class SimpleSynth {
    private freqMaster: number = 440;
    private freqSlave: number = 880;
    private phaseMaster: number = 0;
    private phaseSlave: number = 0;
    private sampleRate: number;

    constructor(sampleRate: number) {
        this.sampleRate = sampleRate;
    }

    /**
     * Set master frequency
     */
    setMasterFrequency(freq: number): void {
        this.freqMaster = freq;
    }

    /**
     * Set slave frequency
     */
    setSlaveFrequency(freq: number): void {
        this.freqSlave = freq;
    }

    /**
     * Get current master frequency
     */
    getMasterFrequency(): number {
        return this.freqMaster;
    }

    /**
     * Get current slave frequency
     */
    getSlaveFrequency(): number {
        return this.freqSlave;
    }

    /**
     * Generate audio samples using hard sync algorithm
     */
    generateSamples(buffer: Int16Array, frameCount: number): void {
        const incMaster = this.freqMaster / this.sampleRate;
        const incSlave = this.freqSlave / this.sampleRate;

        for (let i = 0; i < frameCount; i++) {
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
