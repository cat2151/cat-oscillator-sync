package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/cat2151/cat-oscillator-sync/go/internal/mouse"
	"github.com/cat2151/cat-oscillator-sync/go/internal/synth"
	"github.com/gordonklaus/portaudio"
)

const (
	sampleRate        = 48000
	timeConstantMs    = 16 // Time constant for exponential smoothing (ms)
	pollingIntervalMs = 8  // Mouse polling interval (ms)
)

var (
	osc *synth.SmoothOscillator
)

func main() {
	fmt.Println("🎵 Cat Oscillator Sync - Smooth Version (Go)")
	fmt.Println("マウスを動かして音を制御してください")
	fmt.Println("X軸: マスター周波数 (40Hz - 600Hz)")
	fmt.Println("Y軸: スレーブ周波数 (100Hz - 2000Hz)")
	fmt.Println("Press Ctrl+C to exit")
	fmt.Println()

	// Get screen size
	screenWidth, screenHeight, err := mouse.GetScreenSize()
	if err != nil {
		fmt.Printf("Warning: Failed to get screen size: %v\n", err)
		fmt.Println("Using default screen size: 1920x1080")
		screenWidth, screenHeight = 1920, 1080
	}
	fmt.Printf("Screen size: %dx%d\n", screenWidth, screenHeight)

	// Initialize PortAudio
	if err := portaudio.Initialize(); err != nil {
		fmt.Printf("Failed to initialize PortAudio: %v\n", err)
		os.Exit(1)
	}
	defer portaudio.Terminate()

	// Create oscillator
	blocksize := sampleRate * pollingIntervalMs / 1000
	osc = synth.NewSmoothOscillator(sampleRate, timeConstantMs, screenWidth, screenHeight)

	// Print settings
	fmt.Println("設定:")
	fmt.Printf("  時定数: %dms (約63%%到達時間)\n", timeConstantMs)
	fmt.Printf("  滑らかさ係数: %.6f\n", osc.GetSmoothnessCoeff())
	fmt.Printf("  ポーリング間隔: %dms (%.1f Hz)\n", pollingIntervalMs, 1000.0/float64(pollingIntervalMs))
	fmt.Printf("  ブロックサイズ: %d samples (%.1f ms)\n", blocksize, float64(blocksize)/float64(sampleRate)*1000)
	fmt.Println()

	// Open audio stream
	stream, err := portaudio.OpenDefaultStream(0, 1, float64(sampleRate), blocksize, processAudio)
	if err != nil {
		fmt.Printf("Failed to open audio stream: %v\n", err)
		os.Exit(1)
	}
	defer stream.Close()

	// Get initial mouse position
	pos, err := mouse.GetPosition()
	if err != nil {
		fmt.Printf("Warning: Failed to get mouse position: %v\n", err)
		pos = mouse.Position{X: screenWidth / 2, Y: screenHeight / 2}
	}
	osc.UpdateTarget(pos.X, pos.Y)

	// Start audio stream
	if err := stream.Start(); err != nil {
		fmt.Printf("Failed to start audio stream: %v\n", err)
		os.Exit(1)
	}
	defer stream.Stop()

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
			osc.UpdateTarget(pos.X, pos.Y)

		case <-sigChan:
			fmt.Println("\n終了しました。")
			return
		}
	}
}

// processAudio is the audio callback function
func processAudio(out []float32) {
	samples := osc.GenerateBlock(len(out))
	copy(out, samples)
}
