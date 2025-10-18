/**
 * Simple version synthesizer
 * Uses AudioWorklet with step-wise frequency updates
 */

import { SIMPLE_WORKLET_CODE } from '../audio/simple-worklet';

export class SimpleSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    console.log('[SimpleSynth] start() called, isRunning:', this.isRunning);
    if (this.isRunning) return;

    // Create AudioContext
    console.log('[SimpleSynth] Creating AudioContext...');
    this.audioContext = new AudioContext({ sampleRate: 48000 });
    console.log('[SimpleSynth] AudioContext created, state:', this.audioContext.state);

    // Load AudioWorklet module via Blob URL
    try {
      console.log('[SimpleSynth] Loading worklet module via Blob...');
      const blob = new Blob([SIMPLE_WORKLET_CODE], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await this.audioContext.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl); // Clean up
      console.log('[SimpleSynth] Worklet module loaded successfully');
    } catch (error) {
      console.error('[SimpleSynth] Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node
    console.log('[SimpleSynth] Creating AudioWorkletNode...');
    this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-worklet-processor');
    console.log('[SimpleSynth] AudioWorkletNode created');

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);
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

    this.audioContext.close();
    this.audioContext = null;
    this.isRunning = false;
    console.log('[SimpleSynth] Synth stopped');
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
