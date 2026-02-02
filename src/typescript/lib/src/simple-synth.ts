/**
 * Simple version synthesizer
 * Uses AudioWorklet with step-wise frequency updates
 * 
 * This is a library version that can be imported into other projects
 * such as Obsidian plugins.
 */

import { SimpleWorkletProcessor } from './worklets/simple-worklet';

export class SimpleSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;
  private workletCode: string;

  constructor() {
    // Store the worklet code as a string to be registered as a blob URL
    this.workletCode = SimpleWorkletProcessor.toString();
  }

  async start(): Promise<void> {
    if (this.isRunning) return;

    // Create AudioContext
    this.audioContext = new AudioContext({ sampleRate: 48000 });

    // Register worklet from blob URL (works in bundled environments)
    try {
      const blob = new Blob([this.workletCode], { type: 'application/javascript' });
      const workletUrl = URL.createObjectURL(blob);
      await this.audioContext.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);
    } catch (error) {
      console.error('[SimpleSynth] Failed to load worklet module:', error);
      throw error;
    }

    // Create AudioWorklet node
    this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-worklet-processor');

    // Connect to output
    this.workletNode.connect(this.audioContext.destination);

    this.isRunning = true;
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
