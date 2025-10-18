// ハードシンク・オシレータ シンプル版
// マウスの位置でマスター周波数とスレーブ周波数を制御します
// X軸: マスター周波数 (40Hz - 600Hz)
// Y軸: スレーブ周波数 (100Hz - 2000Hz)
// Ctrl+C で終了してください

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use rdev::{display_size, listen, EventType};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

// グローバル状態
struct SynthState {
    freq_master: f32,
    freq_slave: f32,
    phase_master: f32,
    phase_slave: f32,
}

impl SynthState {
    fn new() -> Self {
        SynthState {
            freq_master: 440.0,
            freq_slave: 880.0,
            phase_master: 0.0,
            phase_slave: 0.0,
        }
    }
}

fn main() -> Result<(), anyhow::Error> {
    println!("🎵 Cat Oscillator Sync - Simple Version (Rust)");
    println!("マウスを動かして音を制御してください");
    println!("X軸: マスター周波数 (40Hz - 600Hz)");
    println!("Y軸: スレーブ周波数 (100Hz - 2000Hz)");
    println!("Press Ctrl+C to exit");
    println!();

    // 画面サイズの取得
    let (screen_width, screen_height) =
        display_size().map_err(|e| anyhow::anyhow!("画面サイズの取得に失敗: {:?}", e))?;
    println!("Screen size: {}x{}", screen_width, screen_height);

    // オーディオホストとデバイスの取得
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .ok_or_else(|| anyhow::anyhow!("デフォルトの出力デバイスが見つかりません"))?;

    println!("Output device: {}", device.name()?);

    // デバイス設定の取得
    let default_config = device.default_output_config()?;
    println!("Default output config: {:?}", default_config);

    // モノラル（1チャンネル）で設定を構築
    let config = cpal::StreamConfig {
        channels: 1,
        sample_rate: default_config.sample_rate(),
        buffer_size: cpal::BufferSize::Default,
    };
    let sample_rate = config.sample_rate.0 as f32;
    println!(
        "Configured for: {} Hz, {} channel (mono)",
        sample_rate, config.channels
    );

    // 状態の共有
    let state = Arc::new(Mutex::new(SynthState::new()));
    let mouse_pos = Arc::new(Mutex::new((
        screen_width as f64 / 2.0,
        screen_height as f64 / 2.0,
    )));

    // マウスイベントリスナー用の位置共有
    let mouse_pos_listener = Arc::clone(&mouse_pos);
    thread::spawn(move || {
        if let Err(error) = listen(move |event| {
            if let EventType::MouseMove { x, y } = event.event_type {
                let mut pos = mouse_pos_listener.lock().unwrap();
                *pos = (x, y);
            }
        }) {
            eprintln!("マウスリスナーエラー: {:?}", error);
        }
    });

    // マウス位置から周波数を計算する定期処理
    let state_updater = Arc::clone(&state);
    let mouse_pos_updater = Arc::clone(&mouse_pos);
    thread::spawn(move || {
        loop {
            let (x, y) = {
                let pos = mouse_pos_updater.lock().unwrap();
                *pos
            };

            // 周波数のマッピング
            let freq_master = 40.0 + (x / screen_width as f64) * (600.0 - 40.0);
            let freq_slave =
                100.0 + ((screen_height as f64 - y) / screen_height as f64) * (2000.0 - 100.0);

            {
                let mut s = state_updater.lock().unwrap();
                s.freq_master = freq_master as f32;
                s.freq_slave = freq_slave as f32;
            }

            thread::sleep(Duration::from_millis(8)); // 8ms ポーリング
        }
    });

    // オーディオストリーム構築
    let state_audio = Arc::clone(&state);
    let stream = device.build_output_stream(
        &config,
        move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
            let mut s = state_audio.lock().unwrap();

            let inc_master = s.freq_master / sample_rate;
            let inc_slave = s.freq_slave / sample_rate;

            for sample in data.iter_mut() {
                // マスターオシレータの位相を進める
                s.phase_master += inc_master;

                // マスター位相のラップアラウンドを検出
                if s.phase_master >= 1.0 {
                    s.phase_master -= 1.0;
                    // マスターがリセットされたら、スレーブもリセット
                    // Python版と同じく、リセット時点で位相を0にする
                    s.phase_slave = 0.0;
                } else {
                    // マスターがリセットされていない場合のみ、スレーブ位相を進める
                    s.phase_slave += inc_slave;
                    if s.phase_slave >= 1.0 {
                        s.phase_slave -= 1.0;
                    }
                }

                // ノコギリ波: 位相を -1.0 から 1.0 の範囲に変換
                *sample = 2.0 * s.phase_slave - 1.0;
            }
        },
        |err| eprintln!("Stream error: {}", err),
        None,
    )?;

    // ストリーム開始
    stream.play()?;

    // 周波数表示スレッド
    let state_display = Arc::clone(&state);
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(500));
        let s = state_display.lock().unwrap();
        print!(
            "\rMaster: {:6.1} Hz | Slave: {:6.1} Hz",
            s.freq_master, s.freq_slave
        );
        std::io::Write::flush(&mut std::io::stdout()).ok();
    });

    println!("\nPress Ctrl+C to stop...");
    std::thread::park();

    Ok(())
}
