package mouse

import (
	"testing"
)

func TestPosition(t *testing.T) {
	// Test that Position struct can be created
	pos := Position{X: 100, Y: 200}
	if pos.X != 100 || pos.Y != 200 {
		t.Errorf("Position initialization failed: got %v", pos)
	}
}

func TestGetScreenSize(t *testing.T) {
	// This test will only work in environments with display support
	// On headless systems, it should fail gracefully
	width, height, err := GetScreenSize()

	if err != nil {
		t.Logf("GetScreenSize failed (expected on headless systems): %v", err)
		return
	}

	if width <= 0 || height <= 0 {
		t.Errorf("Invalid screen size: %dx%d", width, height)
	}

	t.Logf("Screen size: %dx%d", width, height)
}

func TestGetPosition(t *testing.T) {
	// This test will only work in environments with display support
	// On headless systems, it should fail gracefully
	pos, err := GetPosition()

	if err != nil {
		t.Logf("GetPosition failed (expected on headless systems): %v", err)
		return
	}

	// Basic sanity check
	if pos.X < 0 || pos.Y < 0 {
		t.Errorf("Invalid position: %v", pos)
	}

	t.Logf("Mouse position: %v", pos)
}
