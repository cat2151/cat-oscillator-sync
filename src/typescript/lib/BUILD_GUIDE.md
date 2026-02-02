# Library Build and Usage Guide

## Building the Library

```bash
cd src/typescript/lib
npm install
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate TypeScript declaration files (.d.ts)
3. Output everything to the `dist/` directory

## Package Structure

After building, the package has the following structure:

```
src/typescript/lib/
├── package.json          # Package metadata and dependencies
├── tsconfig.json         # TypeScript configuration
├── src/                  # Source TypeScript files
│   ├── index.ts          # Main entry point
│   ├── simple-synth.ts   # Simple synth implementation
│   ├── smooth-synth.ts   # Smooth synth implementation
│   └── worklets/         # AudioWorklet processors as strings
│       ├── simple-worklet.ts
│       └── smooth-worklet.ts
├── dist/                 # Compiled output (ignored by git)
│   ├── index.js          # Compiled JS
│   ├── index.d.ts        # TypeScript declarations
│   └── ...
└── test.html             # Simple test page
```

## Testing the Library

### Option 1: Using test.html

Open `test.html` in a browser that supports ES modules:

```bash
# Start a simple HTTP server (required for ES modules)
cd src/typescript/lib
python -m http.server 8000

# Then open http://localhost:8000/test.html in your browser
```

### Option 2: Using in Another Project

```bash
# In your project directory
npm install path/to/cat-oscillator-sync/src/typescript/lib

# Or from npm (once published)
npm install cat-oscillator-sync-lib
```

## Usage Examples

### Basic Example

```typescript
import { SimpleSynth } from 'cat-oscillator-sync-lib';

const synth = new SimpleSynth();
await synth.start();

// Control with mouse
document.addEventListener('mousemove', (e) => {
  const freqMaster = (e.clientX / window.innerWidth) * 560 + 40;
  const freqSlave = (1 - e.clientY / window.innerHeight) * 1900 + 100;
  synth.updateFrequencies(freqMaster, freqSlave);
});
```

### With Helper Functions

```typescript
import { 
  SmoothSynth, 
  mapToFrequency, 
  DEFAULT_FREQUENCY_RANGES 
} from 'cat-oscillator-sync-lib';

const synth = new SmoothSynth({ timeConstantMs: 16 });
await synth.start();

document.addEventListener('mousemove', (e) => {
  const freqMaster = mapToFrequency(
    e.clientX, 0, window.innerWidth,
    DEFAULT_FREQUENCY_RANGES.master.min,
    DEFAULT_FREQUENCY_RANGES.master.max
  );
  
  const freqSlave = mapToFrequency(
    e.clientY, 0, window.innerHeight,
    DEFAULT_FREQUENCY_RANGES.slave.max,
    DEFAULT_FREQUENCY_RANGES.slave.min
  );
  
  synth.updateFrequencies(freqMaster, freqSlave);
});
```

## Bundler Compatibility

This library is designed to work with modern JavaScript bundlers:

### webpack

Works out of the box with default webpack configuration.

### Rollup

Works with the standard ES module plugin:

```javascript
// rollup.config.js
export default {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'es'
  }
};
```

### esbuild (Obsidian Plugin)

Perfect for Obsidian plugins. The worklet code is bundled as a string:

```javascript
// esbuild.config.js
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['main.ts'],
  bundle: true,
  format: 'cjs',
  target: 'es2018',
  outfile: 'main.js',
}).catch(() => process.exit(1));
```

### Vite

Works seamlessly with Vite:

```javascript
// vite.config.js
export default {
  build: {
    lib: {
      entry: 'main.js',
      formats: ['es']
    }
  }
}
```

## How AudioWorklet Bundling Works

Traditional approach (doesn't work with bundlers):
```typescript
// This requires a separate file at runtime
await audioContext.audioWorklet.addModule('/worklet.js');
```

This library's approach (works with bundlers):
```typescript
// Worklet code is a string constant
const workletCode = `class Processor extends AudioWorkletProcessor { ... }`;

// Create blob URL at runtime
const blob = new Blob([workletCode], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);
await audioContext.audioWorklet.addModule(url);
URL.revokeObjectURL(url);
```

This allows the entire library to be bundled into a single file while still using AudioWorklet.

## TypeScript Support

The library includes full TypeScript type definitions:

```typescript
import type { SmoothSynthOptions } from 'cat-oscillator-sync-lib';

const options: SmoothSynthOptions = {
  timeConstantMs: 16,
  sampleRate: 48000
};
```

## Publishing to npm

To publish this library to npm (for maintainers):

```bash
cd src/typescript/lib

# Update version in package.json
npm version patch  # or minor, or major

# Publish
npm publish
```

## Troubleshooting

### "Module not found" errors

Make sure you've built the library:
```bash
npm run build
```

### AudioContext issues

The browser requires user interaction before creating an AudioContext. Always start the synth in response to a user action (click, keypress, etc.).

### Import errors in Obsidian

Obsidian uses CommonJS by default. Make sure your esbuild config uses `format: 'cjs'`.

## File Sizes

- Source (TypeScript): ~10 KB
- Compiled (JavaScript): ~8 KB
- Minified (production): ~4 KB

Perfect for including in plugins without bloating the bundle.
