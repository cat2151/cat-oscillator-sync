# Rust版 クイックスタートガイド

このガイドは、Windows環境でRust版を初めて実行する方向けの手順です。

## 📋 前提条件チェック

まず、以下のコマンドでRustがインストールされているか確認します：

```bash
rustc --version
cargo --version
```

バージョンが表示されればOKです。次のステップに進んでください。

表示されない場合は、「Rustのインストール」に進んでください。

## 🔧 Rustのインストール（必要な場合のみ）

### Windows環境でのインストール手順

1. **Rustupのダウンロード**
   - https://rustup.rs/ にアクセス
   - 「DOWNLOAD RUSTUP-INIT.EXE (64-BIT)」をクリック

2. **インストーラーの実行**
   - ダウンロードした `rustup-init.exe` を実行
   - 「Proceed with standard installation? (default - just press enter)」と表示されたら、Enterキーを押す
   - インストールが完了するまで待つ（数分かかります）

3. **環境変数の反映**
   - コマンドプロンプトまたはPowerShellを**再起動**
   - 再起動しないと、`rustc` や `cargo` コマンドが認識されません

4. **インストールの確認**
   ```bash
   rustc --version
   cargo --version
   ```
   バージョンが表示されればインストール成功です！

### Visual Studio Build Toolsについて

Windowsでは、C/C++コンパイラが必要になる場合があります。
rustup-init.exeの実行時に自動的にインストール方法が案内されます。

もし手動でインストールする必要がある場合：
1. https://visualstudio.microsoft.com/downloads/ にアクセス
2. 「Build Tools for Visual Studio」をダウンロード
3. インストーラーで「C++ によるデスクトップ開発」を選択してインストール

## 🚀 ビルドと実行

### 1. プロジェクトディレクトリに移動

```bash
cd src/rust
```

リポジトリをクローンした場所から実行する場合：
```bash
cd path\to\cat-oscillator-sync\src\rust
```

### 2. ビルド

初回は依存関係のダウンロードとコンパイルが行われます：

```bash
cargo build --release
```

**初回ビルドについて：**
- 2〜5分程度かかります
- インターネット接続が必要です（依存クレートをダウンロード）
- 進捗状況が表示されます
- "Finished release" と表示されれば成功です

### 3. 実行

#### 最小限の例（440Hz単音）を実行

```bash
cargo run --release --bin minimal
```

実行すると：
- 「🎵 Minimal Saw Oscillator Example」と表示されます
- 440Hz（A4音）のノコギリ波が鳴ります
- **Ctrl+C** で終了します

#### シンプル版（マウス制御）を実行

```bash
cargo run --release --bin sync_simple
```

実行すると：
- 「🎵 Cat Oscillator Sync - Simple Version (Rust)」と表示されます
- **マウスを動かす**と音が変化します：
  - **X軸（横方向）**: マスター周波数 (40Hz - 600Hz)
  - **Y軸（縦方向）**: スレーブ周波数 (100Hz - 2000Hz)
- 画面下部に現在の周波数が表示されます
- **Ctrl+C** で終了します

## 🎯 動作確認のポイント

### 正常に動作している場合：
- ✅ 音が鳴っている
- ✅ マウスを動かすと音の高さが変わる（sync_simple の場合）
- ✅ エラーメッセージが表示されない

### トラブルシューティング

#### 「デフォルトの出力デバイスが見つかりません」エラー

**原因：** Windowsのサウンド設定で出力デバイスが設定されていない

**対策：**
1. Windowsの設定を開く
2. 「システム」→「サウンド」を選択
3. 「出力デバイスを選択してください」で適切なデバイスを選択

#### ビルドエラーが発生する場合

**対策1：Rustを最新に更新**
```bash
rustup update
```

**対策2：Visual Studio Build Toolsのインストール**
- 上記「Visual Studio Build Toolsについて」を参照

#### マウスが動作しない場合

**対策1：管理者権限で実行**
- コマンドプロンプトを「管理者として実行」で起動
- 再度 `cargo run` を実行

**対策2：セキュリティソフトの確認**
- セキュリティソフトがマウス監視をブロックしている可能性
- 一時的に無効化して試す

## 📝 次のステップ

正常に動作したら：
- マウスをいろいろ動かして音の変化を楽しんでください
- Python版と比較してみてください
- コードを読んで実装を理解してみてください

## 💡 ヒント

### ビルド時間の短縮

2回目以降のビルドは、変更したファイルのみがコンパイルされるため、
初回より大幅に速くなります（通常数秒）。

### デバッグビルド vs リリースビルド

- `cargo build` - デバッグビルド（速いが最適化なし）
- `cargo build --release` - リリースビルド（遅いが高速実行）
- このアプリではリアルタイム性が重要なため、`--release` を推奨

### コードの変更

`src/minimal.rs` や `src/sync_simple.rs` を編集した場合：
1. ファイルを保存
2. `cargo build --release` でビルド
3. `cargo run --release --bin <プログラム名>` で実行

## 🔗 関連リンク

- [Rust公式サイト](https://www.rust-lang.org/)
- [Cargo Book（日本語）](https://doc.rust-jp.rs/book-ja/ch01-00-getting-started.html)
- [実装計画書](IMPLEMENTATION_PLAN.md)
- [詳細README](README.md)
