# TypeScript CLI Version - Cat Oscillator Sync

Node.js CLI implementation of a mouse-controlled hard sync oscillator synthesizer for Windows.

## Overview

This is a command-line version of the Cat Oscillator Sync synthesizer that runs on Windows. It uses:
- **Mouse control**: Your mouse position controls the oscillator frequencies
- **Hard sync algorithm**: Two oscillators (master and slave) with phase reset synchronization
- **Real-time audio**: Audio output using naudiodon (PortAudio bindings)
  - **注意**: naudiodonの内部バッファは約170msで、これ以下には減らせません
  - Node.jsで現在利用可能な最小のバッファサイズです

## Requirements

- Windows 10 or Windows 11
- Node.js v20.0.0 or later
- Visual Studio Build Tools (for native module compilation)

## Quick Start

### Installation

```powershell
cd src/typescript/cli
npm install
npm run build
```

### Running

**Simple version:**
```powershell
npm start
```

**Smooth version:**
```powershell
node dist/main.js smooth
```

### Controls

- **X-axis (horizontal)**: Master oscillator frequency (40Hz - 600Hz)
- **Y-axis (vertical)**: Slave oscillator frequency (100Hz - 2000Hz)
- **Ctrl+C**: Exit

## Versions

### Simple Version
- Frequency changes immediately when mouse moves
- Direct step changes in frequency
- More "digital" sound character

### Smooth Version
- Frequency changes are smoothed using exponential filtering
- Gradual transitions between frequencies
- More "analog" sound character

## Architecture

```
Mouse Input (robotjs)
    ↓
Audio Buffer Callback (every 50ms)
    ↓
    1. Poll Mouse Position
    2. Map to Frequencies  
    3. Update Synthesizer
    4. Generate Audio Buffer
    ↓
Speaker Output
```

### Key Components

- **mouse/position.ts**: Mouse position capture using robotjs
- **synth/simple.ts**: Simple hard sync synthesizer
- **synth/smooth.ts**: Smooth hard sync synthesizer with exponential filtering
- **audio/output.ts**: Audio output using naudiodon (PortAudio) with callback-based buffer generation

## Troubleshooting

### Issue: Mouse frequency updates are slow (e.g., once per 10 seconds)

We've created comprehensive diagnostic tools to identify the root cause:

**Run diagnostics:**
```powershell
npm run diag:mouse   # Test mouse capture
npm run diag:freq    # Test audio frequency updates
npm run diag:audio   # Test mouse-audio integration
npm run diag:main    # Run diagnostic version of main program
```

**See detailed guides:**
- [DIAGNOSTIC_GUIDE.md](./DIAGNOSTIC_GUIDE.md) - User guide for running diagnostics
- [INVESTIGATION_REPORT.md](./INVESTIGATION_REPORT.md) - Technical investigation report
- [src/diagnostics/README.md](./src/diagnostics/README.md) - Technical details of diagnostic scripts

### Common Issues

#### Build fails with native module errors

**Solution:**
```powershell
# Install Visual Studio Build Tools
winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"

# Restart PowerShell/Command Prompt
# Retry installation
npm install
```

#### No sound output

**Checklist:**
1. Check Windows volume settings
2. Verify default audio device is correctly set
3. Test audio with other applications
4. Try restarting the computer

#### Mouse not responding

**Solution:**
1. Run PowerShell/Command Prompt as administrator
2. Check if security software is blocking robotjs
3. Reinstall robotjs:
   ```powershell
   npm uninstall robotjs
   npm install robotjs
   ```

## Performance

### Target Metrics

- **Audio buffer duration**: 50ms (20 updates/second)
- **Audio sample rate**: 48kHz
- **Buffer size**: 2400 frames (50ms @ 48kHz)
- **Frequency update rate**: 20Hz (every buffer)
- **Effective latency**: ~170ms (naudiodon internal buffer limitation)
- **CPU usage**: 1-5%
- **Memory usage**: 50-100MB

**注意**: naudiodon (PortAudio) の内部バッファは約170msあり、これはNode.jsで現在利用可能な最小のバッファサイズです。詳細は [NAUDIODON_MIGRATION.md](./NAUDIODON_MIGRATION.md) を参照してください。

### Measured Metrics (Expected)

Run the diagnostic scripts to measure actual performance on your system.

## Development

### Project Structure

```
src/typescript/cli/
├── src/
│   ├── main.ts                    # Main entry point
│   ├── mouse/
│   │   └── position.ts           # Mouse input
│   ├── synth/
│   │   ├── simple.ts             # Simple hard sync synth
│   │   └── smooth.ts             # Smooth hard sync synth
│   ├── audio/
│   │   └── output.ts             # Audio output
│   └── diagnostics/              # Diagnostic tools
│       ├── test-mouse-capture.ts
│       ├── test-frequency-sweep.ts
│       ├── test-mouse-audio.ts
│       ├── main-diagnostic.ts
│       └── README.md
├── package.json
├── tsconfig.json
├── DIAGNOSTIC_GUIDE.md           # User guide
├── INVESTIGATION_REPORT.md       # Technical report
└── README.md                     # This file
```

### Scripts

```json
{
  "build": "tsc",                  // Build TypeScript
  "start": "node dist/main.js",    // Run simple version
  "dev": "tsc && node dist/main.js",  // Build and run
  "diag:mouse": "...",             // Test mouse capture
  "diag:freq": "...",              // Test frequency updates
  "diag:audio": "...",             // Test integration
  "diag:main": "..."               // Run diagnostic main
}
```

### Building

```powershell
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

## Technical Details

### Hard Sync Algorithm

The synthesizer implements hard sync oscillation:

1. **Master oscillator** generates a phase signal at frequency `f_master`
2. **Slave oscillator** generates a phase signal at frequency `f_slave`
3. When master phase wraps around (0 → 1 transition), slave phase is **reset to 0**
4. Output is the slave oscillator's sawtooth wave

This creates characteristic harmonic-rich timbres that change based on the frequency ratio.

### Audio Pipeline

```
generateSamples() called by audio output
    ↓
For each sample:
    1. Smooth frequency (if smooth version)
    2. Advance master phase
    3. Check for master wrap → reset slave if wrapped
    4. Advance slave phase (if not reset)
    5. Generate sawtooth from slave phase
    6. Convert to 16-bit PCM
```

### Mouse Polling

Mouse polling now happens **inside the audio generation callback**, ensuring tight coupling between frequency updates and audio output:

```typescript
audioOutput.start((buffer, frameCount) => {
    // Poll mouse BEFORE generating each buffer
    const pos = getMousePosition();  // robotjs
    const freqMaster = mapRange(pos.x, ...);
    const freqSlave = mapRange(pos.y, ...);
    synth.setMasterFrequency(freqMaster);
    synth.setSlaveFrequency(freqSlave);
    
    // Generate audio with updated frequencies
    synth.generateSamples(buffer, frameCount);
}, FRAMES_PER_BUFFER);
```

This ensures frequency changes are reflected in the audio every 50ms (20 times per second).

### Frequency Smoothing (Smooth Version)

Exponential smoothing filter:
```typescript
freqCurrent += alpha * (freqTarget - freqCurrent);
```

Where `alpha = 1 - exp(-1 / (sampleRate * timeConstant))`.

Default time constant: 16ms

## Known Limitations

1. **Windows only**: Native modules (robotjs, naudiodon) are Windows-specific in this implementation
2. **No MIDI**: Only mouse control is supported
3. **Single channel**: Mono audio output only
4. **Buffer-driven updates**: Frequency updates occur at buffer boundaries (every 50ms)
5. **~170ms latency**: naudiodon (PortAudio) has an internal buffer of approximately 170ms that cannot be reduced further. This is currently the smallest buffer size available for Node.js audio output. For lower latency, consider using the browser version (Web Audio API ~3ms) or Python/Rust/Go versions (~8ms).

## Related Documentation

- Main project README: [../../README.md](../../README.md)
- Browser version: [../browser/](../browser/)
- Python version: [../../python/](../../python/)
- Rust version: [../../rust/](../../rust/)
- Go version: [../../go/](../../go/)

## License

MIT License (see repository root)

## Contributing

This is an experimental project demonstrating multi-language implementation of the same algorithm. Contributions welcome, especially for:

- Performance optimizations
- Cross-platform compatibility
- Alternative input methods
- Audio quality improvements

## Support

If you encounter issues:

1. Run the diagnostic scripts (see [DIAGNOSTIC_GUIDE.md](./DIAGNOSTIC_GUIDE.md))
2. Check the troubleshooting section above
3. Review existing GitHub Issues
4. Create a new issue with diagnostic results

## Acknowledgments

- Hard sync algorithm inspired by classic analog synthesizers
- Uses robotjs for mouse input
- Uses naudiodon (PortAudio bindings) for audio output
- Previous versions used node-speaker, migrated to naudiodon for better buffer control (see [NAUDIODON_MIGRATION.md](./NAUDIODON_MIGRATION.md))
