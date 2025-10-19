// Mouse position tracking for Windows using robotjs

import robot from "robotjs";

/**
 * Mouse position coordinates
 */
export interface MousePosition {
    x: number;
    y: number;
}

/**
 * Screen dimensions
 */
export interface ScreenSize {
    width: number;
    height: number;
}

/**
 * Get the current mouse position
 */
export function getMousePosition(): MousePosition {
    const pos = robot.getMousePos();
    return {
        x: pos.x,
        y: pos.y,
    };
}

/**
 * Get the screen size
 */
export function getScreenSize(): ScreenSize {
    const size = robot.getScreenSize();
    return {
        width: size.width,
        height: size.height,
    };
}
