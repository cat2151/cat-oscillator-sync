// Audio output using the naudiodon package (PortAudio bindings)
// Provides real-time audio streaming on Windows
//
// NOTE: naudiodon has an internal buffer that cannot be reduced below ~170ms.
// This is currently the smallest buffer size available for Node.js audio output.
// The bufferSizeMs parameter is kept for API compatibility but has limited effect.

import { AudioIO } from "naudiodon";

/**
 * Audio configuration
 */
export interface AudioConfig {
    sampleRate: number;
    channels: number;
    bitDepth: number;
    bufferSizeMs?: number; // Optional buffer size in milliseconds (note: has limited effect with naudiodon)
}

/**
 * Audio callback function type
 * Called to fill the audio buffer with samples
 */
export type AudioCallback = (buffer: Int16Array, frameCount: number) => void;

/**
 * Audio output manager using naudiodon package
 * 
 * IMPORTANT: naudiodon (PortAudio) has an internal buffer of approximately 170ms
 * that cannot be reduced further. This is a limitation of the current Node.js
 * audio libraries. While we specify buffer parameters, the actual latency will
 * be around 170ms minimum.
 */
export class AudioOutput {
    private audioOutput: any; // AudioIO instance
    private config: AudioConfig;
    private callback: AudioCallback | null = null;
    private running = false;
    private framesPerBuffer = 0;

    constructor(config: AudioConfig) {
        this.config = config;

        // Calculate buffer size based on requested buffer duration
        // Default to 50ms if not specified (matches current implementation)
        const bufferSizeMs = config.bufferSizeMs ?? 50;
        const framesPerBuffer = Math.floor((config.sampleRate * bufferSizeMs) / 1000);

        // Create naudiodon AudioIO output stream
        // NOTE: Despite these settings, naudiodon's internal buffer is ~170ms
        this.audioOutput = new AudioIO({
            outOptions: {
                channelCount: config.channels,
                sampleFormat: config.bitDepth, // 16 or 32
                sampleRate: config.sampleRate,
                deviceId: -1, // -1 for default device
                closeOnError: true,
                framesPerBuffer: framesPerBuffer,
            }
        });

        this.audioOutput.on("error", (err: Error) => {
            console.error("AudioIO error:", err);
        });

        // Log the effective buffer size
        console.log(`Audio configuration:`);
        console.log(`  Sample rate: ${config.sampleRate} Hz`);
        console.log(`  Channels: ${config.channels}`);
        console.log(`  Bit depth: ${config.bitDepth}`);
        console.log(`  Requested buffer: ${bufferSizeMs} ms`);
        console.log(`  NOTE: naudiodon internal buffer is ~170ms (cannot be reduced further)`);
    }

    /**
     * Write next audio buffer to the stream
     */
    private writeNextBuffer(): void {
        if (!this.running || !this.callback) return;

        // Create buffer for audio samples
        const samples = new Int16Array(this.framesPerBuffer * this.config.channels);

        // Call user callback to generate audio
        this.callback(samples, this.framesPerBuffer);

        // Convert Int16Array to Buffer and write to audioOutput
        const buffer = Buffer.from(samples.buffer);
        
        // Use callback-based write for better timing control
        // This ensures the next buffer is generated only after the current one is written
        this.audioOutput.write(buffer, (err?: Error | null) => {
            if (err) {
                console.error('Error writing to audio output:', err);
                return;
            }
            // Schedule next buffer generation using setImmediate to avoid blocking event loop
            setImmediate(() => this.writeNextBuffer());
        });
    }

    /**
     * Start the audio stream
     */
    start(callback: AudioCallback, framesPerBuffer: number): void {
        this.callback = callback;
        this.framesPerBuffer = framesPerBuffer;
        this.running = true;

        console.log(`Starting audio stream with ${framesPerBuffer} frames per buffer`);
        console.log(`This corresponds to ${(framesPerBuffer / this.config.sampleRate * 1000).toFixed(1)} ms per buffer`);

        // Start the audio output stream
        this.audioOutput.start();

        // Start the audio generation loop
        this.writeNextBuffer();
    }

    /**
     * Stop the audio stream
     */
    stop(): void {
        this.running = false;
        if (this.audioOutput) {
            this.audioOutput.quit();
        }
    }

    /**
     * Get the current audio configuration
     */
    getConfig(): AudioConfig {
        return { ...this.config };
    }
}

/**
 * Create and initialize an audio output
 * 
 * NOTE: The bufferSizeMs parameter is kept for API compatibility, but naudiodon
 * has an internal buffer of ~170ms that cannot be reduced. This is currently
 * the best available option for Node.js audio output.
 */
export function createAudioOutput(
    sampleRate: number = 48000,
    channels: number = 1,
    bitDepth: number = 16,
    bufferSizeMs: number = 50 // Default to 50ms buffer (but effective latency is ~170ms)
): AudioOutput {
    return new AudioOutput({
        sampleRate,
        channels,
        bitDepth,
        bufferSizeMs,
    });
}
