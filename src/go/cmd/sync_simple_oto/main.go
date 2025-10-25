package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
	"unsafe"

	"github.com/cat2151/cat-oscillator-sync/go/internal/mouse"
	"github.com/cat2151/cat-oscillator-sync/go/internal/synth"
	"github.com/ebitengine/oto/v3"
)

const (
	sampleRate        = 48000
	pollingIntervalMs = 8
	channelCount      = 1
	bufferSizeMs      = 16 // Target buffer size in milliseconds
	bitDepthInBytes   = 4  // Float32 = 4 bytes
)

var (
	osc *synth.SimpleOscillator
)

// audioReader implements io.Reader for generating audio samples
type audioReader struct {
	osc *synth.SimpleOscillator
}

func (ar *audioReader) Read(p []byte) (n int, err error) {
	// Calculate number of samples needed (p is in bytes, we need float32 samples)
	numSamples := len(p) / 4 // 4 bytes per float32
	samples := ar.osc.GenerateBlock(numSamples)

	// Convert float32 samples to byte slice
	for i, sample := range samples {
		// Convert float32 to little-endian bytes
		bits := *(*uint32)(unsafe.Pointer(&sample))
		offset := i * 4
		p[offset] = byte(bits)
		p[offset+1] = byte(bits >> 8)
		p[offset+2] = byte(bits >> 16)
		p[offset+3] = byte(bits >> 24)
	}

	return len(samples) * 4, nil
}

func main() {
	fmt.Println("🎵 Cat Oscillator Sync - Simple Version with Oto (Go)")
	fmt.Println("マウスを動かして音を制御してください")
	fmt.Println("X軸: マスター周波数 (40Hz - 600Hz)")
	fmt.Println("Y軸: スレーブ周波数 (100Hz - 2000Hz)")
	fmt.Println("Press Ctrl+C to exit")
	fmt.Println()
	fmt.Println("※ Pure Go実装 (CGO不要)")
	fmt.Println()

	// Get screen size
	screenWidth, screenHeight, err := mouse.GetScreenSize()
	if err != nil {
		fmt.Printf("Warning: Failed to get screen size: %v\n", err)
		fmt.Println("Using default screen size: 1920x1080")
		screenWidth, screenHeight = 1920, 1080
	}
	fmt.Printf("Screen size: %dx%d\n", screenWidth, screenHeight)

	// Create oscillator
	osc = synth.NewSimpleOscillator(sampleRate, screenWidth, screenHeight)

	// Get initial mouse position
	pos, err := mouse.GetPosition()
	if err != nil {
		fmt.Printf("Warning: Failed to get mouse position: %v\n", err)
		pos = mouse.Position{X: screenWidth / 2, Y: screenHeight / 2}
	}
	osc.UpdateFrequencies(pos.X, pos.Y)

	// Calculate buffer size in bytes from desired latency
	seconds := float64(bufferSizeMs) / 1000.0
	bytesPerSecond := float64(sampleRate * channelCount * bitDepthInBytes)
	bufferSizeInBytes := int(bytesPerSecond * seconds)
	fmt.Printf("目標とするレイテンシ: %d ms\n", bufferSizeMs)
	fmt.Printf("計算されたバッファサイズ: %d bytes\n", bufferSizeInBytes)

	// Initialize oto context with a large initial BufferSize
	// The actual buffer size will be set via player.SetBufferSize
	// Note: This large value (9999009) is intentional - the context's BufferSize
	// doesn't determine the actual buffer in oto v3. The real buffer size is set
	// later using player.SetBufferSize()
	op := &oto.NewContextOptions{
		SampleRate:   sampleRate,
		ChannelCount: channelCount,
		Format:       oto.FormatFloat32LE,
		BufferSize:   9999009, // Large initial value (doesn't determine actual buffer)
	}

	ctx, readyChan, err := oto.NewContext(op)
	if err != nil {
		fmt.Printf("Failed to initialize oto context: %v\n", err)
		os.Exit(1)
	}

	// Wait for the context to be ready
	<-readyChan

	fmt.Println("Audio context initialized")
	fmt.Println()

	// Create audio reader
	reader := &audioReader{osc: osc}

	// Create player
	player := ctx.NewPlayer(reader)

	// Set the actual buffer size using SetBufferSize
	player.SetBufferSize(bufferSizeInBytes)
	fmt.Printf("Buffer size set to: %d bytes (%dms)\n", bufferSizeInBytes, bufferSizeMs)

	player.Play()

	fmt.Println("Audio stream started")
	fmt.Println()

	// Setup signal handling for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	// Mouse polling loop
	ticker := time.NewTicker(time.Duration(pollingIntervalMs) * time.Millisecond)
	defer ticker.Stop()

	fmt.Println("マウスを動かして音を制御してください (Ctrl+C で終了)")

	for {
		select {
		case <-ticker.C:
			pos, err := mouse.GetPosition()
			if err != nil {
				// Silently continue on error
				continue
			}
			osc.UpdateFrequencies(pos.X, pos.Y)

		case <-sigChan:
			fmt.Println("\n終了しました。")
			player.Pause()
			return
		}
	}
}
