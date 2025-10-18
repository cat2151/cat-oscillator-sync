/**
 * Smooth version synthesizer
 * Uses AudioWorklet with exponential smoothing per sample
 */

export class SmoothSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Create AudioContext
    this.audioContext = new AudioContext({ sampleRate: 48000 });

    // Load and add AudioWorklet module
    try {
      await this.audioContext.audioWorklet.addModule('/worklets/smooth-worklet.js');
      console.log('Smooth worklet module loaded successfully');
    } catch (error) {
      console.error('Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node with options
    this.workletNode = new AudioWorkletNode(this.audioContext, 'smooth-worklet-processor', {
      processorOptions: {
        timeConstantMs: 16, // Time constant in milliseconds
        sampleRate: this.audioContext.sampleRate,
      },
    });

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);

    this.isRunning = true;
    console.log('Smooth synth started');
  }

  stop(): void {
    if (!this.isRunning || !this.audioContext) return;

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    this.audioContext.close();
    this.audioContext = null;
    this.isRunning = false;
    console.log('Smooth synth stopped');
  }

  updateFrequencies(freqMaster: number, freqSlave: number): void {
    if (!this.workletNode) return;

    this.workletNode.port.postMessage({
      type: 'updateFrequencies',
      freqMaster,
      freqSlave,
    });
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }
}
