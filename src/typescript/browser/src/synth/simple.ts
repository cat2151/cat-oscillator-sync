/**
 * Simple version synthesizer
 * Uses AudioWorklet with step-wise frequency updates
 */

// Import worklet as URL using Vite's worker import syntax
import simpleWorkletUrl from '../audio/simple-worklet.ts?worker&url';
import { DEFAULT_VOLUME_DB } from '../constants';

export class SimpleSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    console.log('[SimpleSynth] start() called, isRunning:', this.isRunning);
    if (this.isRunning) return;

    // Create AudioContext
    console.log('[SimpleSynth] Creating AudioContext...');
    this.audioContext = new AudioContext({ sampleRate: 48000 });
    console.log('[SimpleSynth] AudioContext created, state:', this.audioContext.state);

    // Load and add AudioWorklet module
    try {
      console.log('[SimpleSynth] Loading worklet module...');
      console.log('[SimpleSynth] Worklet URL:', simpleWorkletUrl);
      await this.audioContext.audioWorklet.addModule(simpleWorkletUrl);
      console.log('[SimpleSynth] Worklet module loaded successfully');
    } catch (error) {
      console.error('[SimpleSynth] Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node
    console.log('[SimpleSynth] Creating AudioWorkletNode...');
    this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-worklet-processor');
    console.log('[SimpleSynth] AudioWorkletNode created');

    // Create gain node for volume control (default: -12 dB)
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = Math.pow(10, DEFAULT_VOLUME_DB / 20);

    // Connect: worklet -> gain -> output
    this.workletNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    console.log('[SimpleSynth] Connected to destination');

    this.isRunning = true;
    console.log('[SimpleSynth] Synth started successfully');
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
    console.log('Simple synth stopped');
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
