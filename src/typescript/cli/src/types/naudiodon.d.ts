// Type definitions for naudiodon
// naudiodon doesn't provide official TypeScript types, so we define minimal types here

declare module "naudiodon" {
    import { Writable } from "stream";

    export interface AudioIOOptions {
        inOptions?: {
            channelCount?: number;
            sampleFormat?: number;
            sampleRate?: number;
            deviceId?: number;
            closeOnError?: boolean;
            framesPerBuffer?: number;
        };
        outOptions?: {
            channelCount?: number;
            sampleFormat?: number;
            sampleRate?: number;
            deviceId?: number;
            closeOnError?: boolean;
            framesPerBuffer?: number;
        };
    }

    export class AudioIO extends Writable {
        constructor(options: AudioIOOptions);
        start(): void;
        quit(): void;
    }

    export interface AudioDevice {
        id: number;
        name: string;
        maxInputChannels: number;
        maxOutputChannels: number;
        defaultSampleRate: number;
        defaultLowInputLatency: number;
        defaultLowOutputLatency: number;
        defaultHighInputLatency: number;
        defaultHighOutputLatency: number;
        hostAPIName: string;
    }

    export function getDevices(): AudioDevice[];
}
