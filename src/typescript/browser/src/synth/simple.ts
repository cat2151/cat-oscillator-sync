/**
 * Simple version synthesizer
 * Uses AudioWorklet with step-wise frequency updates
 */

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

    // Ensure AudioContext is resumed (required for some browsers)
    if (this.audioContext.state === 'suspended') {
      console.log('[SimpleSynth] Resuming suspended AudioContext...');
      await this.audioContext.resume();
      console.log('[SimpleSynth] AudioContext resumed, state:', this.audioContext.state);
    }

    // Load and add AudioWorklet module
    try {
      console.log('[SimpleSynth] Loading worklet module from /worklets/simple-worklet.js');
      const startTime = Date.now();
      
      // Add timeout to catch hanging addModule calls
      const timeoutMs = 10000; // 10 seconds
      const addModulePromise = this.audioContext.audioWorklet.addModule('/worklets/simple-worklet.js');
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Worklet loading timed out after ${timeoutMs}ms`)), timeoutMs)
      );
      
      await Promise.race([addModulePromise, timeoutPromise]);
      const elapsed = Date.now() - startTime;
      console.log(`[SimpleSynth] Worklet module loaded successfully in ${elapsed}ms`);
    } catch (error) {
      console.error('[SimpleSynth] Failed to load worklet module:', error);
      console.error('[SimpleSynth] Error details:', {
        name: error instanceof Error ? error.name : 'unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
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
