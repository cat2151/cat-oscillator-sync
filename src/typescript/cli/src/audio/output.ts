// Audio output using the speaker package
// Provides real-time audio streaming on Windows

import Speaker from "speaker";

/**
 * Audio configuration
 */
export interface AudioConfig {
    sampleRate: number;
    channels: number;
    bitDepth: number;
    bufferSizeMs?: number; // Optional buffer size in milliseconds
}

/**
 * Audio callback function type
 * Called to fill the audio buffer with samples
 */
export type AudioCallback = (buffer: Int16Array, frameCount: number) => void;

/**
 * Audio output manager using speaker package
 */
export class AudioOutput {
    private speaker: Speaker;
    private config: AudioConfig;
    private callback: AudioCallback | null = null;
    private running = false;
    private framesPerBuffer = 0;

    constructor(config: AudioConfig) {
        this.config = config;

        // Calculate optimal highWaterMark based on buffer size
        // Default to 8ms if not specified (matches polling interval)
        const bufferSizeMs = config.bufferSizeMs ?? 8;
        const bytesPerMs = (config.sampleRate * config.channels * (config.bitDepth / 8)) / 1000;
        const highWaterMark = Math.floor(bytesPerMs * bufferSizeMs);

        this.speaker = new Speaker({
            channels: config.channels,
            bitDepth: config.bitDepth,
            sampleRate: config.sampleRate,
            highWaterMark: highWaterMark, // Set internal buffer size
        });

        this.speaker.on("error", (err) => {
            console.error("Speaker error:", err);
        });
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

        // Convert Int16Array to Buffer and write to speaker
        const buffer = Buffer.from(samples.buffer);
        const canContinue = this.speaker.write(buffer);

        // If the write buffer is full, wait for drain event
        if (!canContinue) {
            this.speaker.once("drain", () => {
                this.writeNextBuffer();
            });
        } else {
            // Continue writing immediately if buffer has space
            setImmediate(() => this.writeNextBuffer());
        }
    }

    /**
     * Start the audio stream
     */
    start(callback: AudioCallback, framesPerBuffer: number): void {
        this.callback = callback;
        this.framesPerBuffer = framesPerBuffer;
        this.running = true;

        // Start the audio generation loop
        this.writeNextBuffer();
    }

    /**
     * Stop the audio stream
     */
    stop(): void {
        this.running = false;
        this.speaker.end();
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
 */
export function createAudioOutput(
    sampleRate: number = 48000,
    channels: number = 1,
    bitDepth: number = 16,
    bufferSizeMs: number = 8 // Default to 8ms buffer (matches Go Oto version)
): AudioOutput {
    return new AudioOutput({
        sampleRate,
        channels,
        bitDepth,
        bufferSizeMs,
    });
}
