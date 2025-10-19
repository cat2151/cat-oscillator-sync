// ハードシンク・オシレータ スムーズ版
// マウスの位置でマスター周波数とスレーブ周波数を制御します
// X軸: マスター周波数 (40Hz - 600Hz)
// Y軸: スレーブ周波数 (100Hz - 2000Hz)
// 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
// Ctrl+C で終了してください

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use rdev::{display_size, listen, EventType};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;

// グローバル状態
struct SynthState {
    // 目標周波数（マウス位置から計算）
    target_freq_master: f32,
    target_freq_slave: f32,
    // 現在の周波数（指数平滑化された値）
    current_freq_master: f32,
    current_freq_slave: f32,
    // 位相管理
    phase_master: f32,
    phase_slave: f32,
    // 滑らかさ係数
    smoothness_coeff: f32,
}

impl SynthState {
    fn new(time_constant_ms: f32, sample_rate: f32) -> Self {
        // 時定数から滑らかさ係数を計算
        // n = time_constant_ms * sample_rate / 1000
        // smoothness_coeff = 1.0 / n
        let n = time_constant_ms * sample_rate / 1000.0;
        let smoothness_coeff = 1.0 / n;

        println!("設定:");
        println!("  時定数: {}ms (約63%到達時間)", time_constant_ms);
        println!("  滑らかさ係数: {:.6}", smoothness_coeff);

        SynthState {
            target_freq_master: 100.0,
            target_freq_slave: 100.0,
            current_freq_master: 100.0,
            current_freq_slave: 100.0,
            phase_master: 0.0,
            phase_slave: 0.0,
            smoothness_coeff,
        }
    }
}

fn main() -> Result<(), anyhow::Error> {
    println!("🎵 Cat Oscillator Sync - Smooth Version (Rust)");
    println!("マウスを動かして音を制御してください");
    println!("X軸: マスター周波数 (40Hz - 600Hz)");
    println!("Y軸: スレーブ周波数 (100Hz - 2000Hz)");
    println!("指数平滑化により滑らかな周波数変化を実現");
    println!("Press Ctrl+C to exit");
    println!();

    // パラメータ設定
    let time_constant_ms = 16.0; // 時定数 (ms)
    let polling_interval_ms = 8; // マウス位置のポーリング間隔 (ms)

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

    // blocksize の計算（ポーリング間隔に対応）
    let blocksize = (sample_rate * polling_interval_ms as f32 / 1000.0) as usize;
    println!(
        "  ポーリング間隔: {}ms ({:.1}Hz)",
        polling_interval_ms,
        1000.0 / polling_interval_ms as f32
    );
    println!(
        "  ブロックサイズ: {}サンプル ({:.1}ms)",
        blocksize,
        blocksize as f32 / sample_rate * 1000.0
    );

    // 状態の共有
    let state = Arc::new(Mutex::new(SynthState::new(time_constant_ms, sample_rate)));
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

    // マウス位置から目標周波数を計算する定期処理
    let state_updater = Arc::clone(&state);
    let mouse_pos_updater = Arc::clone(&mouse_pos);
    thread::spawn(move || {
        loop {
            let (x, y) = {
                let pos = mouse_pos_updater.lock().unwrap();
                *pos
            };

            // 周波数のマッピング
            let target_freq_master = 40.0 + (x / screen_width as f64) * (600.0 - 40.0);
            let target_freq_slave =
                100.0 + ((screen_height as f64 - y) / screen_height as f64) * (2000.0 - 100.0);

            {
                let mut s = state_updater.lock().unwrap();
                s.target_freq_master = target_freq_master as f32;
                s.target_freq_slave = target_freq_slave as f32;
            }

            thread::sleep(Duration::from_millis(polling_interval_ms));
        }
    });

    // オーディオストリーム構築
    let state_audio = Arc::clone(&state);
    let stream = device.build_output_stream(
        &config,
        move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
            let mut s = state_audio.lock().unwrap();

            // 1サンプルずつ周波数を計算（指数平滑化）
            for sample in data.iter_mut() {
                // 指数平滑化：current += (target - current) * smoothness_coeff
                s.current_freq_master +=
                    (s.target_freq_master - s.current_freq_master) * s.smoothness_coeff;
                s.current_freq_slave +=
                    (s.target_freq_slave - s.current_freq_slave) * s.smoothness_coeff;

                // 位相増分を計算
                let inc_master = s.current_freq_master / sample_rate;
                let inc_slave = s.current_freq_slave / sample_rate;

                // マスターオシレータの位相を進める
                s.phase_master += inc_master;

                // マスター位相のラップアラウンドを検出
                if s.phase_master >= 1.0 {
                    s.phase_master -= 1.0;
                    // マスターがリセットされたら、スレーブもリセット
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
            s.current_freq_master, s.current_freq_slave
        );
        std::io::Write::flush(&mut std::io::stdout()).ok();
    });

    println!("\nPress Ctrl+C to stop...");
    std::thread::park();

    Ok(())
}
