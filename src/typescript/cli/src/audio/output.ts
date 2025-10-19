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
    private intervalId: NodeJS.Timeout | null = null;

    constructor(config: AudioConfig) {
        this.config = config;
        this.speaker = new Speaker({
            channels: config.channels,
            bitDepth: config.bitDepth,
            sampleRate: config.sampleRate,
        });

        this.speaker.on("error", (err) => {
            console.error("Speaker error:", err);
        });
    }

    /**
     * Start the audio stream
     */
    start(callback: AudioCallback, framesPerBuffer: number): void {
        this.callback = callback;
        this.running = true;

        // Calculate buffer interval in milliseconds
        const intervalMs = (framesPerBuffer / this.config.sampleRate) * 1000;

        // Generate and write audio buffers at regular intervals
        this.intervalId = setInterval(() => {
            if (!this.running || !this.callback) return;

            // Create buffer for audio samples
            const samples = new Int16Array(framesPerBuffer * this.config.channels);

            // Call user callback to generate audio
            this.callback(samples, framesPerBuffer);

            // Convert Int16Array to Buffer and write to speaker
            const buffer = Buffer.from(samples.buffer);
            this.speaker.write(buffer);
        }, intervalMs);
    }

    /**
     * Stop the audio stream
     */
    stop(): void {
        this.running = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
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
    bitDepth: number = 16
): AudioOutput {
    return new AudioOutput({
        sampleRate,
        channels,
        bitDepth,
    });
}
