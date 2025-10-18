/**
 * Simple version AudioWorklet Processor
 * Implements hard sync oscillator with step-wise frequency changes
 */

// @ts-ignore - AudioWorkletProcessor is available in AudioWorklet scope
class SimpleWorkletProcessor extends AudioWorkletProcessor {
  private phaseMaster: number = 0;
  private phaseSlave: number = 0;
  private freqMaster: number = 100;
  private freqSlave: number = 100;

  constructor() {
    super();
    // @ts-ignore - port is available on AudioWorkletProcessor
    this.port.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage(event: MessageEvent) {
    const { type, freqMaster, freqSlave } = event.data;
    if (type === 'updateFrequencies') {
      this.freqMaster = freqMaster;
      this.freqSlave = freqSlave;
    }
  }

  process(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>
  ): boolean {
    const output = outputs[0];
    const channel = output[0];
    const frames = channel.length;
    // @ts-ignore - sampleRate is available in AudioWorklet scope
    const sr = sampleRate || 48000;

    const incMaster = this.freqMaster / sr;
    const incSlave = this.freqSlave / sr;

    for (let i = 0; i < frames; i++) {
      // Update master phase
      this.phaseMaster += incMaster;
      if (this.phaseMaster >= 1.0) {
        this.phaseMaster -= 1.0;
        // Hard sync: reset slave phase when master wraps
        this.phaseSlave = 0.0;
      }

      // Update slave phase
      this.phaseSlave += incSlave;
      if (this.phaseSlave >= 1.0) {
        this.phaseSlave -= 1.0;
      }

      // Generate sawtooth wave (-1.0 to 1.0)
      channel[i] = 2.0 * this.phaseSlave - 1.0;
    }

    return true;
  }
}

// @ts-ignore - registerProcessor is available in AudioWorklet scope
registerProcessor('simple-worklet-processor', SimpleWorkletProcessor);
