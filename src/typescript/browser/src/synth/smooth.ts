/**
 * Smooth version synthesizer
 * Uses AudioWorklet with exponential smoothing per sample
 */

// Import worklet as URL using Vite's worker import syntax
import smoothWorkletUrl from '../audio/smooth-worklet.ts?worker&url';
import { DEFAULT_VOLUME_DB } from '../constants';

export class SmoothSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Create AudioContext
    this.audioContext = new AudioContext({ sampleRate: 48000 });

    // Load and add AudioWorklet module
    try {
      await this.audioContext.audioWorklet.addModule(smoothWorkletUrl);
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

    // Create gain node for volume control (default: -12 dB)
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = Math.pow(10, DEFAULT_VOLUME_DB / 20);

    // Connect: worklet -> gain -> output
    this.workletNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.isRunning = true;
    console.log('Smooth synth started');
  }

  stop(): void {
    if (!this.isRunning || !this.audioContext) return;

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    this.audioContext.close();
    this.audioContext = null;
    this.isRunning = false;
    console.log('Smooth synth stopped');
  }

  setVolume(db: number): void {
    if (this.gainNode && this.audioContext) {
      const targetGain = Math.pow(10, db / 20);
      const timeConstant = 0.01;
      this.gainNode.gain.setTargetAtTime(targetGain, this.audioContext.currentTime, timeConstant);
    }
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
