//go:build linux

package mouse

import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// getPositionLinux gets the mouse cursor position on Linux using xdotool
func getPositionLinux() (Position, error) {
	// Try xdotool first
	cmd := exec.Command("xdotool", "getmouselocation", "--shell")
	output, err := cmd.Output()
	if err == nil {
		lines := strings.Split(string(output), "\n")
		var x, y int
		for _, line := range lines {
			if strings.HasPrefix(line, "X=") {
				x, _ = strconv.Atoi(strings.TrimPrefix(line, "X="))
			} else if strings.HasPrefix(line, "Y=") {
				y, _ = strconv.Atoi(strings.TrimPrefix(line, "Y="))
			}
		}
		return Position{X: x, Y: y}, nil
	}

	// Fallback to xdotool query pointer
	cmd = exec.Command("xdotool", "getmouselocation")
	output, err = cmd.Output()
	if err != nil {
		return Position{}, fmt.Errorf("failed to get mouse position (is xdotool installed?): %v", err)
	}

	// Parse output like "x:123 y:456 screen:0 window:12345"
	parts := strings.Fields(string(output))
	var x, y int
	for _, part := range parts {
		if strings.HasPrefix(part, "x:") {
			x, _ = strconv.Atoi(strings.TrimPrefix(part, "x:"))
		} else if strings.HasPrefix(part, "y:") {
			y, _ = strconv.Atoi(strings.TrimPrefix(part, "y:"))
		}
	}

	return Position{X: x, Y: y}, nil
}

// getScreenSizeLinux gets the screen size on Linux using xdpyinfo
func getScreenSizeLinux() (width, height int, err error) {
	cmd := exec.Command("xdpyinfo")
	output, err := cmd.Output()
	if err != nil {
		return 0, 0, fmt.Errorf("failed to get screen size (is xdpyinfo installed?): %v", err)
	}

	// Parse output to find "dimensions:    1920x1080 pixels"
	lines := strings.Split(string(output), "\n")
	for _, line := range lines {
		if strings.Contains(line, "dimensions:") {
			parts := strings.Fields(line)
			if len(parts) >= 2 {
				dims := strings.Split(parts[1], "x")
				if len(dims) == 2 {
					width, _ = strconv.Atoi(dims[0])
					height, _ = strconv.Atoi(dims[1])
					return width, height, nil
				}
			}
		}
	}

	return 1920, 1080, nil // Default fallback
}

// Stubs for Windows functions (not used on Linux)
func getPositionWindows() (Position, error) {
	return Position{}, fmt.Errorf("Windows support not available on Linux")
}

func getScreenSizeWindows() (int, int, error) {
	return 0, 0, fmt.Errorf("Windows support not available on Linux")
}
