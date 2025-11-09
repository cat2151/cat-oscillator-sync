import time

import numpy as np
import pyautogui
import sounddevice as sd

fs = 48000
polling_interval_ms = 8
blocksize = int(fs * polling_interval_ms / 1000)
screen_width, screen_height = pyautogui.size()

phase_master = 0.0
phase_slave = 0.0
freq_master = 100.0
freq_slave = 100.0


def synth_callback(outdata, frames, time_info, status):
    global phase_master, phase_slave, freq_master, freq_slave

    t = np.arange(frames)
    inc_master = freq_master / fs
    inc_slave = freq_slave / fs

    master_phase = (phase_master + inc_master * t) % 1.0
    slave_phase = (phase_slave + inc_slave * t) % 1.0

    # reset phase
    reset_points = np.where(np.diff(master_phase < inc_master))[0]
    for rp in reset_points:
        slave_phase[rp:] = (inc_slave * np.arange(frames - rp)) % 1.0

    out = (2.0 * slave_phase - 1.0).astype(np.float32)

    phase_master = master_phase[-1]
    phase_slave = slave_phase[-1]

    outdata[:] = out.reshape(-1, 1)


def main():
    global freq_master, freq_slave
    with sd.OutputStream(channels=1, callback=synth_callback, samplerate=fs, blocksize=blocksize):
        try:
            while True:
                x, y = pyautogui.position()
                freq_master = np.interp(x, [0, screen_width], [40, 600])
                freq_slave = np.interp(y, [0, screen_height], [2000, 100])
                time.sleep(polling_interval_ms / 1000)
        except KeyboardInterrupt:
            print("\n終了しました。")


if __name__ == "__main__":
    main()
