/**
 * Mouse handler for tracking mouse position and updating frequencies
 */

import { SimpleSynth } from './synth/simple';
import { SmoothSynth } from './synth/smooth';

type Synth = SimpleSynth | SmoothSynth;

export class MouseHandler {
  private synth: Synth;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private pollingInterval: number | null = null;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(synth: Synth) {
    this.synth = synth;
    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
  }

  start(): void {
    // Add mouse event listener
    document.addEventListener('mousemove', this.mouseMoveHandler);
    
    // Start polling at 8ms intervals (125 Hz)
    this.pollingInterval = window.setInterval(() => {
      this.updateFrequencies();
    }, 8);
    
    console.log('[MouseHandler] Mouse tracking started');
  }

  stop(): void {
    // Remove mouse event listener
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    
    // Stop polling
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    
    console.log('[MouseHandler] Mouse tracking stopped');
  }

  private updateFrequencies(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Map mouse X to master frequency (40-600 Hz)
    const freqMaster = this.mapRange(this.mouseX, 0, screenWidth, 40, 600);
    
    // Map mouse Y to slave frequency (100-2000 Hz) - Y axis inverted
    const freqSlave = this.mapRange(this.mouseY, 0, screenHeight, 2000, 100);
    
    this.synth.updateFrequencies(freqMaster, freqSlave);
  }

  private mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}
