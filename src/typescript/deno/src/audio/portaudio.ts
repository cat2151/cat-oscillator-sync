// PortAudio FFI wrapper for audio output on Linux
// Uses libportaudio to handle audio stream

const libPortAudio = Deno.dlopen(
  "/lib/x86_64-linux-gnu/libportaudio.so.2",
  {
    Pa_Initialize: {
      parameters: [],
      result: "i32",
    },
    Pa_Terminate: {
      parameters: [],
      result: "i32",
    },
    Pa_GetDefaultOutputDevice: {
      parameters: [],
      result: "i32",
    },
    Pa_GetDeviceInfo: {
      parameters: ["i32"],
      result: "pointer",
    },
    Pa_OpenDefaultStream: {
      parameters: [
        "pointer", // stream
        "i32", // inputChannels
        "i32", // outputChannels
        "u32", // sampleFormat
        "f64", // sampleRate
        "u32", // framesPerBuffer
        "pointer", // callback
        "pointer", // userData
      ],
      result: "i32",
    },
    Pa_StartStream: {
      parameters: ["pointer"],
      result: "i32",
    },
    Pa_StopStream: {
      parameters: ["pointer"],
      result: "i32",
    },
    Pa_CloseStream: {
      parameters: ["pointer"],
      result: "i32",
    },
  } as const,
);

// PortAudio constants
const paFloat32 = 0x00000001;
const paFramesPerBufferUnspecified = 0;
const paNoError = 0;

let isInitialized = false;
let currentStream: Deno.PointerValue | null = null;

// Callback wrapper to keep reference alive
let callbackResource: Deno.UnsafeCallback | null = null;

/**
 * Initialize PortAudio
 */
export function initPortAudio(): void {
  if (isInitialized) return;

  const err = libPortAudio.symbols.Pa_Initialize();
  if (err !== paNoError) {
    throw new Error(`Pa_Initialize failed with error ${err}`);
  }
  isInitialized = true;
}

/**
 * Terminate PortAudio
 */
export function terminatePortAudio(): void {
  if (currentStream) {
    stopStream();
  }
  if (callbackResource) {
    callbackResource.close();
    callbackResource = null;
  }
  if (isInitialized) {
    libPortAudio.symbols.Pa_Terminate();
    isInitialized = false;
  }
}

/**
 * Audio callback function type
 */
export type AudioCallback = (
  outputBuffer: Float32Array,
  frameCount: number,
) => void;

/**
 * Open and start an audio stream
 */
export function openStream(
  sampleRate: number,
  framesPerBuffer: number,
  callback: AudioCallback,
): void {
  if (!isInitialized) {
    throw new Error("PortAudio not initialized. Call initPortAudio() first.");
  }

  // Create callback wrapper
  const callbackDefinition = {
    parameters: ["pointer", "pointer", "u32", "pointer", "u32", "pointer"],
    result: "i32",
  } as const;

  // deno-lint-ignore no-explicit-any
  callbackResource = new Deno.UnsafeCallback(
    callbackDefinition as any,
    (...args: unknown[]) => {
      const output = args[1] as Deno.PointerValue;
      const frameCount = args[2] as number;

      // Create Float32Array view of the output buffer
      if (output !== null) {
        const outputBuffer = new Float32Array(
          Deno.UnsafePointerView.getArrayBuffer(output, frameCount * 4),
        );

        // Call user callback
        callback(outputBuffer, frameCount);
      }

      return 0; // paContinue
    },
  ) as any;

  // Open stream
  const streamPtr = new BigUint64Array(1);
  const err = libPortAudio.symbols.Pa_OpenDefaultStream(
    Deno.UnsafePointer.of(streamPtr),
    0, // no input channels
    1, // mono output
    paFloat32,
    sampleRate,
    framesPerBuffer === 0 ? paFramesPerBufferUnspecified : framesPerBuffer,
    callbackResource!.pointer,
    null,
  );

  if (err !== paNoError) {
    callbackResource!.close();
    callbackResource = null;
    throw new Error(`Pa_OpenDefaultStream failed with error ${err}`);
  }

  // Store stream pointer
  currentStream = Deno.UnsafePointer.create(streamPtr[0]);

  // Start stream
  const startErr = libPortAudio.symbols.Pa_StartStream(currentStream);
  if (startErr !== paNoError) {
    libPortAudio.symbols.Pa_CloseStream(currentStream);
    currentStream = null;
    callbackResource!.close();
    callbackResource = null;
    throw new Error(`Pa_StartStream failed with error ${startErr}`);
  }
}

/**
 * Stop and close the audio stream
 */
export function stopStream(): void {
  if (currentStream) {
    libPortAudio.symbols.Pa_StopStream(currentStream);
    libPortAudio.symbols.Pa_CloseStream(currentStream);
    currentStream = null;
  }
  if (callbackResource) {
    callbackResource.close();
    callbackResource = null;
  }
}

/**
 * Get default output device info
 */
export function getDefaultOutputDeviceInfo(): {
  index: number;
  name: string;
  sampleRate: number;
} {
  if (!isInitialized) {
    throw new Error("PortAudio not initialized. Call initPortAudio() first.");
  }

  const deviceIndex = libPortAudio.symbols.Pa_GetDefaultOutputDevice();
  if (deviceIndex < 0) {
    throw new Error("No default output device found");
  }

  const deviceInfo = libPortAudio.symbols.Pa_GetDeviceInfo(deviceIndex);
  if (!deviceInfo) {
    throw new Error("Failed to get device info");
  }

  // Read device info struct (simplified - just read name and sample rate)
  const view = new Deno.UnsafePointerView(deviceInfo);
  // PaDeviceInfo struct layout (simplified):
  // int structVersion
  // const char *name
  // PaHostApiIndex hostApi
  // ...
  // double defaultSampleRate

  // Read name pointer (offset 8 bytes after structVersion)
  const namePtr = view.getPointer(8);
  const name = namePtr ? new Deno.UnsafePointerView(namePtr).getCString() : "Unknown";

  // Read defaultSampleRate (at offset 48 for typical struct)
  const sampleRate = view.getFloat64(48);

  return {
    index: deviceIndex,
    name,
    sampleRate,
  };
}
