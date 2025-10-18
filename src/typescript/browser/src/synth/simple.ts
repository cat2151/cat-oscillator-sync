/**
 * Simple version synthesizer
 * Uses AudioWorklet with step-wise frequency updates
 */

export class SimpleSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Create AudioContext
    this.audioContext = new AudioContext({ sampleRate: 48000 });

    // Load and add AudioWorklet module
    await this.audioContext.audioWorklet.addModule('/src/audio/simple-worklet.ts');

    // Create AudioWorklet node
    this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-worklet-processor');

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);

    this.isRunning = true;
    console.log('Simple synth started');
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
    console.log('Simple synth stopped');
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
