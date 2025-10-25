# Buffer Size Fix - Technical Explanation

**注意**: このドキュメントは `node-speaker` を使用していた時期の問題と解決策を説明しています。現在は `naudiodon` に移行しています。詳細は [NAUDIODON_MIGRATION.md](./NAUDIODON_MIGRATION.md) を参照してください。

**naudiodon での制限**: naudiodon (PortAudio) の内部バッファは約170msで、これ以下には減らせません。これはNode.jsで現在利用可能な最小のバッファサイズです。

---

## Problem

The TypeScript CLI implementation had a hidden latency issue similar to the Go Oto version buffer size problem that was manually discovered.

### Root Cause

The `speaker` package (v0.5.4) uses Node.js WritableStream with a **default highWaterMark of 16384 bytes**.

For 16-bit mono audio at 48kHz:
- **16384 bytes = 8192 samples = ~170ms** of audio buffering

Even though we were generating audio in 8ms chunks (384 frames = 768 bytes), the speaker's internal buffer was accumulating up to 170ms of audio before playing.

### Impact on Mouse Control

```
Mouse moves → Frequency changes → Queued in 170ms buffer → Audio plays
                 ↑                                              ↑
              Instant                                     170ms later
```

Result: Mouse control feels sluggish and unresponsive, with **~170ms latency**.

## Solution

Following the same approach as the Go Oto fix, we now **explicitly set the audio buffer size to 8ms**.

### Implementation

1. Added `bufferSizeMs` parameter to `AudioConfig` interface
2. Calculate optimal `highWaterMark` based on buffer size:
   ```typescript
   const bufferSizeMs = config.bufferSizeMs ?? 8; // Default 8ms
   const bytesPerMs = (sampleRate * channels * (bitDepth / 8)) / 1000;
   const highWaterMark = Math.floor(bytesPerMs * bufferSizeMs);
   ```
3. Pass `highWaterMark` to Speaker constructor
4. Default to 8ms buffer (matches polling interval and Go Oto version)

### Calculation Example

For 48kHz, mono, 16-bit audio with 8ms buffer:
```
bytesPerMs = (48000 * 1 * 2) / 1000 = 96 bytes/ms
highWaterMark = 96 * 8 = 768 bytes
```

This **768 bytes = 384 samples = 8ms** matches our FRAMES_PER_BUFFER exactly!

## Comparison with Go Oto Version

### Go Oto (src/go/cmd/sync_simple_oto/main.go)
```go
const bufferSizeMs = 8

op := &oto.NewContextOptions{
    SampleRate:   sampleRate,
    ChannelCount: channelCount,
    Format:       oto.FormatFloat32LE,
    BufferSize:   time.Duration(bufferSizeMs) * time.Millisecond,
}
```

### TypeScript CLI (now fixed)
```typescript
const BUFFER_SIZE_MS = 8;

const audioOutput = createAudioOutput(SAMPLE_RATE, 1, 16, BUFFER_SIZE_MS);

// Inside createAudioOutput:
const highWaterMark = Math.floor(bytesPerMs * bufferSizeMs);
new Speaker({ ..., highWaterMark });
```

Both implementations now use **8ms audio buffers** for minimal latency.

## Before vs After

### Before (Default)
- highWaterMark: 16384 bytes (default)
- Effective latency: **~170ms**
- Mouse control: Sluggish
- Buffer fills up with many chunks

### After (With Fix)
- highWaterMark: 768 bytes (8ms)
- Effective latency: **~8ms**
- Mouse control: Responsive
- Buffer size matches write size

## Benefits

1. **Minimal Latency**: 8ms audio buffer matches polling interval
2. **Responsive Control**: Mouse movements reflected in audio immediately
3. **Consistent with Go Version**: Same buffer size approach
4. **Configurable**: Buffer size can be adjusted if needed

## Testing

The fix is applied to:
- ✅ `main.ts` - Main program (simple and smooth versions)
- ✅ `test-frequency-sweep.ts` - Diagnostic script
- ✅ `test-mouse-audio.ts` - Diagnostic script
- ✅ `main-diagnostic.ts` - Diagnostic main program

Users can verify the improvement by:
1. Running `npm run diag:audio` - Should show more responsive frequency changes
2. Running `npm start` - Mouse control should feel much more responsive
3. Checking the console output showing "Audio buffer: 8 ms (low latency)"

## Technical Notes

### Why 8ms?

- Matches polling interval (8ms = 125Hz)
- Same as Go Oto version (proven to work well)
- Low enough for responsive control
- High enough to prevent audio glitches

### Can it be changed?

Yes! The buffer size is now a parameter:
```typescript
// Use 16ms buffer for even smoother audio (if needed)
createAudioOutput(48000, 1, 16, 16);
```

### Speaker Package Compatibility

The `speaker` package extends Node.js WritableStream, which accepts `highWaterMark` in the constructor options. This is standard Node.js API and should work with speaker v0.5.4+.

## References

- Go Oto buffer fix: `src/go/cmd/sync_simple_oto/main.go` (line 20, 86)
- Node.js WritableStream: https://nodejs.org/api/stream.html#writablehighwatermark
- Speaker package: https://www.npmjs.com/package/speaker
