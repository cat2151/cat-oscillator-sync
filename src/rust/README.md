# Rust版 cat-oscillator-sync

🎵 Rustで実装したマウス制御型ハードシンク・オシレータ・シンセサイザー

[English](#english-version) | [日本語](#日本語版)

---

## English Version

### Overview

This directory contains the Rust implementation of cat-oscillator-sync.
It provides the same functionality as the Python version with better performance and lower latency.

### What's Included

This Rust implementation includes three programs:

1. **minimal** - Minimal example: plays a 440Hz saw wave
2. **sync_simple** - Simple version: hard-sync oscillator with mouse control
3. **sync_smooth** - Smooth version: hard-sync oscillator with exponential smoothing

### Quick Start for Windows

#### Prerequisites

Check if Rust is installed:

```bash
rustc --version
cargo --version
```

If not installed, download from https://rustup.rs/ and run the installer.

#### Build and Run

```bash
# Navigate to the Rust directory
cd src/rust

# Build (first time takes 2-5 minutes)
cargo build --release

# Run minimal example (440Hz single tone)
cargo run --release --bin minimal

# Run simple version (mouse control)
cargo run --release --bin sync_simple

# Run smooth version (mouse control with exponential smoothing)
cargo run --release --bin sync_smooth
```

### How to Use

#### Minimal Example
- Plays a 440Hz (A4 note) saw wave
- Press Ctrl+C to exit

#### Simple Version
- Move your mouse to control the sound:
  - **X-axis (horizontal)**: Master frequency (40Hz - 600Hz)
  - **Y-axis (vertical)**: Slave frequency (100Hz - 2000Hz)
- Current frequencies are displayed at the bottom
- Press Ctrl+C to exit

#### Smooth Version
- Similar to Simple Version, but with exponential smoothing for smoother frequency transitions
- Time constant: 16ms (about 63% arrival time)
- Provides more musical and natural sound changes
- Press Ctrl+C to exit

### Documentation

- [Quick Start Guide (Japanese)](QUICKSTART.md) - Detailed setup instructions for Windows users
- [Implementation Plan (Japanese)](IMPLEMENTATION_PLAN.md) - Technical details

### Comparison with Python Version

| Feature | Python | Rust |
|---------|--------|------|
| Installation | Python + pip + 3 packages | Rust + cargo build |
| Startup Speed | Moderate | Fast |
| Execution Speed | Standard | High |
| CPU Usage | Moderate | Low |
| Memory Usage | Moderate | Low |
| Latency | Low | Lower |

### License

This project is licensed under the [MIT License](../../LICENSE).

---

## 日本語版

### 概要

このディレクトリには、cat-oscillator-syncのRust実装が含まれています。
Python版と同等の機能を持ち、より高速で低レイテンシな動作を実現します。

## 実装内容

このRust実装には3つのプログラムがあります：

1. **minimal** - 最小限の例：440Hzのノコギリ波を再生
2. **sync_simple** - シンプル版：マウス制御によるハードシンク・オシレータ
3. **sync_smooth** - スムーズ版：指数平滑化によるマウス制御ハードシンク・オシレータ

## Windows環境でのビルド・実行手順

### 前提条件

Rustがインストールされていること（久々に触る方も以下で確認できます）

#### Rustのバージョン確認

```bash
rustc --version
cargo --version
```

上記コマンドでバージョンが表示されればOKです。
表示されない場合は、次のステップでRustをインストールしてください。

#### Rustのインストール（必要な場合）

1. https://rustup.rs/ にアクセス
2. 「rustup-init.exe」をダウンロードして実行
3. デフォルト設定のままインストール（Enterキーを押すだけ）
4. インストール後、コマンドプロンプトまたはPowerShellを再起動
5. `rustc --version` で確認

### ビルド手順

#### 1. プロジェクトディレクトリに移動

```bash
cd src/rust
```

リポジトリのルートから実行する場合：
```bash
cd path/to/cat-oscillator-sync/src/rust
```

#### 2. 依存関係の取得とビルド

初回は依存関係のダウンロードとコンパイルが行われます（数分かかります）：

```bash
cargo build --release
```

**注意**: 初回ビルドには2〜5分程度かかる場合があります。
依存クレート（cpal、rdevなど）が自動的にダウンロード・コンパイルされます。

#### 3. ビルド成功の確認

ビルドが成功すると、以下のメッセージが表示されます：
```
   Compiling cat-oscillator-sync v0.1.0 (...)
    Finished release [optimized] target(s) in XX.XXs
```

### 実行手順

#### 最小限の例（440Hz単音）

```bash
cargo run --release --bin minimal
```

実行すると：
- 440Hz（A4音）のノコギリ波が再生されます
- Ctrl+C で終了します

#### シンプル版（マウス制御）

```bash
cargo run --release --bin sync_simple
```

実行すると：
- マウスを動かすことで音が変化します
- X軸（横方向）: マスター周波数 (40Hz - 600Hz)
- Y軸（縦方向）: スレーブ周波数 (100Hz - 2000Hz)
- Ctrl+C で終了します

#### スムーズ版（指数平滑化）

```bash
cargo run --release --bin sync_smooth
```

実行すると：
- シンプル版と同様にマウスで音を制御しますが、指数平滑化により滑らかな周波数変化を実現
- 時定数: 16ms（約63%到達時間）
- より音楽的で自然な音の変化が得られます
- Ctrl+C で終了します

### トラブルシューティング

#### ビルドエラーが発生する場合

1. Rustのバージョンが古い可能性があります。更新してください：
   ```bash
   rustup update
   ```

2. Visual Studio Build Toolsが必要な場合があります：
   - https://visualstudio.microsoft.com/downloads/
   - 「Build Tools for Visual Studio」をダウンロード
   - 「C++ によるデスクトップ開発」をインストール

#### オーディオデバイスが見つからない

エラーメッセージ：「デフォルトの出力デバイスが見つかりません」

対策：
- Windowsのサウンド設定で既定のデバイスが設定されているか確認
- オーディオドライバーを再インストール

#### マウスが動作しない

- 管理者権限で実行してみてください
- セキュリティソフトがマウス監視をブロックしている可能性があります

### 開発環境の詳細

#### 使用ライブラリ

- **cpal** - クロスプラットフォームオーディオライブラリ
  - WindowsではWASAPI（Windows Audio Session API）を使用
  - 低レイテンシなオーディオ出力を実現
  
- **rdev** - マウス/キーボードイベント監視
  - クロスプラットフォーム対応
  - バックグラウンドでマウス位置を取得

- **anyhow** - エラーハンドリング

#### ディレクトリ構成

```
src/rust/
├── Cargo.toml              # プロジェクト設定・依存関係
├── README.md              # このファイル
├── IMPLEMENTATION_PLAN.md # 実装計画書
└── src/
    ├── minimal.rs         # 最小限の例
    ├── sync_simple.rs     # シンプル版実装
    └── sync_smooth.rs     # スムーズ版実装
```

### Python版との比較

| 項目 | Python版 | Rust版 |
|------|----------|--------|
| インストール | Python + pip + 3パッケージ | Rust + cargo build |
| 起動速度 | やや遅い | 速い |
| 実行速度 | 標準 | 高速 |
| CPU使用率 | やや高い | 低い |
| メモリ使用量 | やや多い | 少ない |
| レイテンシ | 低い | より低い |

### 次のステップ

- ~~スムーズ版（指数平滑化）の実装~~ ✅ 完了
- パラメータのコマンドライン指定
- 設定ファイルのサポート

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。

## 参考資料

- [Rust公式サイト](https://www.rust-lang.org/)
- [cpalドキュメント](https://docs.rs/cpal/)
- [rdevドキュメント](https://docs.rs/rdev/)
- [実装計画書](IMPLEMENTATION_PLAN.md)
