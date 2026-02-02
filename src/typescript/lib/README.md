# cat-oscillator-sync-lib

🎵 A TypeScript library for creating mouse-controlled hard sync oscillator synthesizers that can be bundled with npm for use in Obsidian plugins and other web applications.

## Features

- ✅ **Bundleable**: Works with npm bundlers (webpack, rollup, esbuild)
- ✅ **Two Versions**: Simple (stepped) and Smooth (exponential smoothing)
- ✅ **Web Audio API**: Low latency audio synthesis
- ✅ **TypeScript**: Full type definitions included
- ✅ **Obsidian Compatible**: Designed for Obsidian community plugin development
- ✅ **Zero Dependencies**: Pure Web Audio API implementation

## Installation

```bash
npm install cat-oscillator-sync-lib
```

Or for local development:

```bash
cd src/typescript/lib
npm install
npm run build
```

## Usage

### Basic Example (Simple Version)

```typescript
import { SimpleSynth } from 'cat-oscillator-sync-lib';

const synth = new SimpleSynth();

// Start the synthesizer
await synth.start();

// Update frequencies based on mouse position
document.addEventListener('mousemove', (e) => {
  const freqMaster = mapRange(e.clientX, 0, window.innerWidth, 40, 600);
  const freqSlave = mapRange(e.clientY, 0, window.innerHeight, 2000, 100);
  synth.updateFrequencies(freqMaster, freqSlave);
});

// Stop when done
synth.stop();

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
```

### Using the Smooth Version

```typescript
import { SmoothSynth } from 'cat-oscillator-sync-lib';

const synth = new SmoothSynth({
  timeConstantMs: 16, // Smoothing time constant (default: 16ms)
  sampleRate: 48000,  // Sample rate (default: 48000)
});

await synth.start();

// Update frequencies
synth.updateFrequencies(freqMaster, freqSlave);

// Stop
synth.stop();
```

### Using Utility Functions

```typescript
import { mapToFrequency, DEFAULT_FREQUENCY_RANGES } from 'cat-oscillator-sync-lib';

// Map mouse X to master frequency using default ranges
const freqMaster = mapToFrequency(
  mouseX,
  0,
  window.innerWidth,
  DEFAULT_FREQUENCY_RANGES.master.min,
  DEFAULT_FREQUENCY_RANGES.master.max
);

// Map mouse Y to slave frequency using default ranges  
const freqSlave = mapToFrequency(
  mouseY,
  0,
  window.innerHeight,
  DEFAULT_FREQUENCY_RANGES.slave.max, // Inverted Y axis
  DEFAULT_FREQUENCY_RANGES.slave.min
);
```

## API Reference

### SimpleSynth

Simple version with step-wise frequency updates.

#### Methods

- `async start(): Promise<void>` - Start the synthesizer
- `stop(): void` - Stop the synthesizer
- `updateFrequencies(freqMaster: number, freqSlave: number): void` - Update master and slave frequencies
- `getIsRunning(): boolean` - Check if synthesizer is running

### SmoothSynth

Smooth version with exponential smoothing per sample.

#### Constructor Options

```typescript
interface SmoothSynthOptions {
  timeConstantMs?: number; // Default: 16
  sampleRate?: number;     // Default: 48000
}
```

#### Methods

Same as SimpleSynth.

### Utility Functions

- `mapToFrequency(value, inMin, inMax, outMin, outMax): number` - Map a value to a frequency range
- `DEFAULT_FREQUENCY_RANGES` - Default frequency ranges used in the standard implementation
  - `master: { min: 40, max: 600 }`
  - `slave: { min: 100, max: 2000 }`

## Obsidian Plugin Example

Here's how to use this library in an Obsidian plugin:

```typescript
import { Plugin } from 'obsidian';
import { SimpleSynth } from 'cat-oscillator-sync-lib';

export default class OscillatorPlugin extends Plugin {
  private synth: SimpleSynth | null = null;

  async onload() {
    // Add command to start synth
    this.addCommand({
      id: 'start-oscillator',
      name: 'Start Oscillator',
      callback: async () => {
        if (!this.synth) {
          this.synth = new SimpleSynth();
          await this.synth.start();
          
          // Track mouse and update frequencies
          this.registerDomEvent(document, 'mousemove', (e: MouseEvent) => {
            if (this.synth) {
              const freqMaster = this.mapRange(e.clientX, 0, window.innerWidth, 40, 600);
              const freqSlave = this.mapRange(e.clientY, 0, window.innerHeight, 2000, 100);
              this.synth.updateFrequencies(freqMaster, freqSlave);
            }
          });
        }
      }
    });

    // Add command to stop synth
    this.addCommand({
      id: 'stop-oscillator',
      name: 'Stop Oscillator',
      callback: () => {
        if (this.synth) {
          this.synth.stop();
          this.synth = null;
        }
      }
    });
  }

  onunload() {
    if (this.synth) {
      this.synth.stop();
    }
  }

  private mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}
```

## Technical Details

### How It Works

This library implements a hard sync oscillator where:

1. **Master Oscillator**: Runs at the master frequency (40-600 Hz)
2. **Slave Oscillator**: Runs at the slave frequency (100-2000 Hz)
3. **Hard Sync**: When the master oscillator completes a cycle, it resets the slave oscillator's phase

This creates rich harmonic content that changes based on the frequency ratio.

### AudioWorklet

The library uses Web Audio API's AudioWorklet for low-latency audio processing. The worklet code is bundled as a string and loaded dynamically via Blob URL, making it compatible with bundlers like webpack and esbuild.

### Simple vs Smooth

- **Simple**: Frequency changes are applied immediately every 8ms
- **Smooth**: Frequency changes use exponential smoothing for musical transitions

## Building from Source

```bash
cd src/typescript/lib
npm install
npm run build
```

The compiled JavaScript and TypeScript declarations will be in the `dist/` directory.

## License

MIT License - see LICENSE file for details

## Related Projects

- [cat-oscillator-sync](https://github.com/cat2151/cat-oscillator-sync) - The main repository with implementations in Python, Rust, Go, and TypeScript
- [GitHub Pages Demo](https://cat2151.github.io/cat-oscillator-sync/) - Try the browser version online

## About Hard Sync

Hard sync is an audio synthesis technique where one oscillator (the master) forcibly resets the phase of another oscillator (the slave). This generates rich, harmonic timbres that change based on the ratio of the master and slave frequencies. It's a technique commonly used in classic analog synthesizers.
