/**
 * Cat Oscillator Sync - Obsidian Plugin
 * Main plugin entry point
 */

import { Plugin } from 'obsidian';
import { SimpleSynth } from './synth/simple';
import { SmoothSynth } from './synth/smooth';
import { MouseHandler } from './mouse-handler';

type SynthVersion = 'simple' | 'smooth';
type Synth = SimpleSynth | SmoothSynth;

export default class CatOscillatorSyncPlugin extends Plugin {
  private synth: Synth | null = null;
  private mouseHandler: MouseHandler | null = null;
  private isEnabled: boolean = false;
  private currentVersion: SynthVersion = 'simple';

  async onload() {
    console.log('[CatOscillatorSync] Loading plugin');

    // Add toggle command
    this.addCommand({
      id: 'toggle-oscillator',
      name: 'Toggle Oscillator Sync',
      callback: () => {
        if (this.isEnabled) {
          this.disableOscillator();
        } else {
          this.enableOscillator();
        }
      }
    });

    // Add enable command
    this.addCommand({
      id: 'enable-oscillator',
      name: 'Enable Oscillator Sync',
      callback: () => this.enableOscillator()
    });

    // Add disable command
    this.addCommand({
      id: 'disable-oscillator',
      name: 'Disable Oscillator Sync',
      callback: () => this.disableOscillator()
    });

    // Add command to switch to simple version
    this.addCommand({
      id: 'switch-to-simple',
      name: 'Switch to Simple Version',
      callback: () => this.switchVersion('simple')
    });

    // Add command to switch to smooth version
    this.addCommand({
      id: 'switch-to-smooth',
      name: 'Switch to Smooth Version',
      callback: () => this.switchVersion('smooth')
    });

    console.log('[CatOscillatorSync] Plugin loaded');
  }

  onunload() {
    console.log('[CatOscillatorSync] Unloading plugin');
    this.disableOscillator();
  }

  private async enableOscillator(): Promise<void> {
    if (this.isEnabled) {
      console.log('[CatOscillatorSync] Already enabled');
      return;
    }

    try {
      console.log(`[CatOscillatorSync] Enabling oscillator (${this.currentVersion} version)`);

      // Create synth based on current version
      switch (this.currentVersion) {
        case 'simple':
          this.synth = new SimpleSynth();
          break;
        case 'smooth':
          this.synth = new SmoothSynth();
          break;
      }

      // Start synth
      await this.synth.start();

      // Start mouse tracking
      this.mouseHandler = new MouseHandler(this.synth);
      this.mouseHandler.start();

      this.isEnabled = true;
      console.log('[CatOscillatorSync] Oscillator enabled');
    } catch (error) {
      console.error('[CatOscillatorSync] Failed to enable oscillator:', error);
      // Clean up on error
      this.disableOscillator();
      throw error;
    }
  }

  private disableOscillator(): void {
    if (!this.isEnabled) {
      console.log('[CatOscillatorSync] Already disabled');
      return;
    }

    console.log('[CatOscillatorSync] Disabling oscillator');

    // Stop mouse tracking
    if (this.mouseHandler) {
      this.mouseHandler.stop();
      this.mouseHandler = null;
    }

    // Stop synth
    if (this.synth) {
      this.synth.stop();
      this.synth = null;
    }

    this.isEnabled = false;
    console.log('[CatOscillatorSync] Oscillator disabled');
  }

  private async switchVersion(version: SynthVersion): Promise<void> {
    console.log(`[CatOscillatorSync] Switching to ${version} version`);
    
    const wasEnabled = this.isEnabled;
    
    // Disable if running
    if (wasEnabled) {
      this.disableOscillator();
    }
    
    // Update version
    this.currentVersion = version;
    
    // Re-enable if it was running
    if (wasEnabled) {
      await this.enableOscillator();
    }
    
    console.log(`[CatOscillatorSync] Switched to ${version} version`);
  }
}
