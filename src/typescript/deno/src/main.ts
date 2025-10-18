// Simple Hard Sync Oscillator
// Mouse X controls master frequency (40Hz - 600Hz)
// Mouse Y controls slave frequency (100Hz - 2000Hz)

import { closeDisplay, getMousePosition, getScreenSize, initDisplay } from "./mouse/position.ts";
import { getDefaultOutputDeviceInfo, initPortAudio, openStream, terminatePortAudio } from "./audio/portaudio.ts";

// Audio configuration
const SAMPLE_RATE = 48000;
const POLLING_INTERVAL_MS = 8;
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * POLLING_INTERVAL_MS) / 1000);

// Frequency ranges
const MASTER_FREQ_MIN = 40;
const MASTER_FREQ_MAX = 600;
const SLAVE_FREQ_MIN = 100;
const SLAVE_FREQ_MAX = 2000;

// Synthesizer state
class SynthState {
  freqMaster: number = 440;
  freqSlave: number = 880;
  phaseMaster: number = 0;
  phaseSlave: number = 0;
}

const state = new SynthState();

/**
 * Map a value from one range to another
 */
function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Audio callback - generates audio samples
 */
function audioCallback(outputBuffer: Float32Array, frameCount: number): void {
  const incMaster = state.freqMaster / SAMPLE_RATE;
  const incSlave = state.freqSlave / SAMPLE_RATE;

  for (let i = 0; i < frameCount; i++) {
    // Advance master phase
    state.phaseMaster += incMaster;

    // Check for master phase wrap (hard sync trigger)
    if (state.phaseMaster >= 1.0) {
      state.phaseMaster -= 1.0;
      // Reset slave phase when master wraps
      state.phaseSlave = 0.0;
    } else {
      // Advance slave phase
      state.phaseSlave += incSlave;
      if (state.phaseSlave >= 1.0) {
        state.phaseSlave -= 1.0;
      }
    }

    // Generate sawtooth wave from slave oscillator
    // Convert phase [0, 1) to amplitude [-1, 1]
    outputBuffer[i] = 2.0 * state.phaseSlave - 1.0;
  }
}

/**
 * Update frequencies based on mouse position
 */
function updateFrequencies(screenWidth: number, screenHeight: number): void {
  try {
    const pos = getMousePosition();

    // Map mouse X to master frequency
    state.freqMaster = mapRange(
      pos.x,
      0,
      screenWidth,
      MASTER_FREQ_MIN,
      MASTER_FREQ_MAX,
    );

    // Map mouse Y to slave frequency (inverted Y axis)
    state.freqSlave = mapRange(
      screenHeight - pos.y,
      0,
      screenHeight,
      SLAVE_FREQ_MIN,
      SLAVE_FREQ_MAX,
    );
  } catch (_error) {
    // If mouse position query fails, keep previous frequencies
  }
}

/**
 * Display status information
 */
function displayStatus(): void {
  const line = `\rMaster: ${state.freqMaster.toFixed(1)} Hz | Slave: ${state.freqSlave.toFixed(1)} Hz`;
  Deno.stdout.writeSync(new TextEncoder().encode(line));
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🎵 Cat Oscillator Sync - Simple Version (Deno + TypeScript)");
  console.log("マウスを動かして音を制御してください");
  console.log("X軸: マスター周波数 (40Hz - 600Hz)");
  console.log("Y軸: スレーブ周波数 (100Hz - 2000Hz)");
  console.log("Press Ctrl+C to exit");
  console.log();

  // Initialize X11 display
  if (!initDisplay()) {
    console.error("Failed to initialize X11 display");
    Deno.exit(1);
  }

  const screen = getScreenSize();
  console.log(`Screen size: ${screen.width}x${screen.height}`);

  // Initialize PortAudio
  try {
    initPortAudio();
    const deviceInfo = getDefaultOutputDeviceInfo();
    console.log(`Output device: ${deviceInfo.name}`);
    console.log(`Sample rate: ${SAMPLE_RATE} Hz`);
    console.log(`Buffer size: ${FRAMES_PER_BUFFER} frames`);
    console.log();
  } catch (error) {
    console.error("Failed to initialize PortAudio:", error);
    closeDisplay();
    Deno.exit(1);
  }

  // Open audio stream
  try {
    openStream(SAMPLE_RATE, FRAMES_PER_BUFFER, audioCallback);
  } catch (error) {
    console.error("Failed to open audio stream:", error);
    terminatePortAudio();
    closeDisplay();
    Deno.exit(1);
  }

  console.log("Audio stream started. Move your mouse to control the sound.");
  console.log();

  // Mouse polling loop
  let running = true;
  let statusCounter = 0;

  // Handle Ctrl+C
  Deno.addSignalListener("SIGINT", () => {
    running = false;
    console.log("\n\n終了しました。");
  });

  while (running) {
    // Update frequencies based on mouse position
    updateFrequencies(screen.width, screen.height);

    // Display status every ~500ms (every ~62 iterations at 8ms interval)
    if (++statusCounter >= 62) {
      displayStatus();
      statusCounter = 0;
    }

    // Sleep for polling interval
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
  }

  // Cleanup
  terminatePortAudio();
  closeDisplay();
}

// Run main function
if (import.meta.main) {
  main().catch((error) => {
    console.error("Error:", error);
    Deno.exit(1);
  });
}
