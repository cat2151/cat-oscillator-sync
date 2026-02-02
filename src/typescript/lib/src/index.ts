/**
 * cat-oscillator-sync-lib
 * 
 * A library for creating mouse-controlled hard sync oscillator synthesizers
 * that can be bundled with npm for use in Obsidian plugins and other web applications.
 * 
 * @example
 * ```typescript
 * import { SimpleSynth } from 'cat-oscillator-sync-lib';
 * 
 * const synth = new SimpleSynth();
 * await synth.start();
 * 
 * // Update frequencies based on mouse position
 * synth.updateFrequencies(freqMaster, freqSlave);
 * 
 * // Stop when done
 * synth.stop();
 * ```
 */

export { SimpleSynth } from './simple-synth';
export { SmoothSynth } from './smooth-synth';
export type { SmoothSynthOptions } from './smooth-synth';

/**
 * Utility function to map mouse position to frequency
 * 
 * @param value - Current value (e.g., mouse X or Y position)
 * @param inMin - Minimum input value (e.g., 0)
 * @param inMax - Maximum input value (e.g., screen width/height)
 * @param outMin - Minimum output frequency
 * @param outMax - Maximum output frequency
 * @returns Mapped frequency value
 */
export function mapToFrequency(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  // Handle edge case where input range is zero
  if (inMin === inMax) {
    return outMin;
  }
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Default frequency ranges used in the standard implementation
 */
export const DEFAULT_FREQUENCY_RANGES = {
  master: { min: 40, max: 600 },
  slave: { min: 100, max: 2000 },
} as const;
