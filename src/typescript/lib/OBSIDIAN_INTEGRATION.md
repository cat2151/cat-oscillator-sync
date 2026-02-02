# Obsidian Plugin Integration Example

This guide shows how to integrate `cat-oscillator-sync-lib` into an Obsidian community plugin.

## Prerequisites

- Basic Obsidian plugin development knowledge
- Node.js and npm installed
- TypeScript knowledge

## Setup

### 1. Create or Use Existing Obsidian Plugin

If you don't have an Obsidian plugin yet, create one following the [Obsidian Plugin Template](https://github.com/obsidianmd/obsidian-sample-plugin).

### 2. Install the Library

In your plugin directory:

```bash
npm install cat-oscillator-sync-lib
```

Or if using the local version:

```bash
npm install ../../src/typescript/lib
```

### 3. Update Your Plugin Code

#### main.ts

```typescript
import { Plugin, Notice } from 'obsidian';
import { SimpleSynth, mapToFrequency, DEFAULT_FREQUENCY_RANGES } from 'cat-oscillator-sync-lib';

export default class OscillatorSyncPlugin extends Plugin {
  private synth: SimpleSynth | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

  async onload() {
    console.log('Loading Oscillator Sync Plugin');

    // Add ribbon icon
    this.addRibbonIcon('music', 'Toggle Oscillator', () => {
      if (this.synth) {
        this.stopOscillator();
      } else {
        this.startOscillator();
      }
    });

    // Add commands
    this.addCommand({
      id: 'start-oscillator',
      name: 'Start Oscillator',
      callback: () => this.startOscillator()
    });

    this.addCommand({
      id: 'stop-oscillator',
      name: 'Stop Oscillator',
      callback: () => this.stopOscillator()
    });
  }

  async startOscillator() {
    if (this.synth) {
      new Notice('Oscillator is already running');
      return;
    }

    try {
      this.synth = new SimpleSynth();
      await this.synth.start();
      
      // Track mouse movements
      this.mouseMoveHandler = (e: MouseEvent) => {
        if (!this.synth) return;
        
        const freqMaster = mapToFrequency(
          e.clientX,
          0,
          window.innerWidth,
          DEFAULT_FREQUENCY_RANGES.master.min,
          DEFAULT_FREQUENCY_RANGES.master.max
        );
        
        const freqSlave = mapToFrequency(
          e.clientY,
          0,
          window.innerHeight,
          DEFAULT_FREQUENCY_RANGES.slave.max, // Inverted Y
          DEFAULT_FREQUENCY_RANGES.slave.min
        );
        
        this.synth.updateFrequencies(freqMaster, freqSlave);
      };
      
      this.registerDomEvent(document, 'mousemove', this.mouseMoveHandler);
      
      new Notice('Oscillator started! Move your mouse to control the sound.');
    } catch (error) {
      console.error('Failed to start oscillator:', error);
      new Notice('Failed to start oscillator. Check console for details.');
      this.synth = null;
    }
  }

  stopOscillator() {
    if (!this.synth) {
      new Notice('Oscillator is not running');
      return;
    }

    this.synth.stop();
    this.synth = null;
    
    new Notice('Oscillator stopped');
  }

  onunload() {
    console.log('Unloading Oscillator Sync Plugin');
    this.stopOscillator();
  }
}
```

### 4. Update manifest.json

Ensure your plugin manifest includes appropriate metadata:

```json
{
  "id": "oscillator-sync",
  "name": "Oscillator Sync",
  "version": "0.1.0",
  "minAppVersion": "0.15.0",
  "description": "Mouse-controlled hard sync oscillator synthesizer",
  "author": "Your Name",
  "isDesktopOnly": false
}
```

### 5. Build Your Plugin

```bash
npm run build
```

## Usage

Once installed in Obsidian:

1. **Start the Oscillator**:
   - Click the music icon in the ribbon, or
   - Use Command Palette: "Start Oscillator"

2. **Control the Sound**:
   - Move your mouse across the screen
   - Horizontal (X) controls master frequency (40-600 Hz)
   - Vertical (Y) controls slave frequency (100-2000 Hz)

3. **Stop the Oscillator**:
   - Click the music icon again, or
   - Use Command Palette: "Stop Oscillator"

## Advanced Usage

### Using the Smooth Version

For smoother frequency transitions:

```typescript
import { SmoothSynth } from 'cat-oscillator-sync-lib';

// In your plugin
this.synth = new SmoothSynth({
  timeConstantMs: 16,  // Adjust smoothness (default: 16ms)
  sampleRate: 48000    // Sample rate (default: 48000)
});
```

### Adding Settings

You can add plugin settings to allow users to customize the experience:

```typescript
interface OscillatorSettings {
  masterFreqMin: number;
  masterFreqMax: number;
  slaveFreqMin: number;
  slaveFreqMax: number;
  smoothMode: boolean;
  timeConstantMs: number;
}

const DEFAULT_SETTINGS: OscillatorSettings = {
  masterFreqMin: 40,
  masterFreqMax: 600,
  slaveFreqMin: 100,
  slaveFreqMax: 2000,
  smoothMode: false,
  timeConstantMs: 16,
};

export default class OscillatorSyncPlugin extends Plugin {
  settings: OscillatorSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new OscillatorSettingTab(this.app, this));
    // ... rest of setup
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

## Bundler Configuration

The library is designed to work with standard bundlers. If you're using the Obsidian plugin template, it should work out of the box with rollup.

### For webpack users

No special configuration needed. The library uses standard ES modules and Web Audio API.

### For esbuild users

The default Obsidian sample plugin uses esbuild, which should work without issues:

```javascript
// esbuild.config.mjs
import esbuild from 'esbuild';

const prod = process.argv[2] === 'production';

esbuild.build({
  entryPoints: ['main.ts'],
  bundle: true,
  external: ['obsidian', 'electron'],
  format: 'cjs',
  target: 'es2018',
  logLevel: 'info',
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
}).catch(() => process.exit(1));
```

## Troubleshooting

### Audio Context Issues

If you get "AudioContext was not allowed to start" errors:

- This is a browser security feature
- The audio context must be started after a user interaction
- The plugin starts the synth in response to a user action (command/ribbon click), so this should not be an issue

### Performance Issues

If you experience performance issues:

1. Use the Simple version instead of Smooth
2. Reduce the mouse event frequency by throttling
3. Check browser developer console for errors

### Build Issues

If the library doesn't bundle correctly:

1. Ensure you have the latest version installed
2. Check that your bundler supports ES modules
3. Verify TypeScript configuration is correct

## Example Plugin Repository

For a complete working example, see:
- [Example Obsidian Plugin with Oscillator Sync](https://github.com/cat2151/cat-oscillator-sync) (link to example implementation)

## API Reference

See the main [README.md](README.md) for detailed API documentation.

## Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/cat2151/cat-oscillator-sync/issues)
2. Review the [main documentation](README.md)
3. Open a new issue with details about your setup

## License

MIT License - see LICENSE file for details
