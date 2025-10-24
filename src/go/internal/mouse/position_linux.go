//go:build linux

package mouse

/*
#cgo LDFLAGS: -lX11
#include <X11/Xlib.h>
#include <stdlib.h>

typedef struct {
	int x;
	int y;
	int success;
} MousePos;

MousePos get_mouse_position() {
	MousePos result = {0, 0, 0};
	Display *display = XOpenDisplay(NULL);
	if (display == NULL) {
		return result;
	}

	Window root = DefaultRootWindow(display);
	Window root_return, child_return;
	int root_x, root_y, win_x, win_y;
	unsigned int mask_return;

	if (XQueryPointer(display, root, &root_return, &child_return,
	                  &root_x, &root_y, &win_x, &win_y, &mask_return)) {
		result.x = root_x;
		result.y = root_y;
		result.success = 1;
	}

	XCloseDisplay(display);
	return result;
}

typedef struct {
	int width;
	int height;
	int success;
} ScreenSize;

ScreenSize get_screen_size() {
	ScreenSize result = {0, 0, 0};
	Display *display = XOpenDisplay(NULL);
	if (display == NULL) {
		return result;
	}

	Screen *screen = DefaultScreenOfDisplay(display);
	if (screen != NULL) {
		result.width = WidthOfScreen(screen);
		result.height = HeightOfScreen(screen);
		result.success = 1;
	}

	XCloseDisplay(display);
	return result;
}
*/
import "C"
import (
	"fmt"
	"os/exec"
	"strconv"
	"strings"
)

// getPositionLinux gets the mouse cursor position on Linux using X11 directly (fast)
// Falls back to xdotool if X11 is not available
func getPositionLinux() (Position, error) {
	// Try X11 first (fast, direct C call)
	result := C.get_mouse_position()
	if result.success == 1 {
		return Position{X: int(result.x), Y: int(result.y)}, nil
	}

	// Fallback to xdotool if X11 is not available
	return getPositionLinuxXdotool()
}

// getPositionLinuxXdotool gets the mouse cursor position on Linux using xdotool (slow fallback)
func getPositionLinuxXdotool() (Position, error) {
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
		return Position{}, fmt.Errorf("failed to get mouse position (X11 unavailable and xdotool not installed): %v", err)
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

// getScreenSizeLinux gets the screen size on Linux using X11 directly (fast)
// Falls back to xdpyinfo if X11 is not available
func getScreenSizeLinux() (width, height int, err error) {
	// Try X11 first (fast, direct C call)
	result := C.get_screen_size()
	if result.success == 1 {
		return int(result.width), int(result.height), nil
	}

	// Fallback to xdpyinfo if X11 is not available
	return getScreenSizeLinuxXdpyinfo()
}

// getScreenSizeLinuxXdpyinfo gets the screen size on Linux using xdpyinfo (slow fallback)
func getScreenSizeLinuxXdpyinfo() (width, height int, err error) {
	cmd := exec.Command("xdpyinfo")
	output, err := cmd.Output()
	if err != nil {
		return 0, 0, fmt.Errorf("failed to get screen size (X11 unavailable and xdpyinfo not installed): %v", err)
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
