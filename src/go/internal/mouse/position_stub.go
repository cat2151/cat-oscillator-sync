//go:build !windows

package mouse

import "fmt"

// getPositionWindows is a stub for non-Windows platforms
func getPositionWindows() (Position, error) {
	return Position{}, fmt.Errorf("this application is Windows-only")
}

// getScreenSizeWindows is a stub for non-Windows platforms
func getScreenSizeWindows() (int, int, error) {
	return 0, 0, fmt.Errorf("this application is Windows-only")
}
