/**
 * Smooth version synthesizer
 * Uses AudioWorklet with exponential smoothing per sample
 */

import { SMOOTH_WORKLET_CODE } from '../audio/smooth-worklet';

export class SmoothSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    console.log('[SmoothSynth] start() called, isRunning:', this.isRunning);
    if (this.isRunning) return;

    // Create AudioContext
    console.log('[SmoothSynth] Creating AudioContext...');
    this.audioContext = new AudioContext({ sampleRate: 48000 });
    console.log('[SmoothSynth] AudioContext created, state:', this.audioContext.state);

    // Load AudioWorklet module via Blob URL
    try {
      console.log('[SmoothSynth] Loading worklet module via Blob...');
      const blob = new Blob([SMOOTH_WORKLET_CODE], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await this.audioContext.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl); // Clean up
      console.log('[SmoothSynth] Worklet module loaded successfully');
    } catch (error) {
      console.error('[SmoothSynth] Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node with options
    console.log('[SmoothSynth] Creating AudioWorkletNode...');
    this.workletNode = new AudioWorkletNode(this.audioContext, 'smooth-worklet-processor', {
      processorOptions: {
        timeConstantMs: 16, // Time constant in milliseconds
        sampleRate: this.audioContext.sampleRate,
      },
    });
    console.log('[SmoothSynth] AudioWorkletNode created');

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);
    console.log('[SmoothSynth] Connected to destination');

    this.isRunning = true;
    console.log('[SmoothSynth] Synth started successfully');
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
    console.log('[SmoothSynth] Synth stopped');
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
