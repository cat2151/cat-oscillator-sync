//go:build windows

package mouse

import (
	"fmt"
	"syscall"
	"unsafe"
)

var (
	user32               = syscall.NewLazyDLL("user32.dll")
	procGetCursorPos     = user32.NewProc("GetCursorPos")
	procGetSystemMetrics = user32.NewProc("GetSystemMetrics")
)

const (
	SM_CXSCREEN = 0
	SM_CYSCREEN = 1
)

type point struct {
	X, Y int32
}

// getPositionWindows gets the mouse cursor position on Windows
func getPositionWindows() (Position, error) {
	var pt point
	ret, _, err := procGetCursorPos.Call(uintptr(unsafe.Pointer(&pt)))
	if ret == 0 {
		return Position{}, fmt.Errorf("GetCursorPos failed: %v", err)
	}
	return Position{X: int(pt.X), Y: int(pt.Y)}, nil
}

// getScreenSizeWindows gets the screen size on Windows
func getScreenSizeWindows() (width, height int, err error) {
	w, _, _ := procGetSystemMetrics.Call(uintptr(SM_CXSCREEN))
	h, _, _ := procGetSystemMetrics.Call(uintptr(SM_CYSCREEN))
	return int(w), int(h), nil
}

// Stubs for Linux functions (not used on Windows)
func getPositionLinux() (Position, error) {
	return Position{}, fmt.Errorf("Linux support not available on Windows")
}

func getScreenSizeLinux() (int, int, error) {
	return 0, 0, fmt.Errorf("Linux support not available on Windows")
}
