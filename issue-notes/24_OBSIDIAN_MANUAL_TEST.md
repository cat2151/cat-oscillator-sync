# Manual Testing Guide for Obsidian Plugin

## Prerequisites

- Obsidian Desktop App installed (v0.15.0 or later)
- An Obsidian vault

## Installation Steps for Testing

1. **Build the plugin**
   ```bash
   cd src/obsidian
   npm install
   npm run build
   ```

2. **Locate your Obsidian plugins folder**
   - Windows: `%APPDATA%\Obsidian\[VaultName]\.obsidian\plugins\`
   - macOS: `~/Library/Application Support/obsidian/[VaultName]/.obsidian/plugins/`
   - Linux: `~/.config/obsidian/[VaultName]/.obsidian/plugins/`

3. **Create plugin directory**
   ```bash
   mkdir -p /path/to/vault/.obsidian/plugins/cat-oscillator-sync
   ```

4. **Copy plugin files**
   ```bash
   cp main.js /path/to/vault/.obsidian/plugins/cat-oscillator-sync/
   cp manifest.json /path/to/vault/.obsidian/plugins/cat-oscillator-sync/
   ```

5. **Enable the plugin**
   - Open Obsidian
   - Go to Settings → Community plugins
   - Make sure "Safe mode" is OFF
   - Find "Cat Oscillator Sync" in the installed plugins list
   - Toggle it ON

## Test Cases

### Test 1: Plugin Loads Successfully ✓
**Expected Result**: Plugin appears in the installed plugins list without errors

**Steps**:
1. Check Settings → Community plugins → Installed plugins
2. Verify "Cat Oscillator Sync" is listed
3. Check Developer Console (Ctrl/Cmd + Shift + I) for any errors

**Success Criteria**:
- Plugin is listed
- No errors in console
- Log message: "[CatOscillatorSync] Loading plugin"

### Test 2: Commands are Registered ✓
**Expected Result**: All commands appear in the command palette

**Steps**:
1. Open Command Palette (Ctrl/Cmd + P)
2. Type "oscillator" or "sync"
3. Check for these commands:
   - Toggle Oscillator Sync
   - Enable Oscillator Sync
   - Disable Oscillator Sync
   - Switch to Simple Version
   - Switch to Smooth Version

**Success Criteria**:
- All 5 commands are visible
- Commands are clickable

### Test 3: Enable Oscillator - Simple Version ✓
**Expected Result**: Audio starts playing when enabled

**Steps**:
1. Open Command Palette
2. Run "Enable Oscillator Sync"
3. Move mouse around the screen
4. Listen for audio output

**Success Criteria**:
- Audio starts playing
- Audio pitch changes with mouse movement
- Console logs:
  - "[CatOscillatorSync] Enabling oscillator (simple version)"
  - "[SimpleSynth] Creating AudioContext..."
  - "[SimpleSynth] Synth started successfully"
  - "[MouseHandler] Mouse tracking started"

**What to Observe**:
- Moving mouse LEFT → lower pitch (master frequency)
- Moving mouse RIGHT → higher pitch (master frequency)
- Moving mouse UP → higher pitch (slave frequency, creates more harmonics)
- Moving mouse DOWN → lower pitch (slave frequency, creates fewer harmonics)

### Test 4: Disable Oscillator ✓
**Expected Result**: Audio stops when disabled

**Steps**:
1. With oscillator running
2. Run "Disable Oscillator Sync"
3. Verify audio stops

**Success Criteria**:
- Audio stops immediately
- Console logs:
  - "[CatOscillatorSync] Disabling oscillator"
  - "[MouseHandler] Mouse tracking stopped"
  - "[SimpleSynth] Synth stopped"

### Test 5: Toggle Oscillator ✓
**Expected Result**: Oscillator toggles between on and off states

**Steps**:
1. Run "Toggle Oscillator Sync" - should enable
2. Verify audio is playing
3. Run "Toggle Oscillator Sync" again - should disable
4. Verify audio stops

**Success Criteria**:
- First toggle: audio starts
- Second toggle: audio stops
- Can toggle multiple times successfully

### Test 6: Switch to Smooth Version ✓
**Expected Result**: Switches to smooth version and restarts if running

**Steps**:
1. Enable oscillator (simple version)
2. Move mouse to hear the audio
3. Run "Switch to Smooth Version"
4. Move mouse again

**Success Criteria**:
- Audio continues playing after switch
- Console logs:
  - "[CatOscillatorSync] Switching to smooth version"
  - "[SmoothSynth] Creating AudioContext..."
  - "[SmoothSynth] Synth started successfully"
- Audio transitions are smoother (less abrupt frequency changes)

### Test 7: Switch Between Versions While Disabled ✓
**Expected Result**: Version switches without starting audio

**Steps**:
1. Make sure oscillator is disabled
2. Run "Switch to Simple Version"
3. Run "Switch to Smooth Version"
4. Run "Enable Oscillator Sync"

**Success Criteria**:
- No audio plays during version switches
- Last selected version starts when enabled
- Console shows version changes but no synth start/stop

### Test 8: Mouse Frequency Mapping ✓
**Expected Result**: Mouse position correctly maps to frequency ranges

**Steps**:
1. Enable oscillator
2. Test corner positions:
   - Top-left: Low master (40Hz), High slave (2000Hz)
   - Top-right: High master (600Hz), High slave (2000Hz)
   - Bottom-left: Low master (40Hz), Low slave (100Hz)
   - Bottom-right: High master (600Hz), Low slave (100Hz)

**Success Criteria**:
- Frequency changes smoothly across screen
- Corner positions produce expected frequency combinations
- No audio glitches or dropouts

### Test 9: Plugin Unload ✓
**Expected Result**: Plugin cleans up properly when disabled

**Steps**:
1. Enable oscillator
2. Disable the plugin in Settings
3. Check console for any errors

**Success Criteria**:
- Audio stops immediately
- Console logs:
  - "[CatOscillatorSync] Unloading plugin"
  - "[CatOscillatorSync] Disabling oscillator"
- No errors or warnings
- No memory leaks (check Task Manager/Activity Monitor)

### Test 10: Multiple Enable/Disable Cycles ✓
**Expected Result**: Plugin handles multiple on/off cycles without issues

**Steps**:
1. Enable oscillator
2. Disable oscillator
3. Repeat 10 times
4. Check for any degradation or errors

**Success Criteria**:
- All cycles work correctly
- No audio artifacts
- No error messages
- Performance remains consistent

## Known Limitations

1. **Desktop Only**: Plugin will not work on Obsidian mobile apps
2. **No Visual Feedback**: No UI elements showing current state or frequencies
3. **No Volume Control**: Audio volume is fixed
4. **No Preset System**: Cannot save/load frequency configurations

## Troubleshooting

### No Audio Output

**Check**:
1. System volume is not muted
2. Obsidian has audio permissions (check OS settings)
3. Browser/Electron audio is not blocked
4. Check Developer Console for errors

**Common Errors**:
- "AudioContext was not allowed to start": User interaction required before starting audio
- "Failed to load worklet module": Check that Blob URL creation is working

### Audio Glitches

**Possible Causes**:
1. High CPU usage - close other applications
2. Low polling interval - check if 8ms is too fast for the system
3. Audio buffer underruns - check AudioContext state

### Plugin Not Loading

**Check**:
1. Plugin files are in correct location
2. manifest.json is valid JSON
3. Safe mode is disabled
4. Obsidian version meets minimum requirement (0.15.0+)

## Performance Monitoring

### Expected Resource Usage

- **CPU**: 1-3% idle, 5-10% when audio is active
- **Memory**: ~5-10 MB additional
- **Audio Latency**: < 10ms for frequency updates

### Monitoring Tools

1. **Browser DevTools**
   - Performance tab for CPU profiling
   - Memory tab for memory leaks

2. **Console Logs**
   - Enable verbose logging to track state changes

## Reporting Issues

When reporting issues, please include:

1. Obsidian version
2. Operating System
3. Plugin version (0.1.0)
4. Console logs (Developer Tools → Console)
5. Steps to reproduce
6. Expected vs actual behavior

## Success Criteria Summary

✓ All test cases pass
✓ No console errors during normal operation
✓ Audio plays and responds to mouse movement
✓ Version switching works correctly
✓ Plugin cleans up properly on disable/unload
✓ No memory leaks after multiple cycles
✓ CPU usage remains reasonable

---

**Testing Date**: ___________  
**Tested By**: ___________  
**Obsidian Version**: ___________  
**OS**: ___________  
**Result**: ☐ PASS ☐ FAIL  
**Notes**: ___________
