/**
 * Tone.js compatible AudioWorklet Processor
 * Implements hard sync oscillator that works with Tone.js context
 */

// @ts-ignore - AudioWorkletProcessor is available in AudioWorklet scope
class ToneJSWorkletProcessor extends AudioWorkletProcessor {
  private phaseMaster: number = 0;
  private phaseSlave: number = 0;
  private currentFreqMaster: number = 100;
  private currentFreqSlave: number = 100;
  private targetFreqMaster: number = 100;
  private targetFreqSlave: number = 100;
  private smoothnessCoeff: number = 0.001;

  constructor(options?: AudioWorkletNodeOptions) {
    super();
    
    // Calculate smoothness coefficient from time constant
    const timeConstantMs = options?.processorOptions?.timeConstantMs || 16;
    const sr = options?.processorOptions?.sampleRate || 48000;
    const n = (timeConstantMs * sr) / 1000;
    this.smoothnessCoeff = 1.0 / n;
    
    // @ts-ignore - port is available on AudioWorkletProcessor
    this.port.onmessage = this.handleMessage.bind(this);
  }

  private handleMessage(event: MessageEvent) {
    const { type, freqMaster, freqSlave } = event.data;
    if (type === 'updateFrequencies') {
      this.targetFreqMaster = freqMaster;
      this.targetFreqSlave = freqSlave;
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

    for (let i = 0; i < frames; i++) {
      // Exponential smoothing
      this.currentFreqMaster += (this.targetFreqMaster - this.currentFreqMaster) * this.smoothnessCoeff;
      this.currentFreqSlave += (this.targetFreqSlave - this.currentFreqSlave) * this.smoothnessCoeff;

      const incMaster = this.currentFreqMaster / sr;
      const incSlave = this.currentFreqSlave / sr;

      // Update master phase
      this.phaseMaster += incMaster;
      if (this.phaseMaster >= 1.0) {
        this.phaseMaster -= 1.0;
        // Hard sync: reset slave phase
        this.phaseSlave = 0.0;
      }

      // Update slave phase
      this.phaseSlave += incSlave;
      if (this.phaseSlave >= 1.0) {
        this.phaseSlave -= 1.0;
      }

      // Generate sawtooth wave
      channel[i] = 2.0 * this.phaseSlave - 1.0;
    }

    return true;
  }
}

// @ts-ignore - registerProcessor is available in AudioWorklet scope
registerProcessor('tonejs-worklet-processor', ToneJSWorkletProcessor);
