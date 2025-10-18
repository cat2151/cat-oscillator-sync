/**
 * Smooth version AudioWorklet Processor
 * Implements hard sync oscillator with exponential smoothing per sample
 */

class SmoothWorkletProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.phaseMaster = 0;
    this.phaseSlave = 0;
    this.currentFreqMaster = 100;
    this.currentFreqSlave = 100;
    this.targetFreqMaster = 100;
    this.targetFreqSlave = 100;
    this.smoothnessCoeff = 0.001;
    
    // Calculate smoothness coefficient from time constant
    // Default time constant: 16ms
    const timeConstantMs = options?.processorOptions?.timeConstantMs || 16;
    const sr = options?.processorOptions?.sampleRate || 48000;
    const n = (timeConstantMs * sr) / 1000;
    this.smoothnessCoeff = 1.0 / n;
    
    this.port.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    const { type, freqMaster, freqSlave } = event.data;
    if (type === 'updateFrequencies') {
      this.targetFreqMaster = freqMaster;
      this.targetFreqSlave = freqSlave;
    }
  }

  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    const channel = output[0];
    const frames = channel.length;
    const sr = sampleRate || 48000;

    for (let i = 0; i < frames; i++) {
      // Exponential smoothing: gradually approach target frequencies
      this.currentFreqMaster += (this.targetFreqMaster - this.currentFreqMaster) * this.smoothnessCoeff;
      this.currentFreqSlave += (this.targetFreqSlave - this.currentFreqSlave) * this.smoothnessCoeff;

      // Calculate phase increments based on current (smoothed) frequencies
      const incMaster = this.currentFreqMaster / sr;
      const incSlave = this.currentFreqSlave / sr;

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

registerProcessor('smooth-worklet-processor', SmoothWorkletProcessor);
