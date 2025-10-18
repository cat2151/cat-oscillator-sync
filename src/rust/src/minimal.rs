// Minimal example: 単音のノコギリ波オシレータ
// 440Hzのノコギリ波を再生します
// Ctrl+C で終了してください

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use std::sync::{Arc, Mutex};

fn main() -> Result<(), anyhow::Error> {
    println!("🎵 Minimal Saw Oscillator Example");
    println!("Playing 440Hz saw wave...");
    println!("Press Ctrl+C to exit");

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

    // オシレータの状態
    let phase = Arc::new(Mutex::new(0.0f32));
    let frequency = 440.0f32; // A4音

    // ストリーム構築
    let phase_clone = Arc::clone(&phase);
    let stream = device.build_output_stream(
        &config,
        move |data: &mut [f32], _: &cpal::OutputCallbackInfo| {
            let mut phase_lock = phase_clone.lock().unwrap();
            let phase_increment = frequency / sample_rate;

            for sample in data.iter_mut() {
                // ノコギリ波: 位相を -1.0 から 1.0 の範囲に変換
                *sample = 2.0 * *phase_lock - 1.0;

                // 位相を進める
                *phase_lock += phase_increment;
                if *phase_lock >= 1.0 {
                    *phase_lock -= 1.0;
                }
            }
        },
        |err| eprintln!("Stream error: {}", err),
        None,
    )?;

    // ストリーム開始
    stream.play()?;

    // Ctrl+C を待つ
    println!("\nPress Ctrl+C to stop...");
    std::thread::park();

    Ok(())
}
