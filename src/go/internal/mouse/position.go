package mouse

import (
	"fmt"
	"runtime"
)

// Position represents a mouse position on the screen
type Position struct {
	X int
	Y int
}

// GetPosition returns the current mouse cursor position (Windows only)
func GetPosition() (Position, error) {
	if runtime.GOOS == "windows" {
		return getPositionWindows()
	}
	return Position{}, fmt.Errorf("unsupported operating system: %s (Windows only)", runtime.GOOS)
}

// GetScreenSize returns the screen dimensions (Windows only)
func GetScreenSize() (width, height int, err error) {
	if runtime.GOOS == "windows" {
		return getScreenSizeWindows()
	}
	return 0, 0, fmt.Errorf("unsupported operating system: %s (Windows only)", runtime.GOOS)
}
