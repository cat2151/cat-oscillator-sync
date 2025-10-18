/**
 * Tone.js version synthesizer
 * Uses Tone.js context with custom AudioWorklet
 */

import * as Tone from 'tone';

export class ToneJSSynth {
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Start Tone.js (this also starts the AudioContext)
    await Tone.start();
    console.log('Tone.js context started');

    // Get Tone.js audio context
    const context = Tone.getContext();
    // @ts-ignore - accessing internal AudioContext
    const audioContext = context._context as AudioContext;

    // Load and add AudioWorklet module to Tone.js context
    try {
      await audioContext.audioWorklet.addModule('/src/audio/tonejs-worklet.ts');
      console.log('Tone.js worklet module loaded successfully');
    } catch (error) {
      console.error('Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node
    this.workletNode = new AudioWorkletNode(audioContext, 'tonejs-worklet-processor', {
      processorOptions: {
        timeConstantMs: 16,
        sampleRate: audioContext.sampleRate,
      },
    });

    // Connect directly to the audio context destination
    this.workletNode.connect(audioContext.destination);

    this.isRunning = true;
    console.log('Tone.js synth started');
  }

  stop(): void {
    if (!this.isRunning) return;

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    this.isRunning = false;
    console.log('Tone.js synth stopped');
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
