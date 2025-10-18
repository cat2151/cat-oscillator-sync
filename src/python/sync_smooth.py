import time

import numpy as np
import pyautogui
import sounddevice as sd


class MouseControlledSynth:
    """マウス位置で制御されるオシレータシンク・シンセサイザー"""

    def __init__(self, samplerate=48000, time_constant_ms=100, polling_interval_ms=8):
        """
        Args:
            samplerate: サンプリングレート (Hz)
            time_constant_ms: 時定数 (ms)。この時間で目標値の約63%に到達
                - 50ms:  素早い応答
                - 100ms: 標準的な応答 (デフォルト)
                - 200ms: ゆったりした応答
            polling_interval_ms: マウス位置のポーリング間隔 (ms)
                - 8ms: 標準 (デフォルト, 125Hz)
                - 4ms: 高速 (250Hz)
                - 16ms: 低速 (62.5Hz)
        """
        self.fs = samplerate
        self.time_constant_ms = time_constant_ms
        self.polling_interval_ms = polling_interval_ms

        # 時定数から滑らかさ係数を計算
        n = time_constant_ms * samplerate / 1000
        self.smoothness_coeff = 1.0 / n

        self.blocksize = int(samplerate * polling_interval_ms / 1000)

        print("設定:")
        print(f"  時定数: {self.time_constant_ms}ms (約63%到達時間)")
        print(f"  滑らかさ係数: {self.smoothness_coeff:.6f}")
        print(f"  ポーリング間隔: {self.polling_interval_ms}ms ({1000 / self.polling_interval_ms:.1f}Hz)")
        print(f"  ブロックサイズ: {self.blocksize}サンプル ({self.blocksize / self.fs * 1000:.1f}ms)")

        # 位相管理
        self.phase_master = 0.0
        self.phase_slave = 0.0

        # 周波数管理
        self.current_freq_master = 100.0
        self.current_freq_slave = 100.0
        self.target_freq_master = 100.0
        self.target_freq_slave = 100.0

        # 画面サイズ取得
        self.screen_width, self.screen_height = pyautogui.size()

    def _callback(self, outdata, frames, time_info, status):
        """オーディオコールバック関数 : blocksize間隔で呼ばれる"""
        # 各サンプルの周波数を格納する配列
        freq_master_per_sample = np.zeros(frames, dtype=np.float32)
        freq_slave_per_sample = np.zeros(frames, dtype=np.float32)

        # 1サンプルずつ周波数を計算（指数平滑化）
        temp_freq_master = self.current_freq_master
        temp_freq_slave = self.current_freq_slave
        for i in range(frames):
            temp_freq_master += (self.target_freq_master - temp_freq_master) * self.smoothness_coeff
            temp_freq_slave += (self.target_freq_slave - temp_freq_slave) * self.smoothness_coeff
            freq_master_per_sample[i] = temp_freq_master
            freq_slave_per_sample[i] = temp_freq_slave

        # このブロックの最終的な周波数を次のブロックの開始値として保存
        self.current_freq_master = temp_freq_master
        self.current_freq_slave = temp_freq_slave

        # 位相増分を計算
        phase_inc_master = freq_master_per_sample / self.fs
        phase_inc_slave = freq_slave_per_sample / self.fs

        # 累積位相を計算
        master_phase = (self.phase_master + np.cumsum(phase_inc_master)) % 1.0
        slave_phase = (self.phase_slave + np.cumsum(phase_inc_slave)) % 1.0

        # マスター位相リセット検出 (ハードシンク)
        reset_points = np.where(np.diff(master_phase) < 0)[0] + 1

        # 各リセットポイントで、slaveの位相を0から再計算する
        for rp in reset_points:
            slave_phase[rp:] = np.cumsum(phase_inc_slave[rp:]) % 1.0

        # ノコギリ波生成 (-1.0 to 1.0)
        out = (2.0 * slave_phase - 1.0).astype(np.float32)

        # 次のブロックのために位相を更新
        self.phase_master = master_phase[-1]
        self.phase_slave = slave_phase[-1]

        outdata[:] = out.reshape(-1, 1)

    def update_target(self, x, y):
        """マウス位置から目標周波数を更新"""
        self.target_freq_master = np.interp(x, [0, self.screen_width], [40, 600])
        self.target_freq_slave = np.interp(y, [0, self.screen_height], [2000, 100])

    def run(self):
        """メインループ実行"""
        with sd.OutputStream(
            channels=1, callback=self._callback, samplerate=self.fs, blocksize=self.blocksize
        ) as stream:
            print("\nマウスを動かして音を制御してください (Ctrl+C で終了)")
            print(f"オーディオデバイスのレイテンシ: {stream.latency * 1000:.2f} ms")
            try:
                while True:
                    x, y = pyautogui.position()
                    self.update_target(x, y)
                    time.sleep(self.polling_interval_ms / 1000)
            except KeyboardInterrupt:
                print("\n終了しました。")


def main():
    synth = MouseControlledSynth(
        samplerate=48000,
        time_constant_ms=16,  # 時定数 (ms)。この時間で目標値の約63%に到達
        polling_interval_ms=8,  # マウス位置のポーリング間隔 (ms)
    )
    synth.run()


if __name__ == "__main__":
    main()
