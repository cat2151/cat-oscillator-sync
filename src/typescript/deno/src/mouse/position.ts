// X11 FFI wrapper for getting mouse position on Linux
// Uses libX11 to query the mouse cursor position

const libX11 = Deno.dlopen(
  "/lib/x86_64-linux-gnu/libX11.so.6",
  {
    XOpenDisplay: {
      parameters: ["pointer"],
      result: "pointer",
    },
    XCloseDisplay: {
      parameters: ["pointer"],
      result: "i32",
    },
    XQueryPointer: {
      parameters: [
        "pointer", // display
        "u64", // window
        "pointer", // root_return
        "pointer", // child_return
        "pointer", // root_x_return
        "pointer", // root_y_return
        "pointer", // win_x_return
        "pointer", // win_y_return
        "pointer", // mask_return
      ],
      result: "i32",
    },
    XDefaultRootWindow: {
      parameters: ["pointer"],
      result: "u64",
    },
  } as const,
);

let display: Deno.PointerValue | null = null;

/**
 * Initialize X11 display connection
 */
export function initDisplay(): boolean {
  display = libX11.symbols.XOpenDisplay(null);
  return display !== null;
}

/**
 * Close X11 display connection
 */
export function closeDisplay(): void {
  if (display) {
    libX11.symbols.XCloseDisplay(display);
    display = null;
  }
}

/**
 * Get current mouse position
 * @returns {x: number, y: number} Mouse coordinates
 */
export function getMousePosition(): { x: number; y: number } {
  if (!display) {
    throw new Error("Display not initialized. Call initDisplay() first.");
  }

  const rootWindow = libX11.symbols.XDefaultRootWindow(display);

  // Buffers for output parameters
  const rootReturn = new BigUint64Array(1);
  const childReturn = new BigUint64Array(1);
  const rootX = new Int32Array(1);
  const rootY = new Int32Array(1);
  const winX = new Int32Array(1);
  const winY = new Int32Array(1);
  const mask = new Uint32Array(1);

  const success = libX11.symbols.XQueryPointer(
    display,
    rootWindow,
    Deno.UnsafePointer.of(rootReturn),
    Deno.UnsafePointer.of(childReturn),
    Deno.UnsafePointer.of(rootX),
    Deno.UnsafePointer.of(rootY),
    Deno.UnsafePointer.of(winX),
    Deno.UnsafePointer.of(winY),
    Deno.UnsafePointer.of(mask),
  );

  if (!success) {
    throw new Error("Failed to query mouse pointer position");
  }

  return {
    x: rootX[0],
    y: rootY[0],
  };
}

/**
 * Get screen dimensions (simplified - returns common defaults)
 * For a more accurate implementation, we'd need to use XDisplayWidth/XDisplayHeight
 */
export function getScreenSize(): { width: number; height: number } {
  // For simplicity, using common resolution
  // A full implementation would use XDisplayWidth/XDisplayHeight
  return {
    width: 1920,
    height: 1080,
  };
}
