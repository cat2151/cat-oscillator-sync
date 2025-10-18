/**
 * Main application entry point
 * Handles UI interactions and mouse tracking
 */

import { SimpleSynth } from './synth/simple';
import { SmoothSynth } from './synth/smooth';

type SynthVersion = 'simple' | 'smooth';
type Synth = SimpleSynth | SmoothSynth;

class App {
  private synth: Synth | null = null;
  private currentVersion: SynthVersion = 'simple';
  private mouseX: number = 0;
  private mouseY: number = 0;
  private screenWidth: number = window.innerWidth;
  private screenHeight: number = window.innerHeight;
  private pollingInterval: number | null = null;

  // UI elements
  private startBtn: HTMLButtonElement;
  private stopBtn: HTMLButtonElement;
  private freqDisplay: HTMLElement;
  private masterFreqEl: HTMLElement;
  private slaveFreqEl: HTMLElement;
  private mousePosEl: HTMLElement;
  private versionRadios: NodeListOf<HTMLInputElement>;

  constructor() {
    // Get UI elements
    this.startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    this.stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
    this.freqDisplay = document.getElementById('freqDisplay') as HTMLElement;
    this.masterFreqEl = document.getElementById('masterFreq') as HTMLElement;
    this.slaveFreqEl = document.getElementById('slaveFreq') as HTMLElement;
    this.mousePosEl = document.getElementById('mousePos') as HTMLElement;
    this.versionRadios = document.querySelectorAll('input[name="version"]');

    // Set up event listeners
    this.startBtn.addEventListener('click', () => this.handleStart());
    this.stopBtn.addEventListener('click', () => this.handleStop());
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('resize', () => this.handleResize());
    
    this.versionRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          this.currentVersion = target.value as SynthVersion;
          console.log(`Version changed to: ${this.currentVersion}`);
        }
      });
    });
  }

  private async handleStart(): Promise<void> {
    try {
      this.startBtn.disabled = true;
      
      // Create synth based on selected version
      switch (this.currentVersion) {
        case 'simple':
          this.synth = new SimpleSynth();
          break;
        case 'smooth':
          this.synth = new SmoothSynth();
          break;
      }

      await this.synth.start();
      
      // Start polling mouse position and updating frequencies
      this.startPolling();
      
      this.stopBtn.disabled = false;
      this.freqDisplay.classList.add('active');
      
      // Disable version selection while running
      this.versionRadios.forEach(radio => {
        (radio as HTMLInputElement).disabled = true;
      });
      
      console.log(`Started ${this.currentVersion} version`);
    } catch (error) {
      console.error('Failed to start synth:', error);
      this.startBtn.disabled = false;
      alert('音声の開始に失敗しました。ブラウザの設定を確認してください。');
    }
  }

  private handleStop(): void {
    if (this.synth) {
      this.synth.stop();
      this.synth = null;
    }

    this.stopPolling();
    
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.freqDisplay.classList.remove('active');
    
    // Enable version selection
    this.versionRadios.forEach(radio => {
      (radio as HTMLInputElement).disabled = false;
    });
    
    console.log('Stopped synth');
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private handleResize(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  private startPolling(): void {
    // Poll every 8ms (125 Hz) like Python version
    const pollingIntervalMs = 8;
    
    this.pollingInterval = window.setInterval(() => {
      this.updateFrequencies();
    }, pollingIntervalMs);
  }

  private stopPolling(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private updateFrequencies(): void {
    if (!this.synth) return;

    // Map mouse X to master frequency (40-600 Hz)
    const freqMaster = this.mapRange(this.mouseX, 0, this.screenWidth, 40, 600);
    
    // Map mouse Y to slave frequency (100-2000 Hz) - inverted Y axis
    const freqSlave = this.mapRange(this.mouseY, 0, this.screenHeight, 2000, 100);

    // Update synth
    this.synth.updateFrequencies(freqMaster, freqSlave);

    // Update display
    this.masterFreqEl.textContent = freqMaster.toFixed(1);
    this.slaveFreqEl.textContent = freqSlave.toFixed(1);
    this.mousePosEl.textContent = `${this.mouseX}, ${this.mouseY}`;
  }

  private mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
