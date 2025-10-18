/**
 * Simple version AudioWorklet Processor
 * Implements hard sync oscillator with step-wise frequency changes
 */

class SimpleWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phaseMaster = 0;
    this.phaseSlave = 0;
    this.freqMaster = 100;
    this.freqSlave = 100;
    this.port.onmessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    const { type, freqMaster, freqSlave } = event.data;
    if (type === 'updateFrequencies') {
      this.freqMaster = freqMaster;
      this.freqSlave = freqSlave;
    }
  }

  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    const channel = output[0];
    const frames = channel.length;
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

registerProcessor('simple-worklet-processor', SimpleWorkletProcessor);
