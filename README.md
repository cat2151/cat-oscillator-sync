# cat-oscillator-sync

🎵 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## 🌐 ブラウザで試す

**[→ GitHub Pages でデモを開く](https://cat2151.github.io/cat-oscillator-sync/)**

ブラウザですぐに試せます。インストール不要！

---

## 状況

- LLMにこのドキュメントとcodeを生成させた状態です。いくつかは作業中です
- 課題、以下のドキュメントが読みづらい
  - 対策、まずPython版のZenn scraps 記事 を読んだほうがわかりやすいかもしれません : [Pythonでシンセサイザーのオシレータシンクのサウンドを50行で鳴らして楽しむ](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)

- Python : 音が鳴ります。

- Rust : 音が鳴ります。

- Go : Pure Go版（Oto）が利用可能です。C言語コンパイラ不要で簡単にビルドできます。詳細は [src/go/README.md](src/go/README.md) を参照してください。
  - PortAudio版も利用可能ですが、Zig ccが必要です。詳細は [src/go-portaudio/README.md](src/go-portaudio/README.md) を参照してください。

- Go : test_windows_mouse_speed.go は正常動作しています。
  - ですが演奏中は0.8秒間隔でしか周波数変化しません。
  - 作業中です。

- TypeScript(Browser) : GitHub Pages で公開中！ [デモを開く](https://cat2151.github.io/cat-oscillator-sync/)
  - ブラウザで動作するWeb Audio API実装
  - Simple版とSmooth版の両方を実装

- TypeScript(Node.js) : 音は鳴ります。
  - ですが演奏中は8秒？間隔でしか周波数変化しません。
  - 作業中です。

## 概要

`cat-oscillator-sync` は、マウスの位置によってリアルタイムに音響合成パラメータを制御できるインタラクティブなシンセサイザーです。ハードシンク（オシレータ同期）技術を使用して、豊かで表現力のある音色を生成します。

### 主な特徴

- **リアルタイムマウス制御**: X軸でマスター周波数、Y軸でスレーブ周波数を制御
- **ハードシンク**: マスターオシレータがスレーブオシレータの位相をリセットし、独特の音色を生成
- **スムーズな遷移**: 指数平滑化による滑らかな周波数変化
- **低レイテンシ**: 8msのポーリング間隔で高い応答性を実現
- **マルチ言語対応**: Python、Rust、Go、TypeScriptでの実装を計画
  - 現在Pythonが実装済み

## デモ

マウスを動かすことで以下のように音響パラメータが変化します：

- **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
- **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)

## インストール

**[日本語版 README はこちら](README.ja.md)** - 各言語版の詳細なインストール方法と比較表

### Python版（推奨）

#### ワンライナーインストール（pipx推奨）

```bash
pipx install git+https://github.com/cat2151/cat-oscillator-sync
```

実行:
```bash
cat-oscillator-sync-simple  # シンプル版
cat-oscillator-sync-smooth  # スムーズ版
```

#### 従来の方法

```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync
pip install -r requirements.txt
python src/python/sync_simple.py
```

### Rust版

**ワンライナーインストール**:
```bash
cargo install --git https://github.com/cat2151/cat-oscillator-sync --root . cat-oscillator-sync
```

**実行**:
```bash
./bin/sync_simple
./bin/sync_smooth
```

### Go版（Pure Go - Oto）⭐推奨

```bash
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple_oto@latest
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_smooth_oto@latest
sync_simple_oto
sync_smooth_oto
```

### TypeScript版（Browser）

最も簡単！ **[GitHub Pages デモ](https://cat2151.github.io/cat-oscillator-sync/)** にアクセス - インストール不要

### その他の実装

Go PortAudio版、TypeScript CLI版の詳細は [README.ja.md](README.ja.md) を参照してください。

## 使用方法

すべての実装で共通の操作方法：

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl + C` で終了

各言語版の詳細な実行方法は [README.ja.md](README.ja.md) を参照してください。

## 全アプリケーションの一括ビルド＆実行（Windows専用）

すべての言語版（Python、Rust、Go、TypeScript）を一度にビルドし、メニューから選んで実行できるスクリプトを用意しています。物理スピーカーでの人力テストに便利です。

```bash
python build_and_run.py
```

メニューから「99」を選択すると、全言語版のクリーンビルドを実行できます。

詳細は [BUILD_SCRIPTS.md](BUILD_SCRIPTS.md) を参照してください。

## 各言語版の個別ビルド＆実行

各言語版には専用のビルドスクリプトがあり、環境構築・ビルド・実行を1つのコマンドで行えます：

```bash
# Python版
cd src/python
python build_and_run.py [--clean] [--simple|--smooth]

# Rust版
cd src/rust
python build_and_run.py [--clean] [--simple|--smooth]

# Go版（Pure Go - Oto）⭐推奨
cd src/go
python build_and_run.py [--clean] [--simple|--smooth]

# Go版（PortAudio + Zig cc）
cd src/go-portaudio
python build_and_run.py [--clean] [--simple|--smooth]

# TypeScript CLI版
cd src/typescript/cli
python build_and_run.py [--clean] [--simple|--smooth]

# TypeScript Browser版
cd src/typescript/browser
python build_and_run.py [--clean] [--build|--dev]
```

詳細は [BUILD_SCRIPTS.md](BUILD_SCRIPTS.md) を参照してください。


## 技術詳細

### ハードシンク（オシレータ同期）とは

ハードシンクは、一つのオシレータ（マスター）が別のオシレータ（スレーブ）の位相を強制的にリセットする音響合成技術です。これにより：

- 豊かな倍音を持つ音色が生成される
- マスター周波数とスレーブ周波数の比率によって音色が変化
- 古典的なアナログシンセサイザーで使われていた技法

### 実装の違い

#### sync_simple.py
- マウス位置の変化が8msごとに音に反映される
- 急激にマウスを動かすと、階段状に周波数が変化し、アナログシンセ特有の滑らかな音が再現できないことがある
- シンプルな実装のため、仕組みを学びやすい

#### sync_smooth.py
- 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
- 時定数（デフォルト16ms）で滑らかさを調整可能
- より音楽的で実用的な動作

### パラメータ設定

```python
synth = MouseControlledSynth(
    samplerate=48000,        # サンプリングレート
    time_constant_ms=16,     # 時定数（応答速度）
    polling_interval_ms=8    # マウスポーリング間隔
)
```

## プロジェクト構造

```
cat-oscillator-sync/
├── LICENSE                 # MITライセンス
├── README.md              # このファイル
├── pytest.ini            # pytest設定
├── ruff.toml              # コード品質ツール設定
└── src/
    ├── python/
    │   ├── sync_simple.py  # シンプル版実装
    │   └── sync_smooth.py  # スムーズ版実装
    ├── go/                # Go実装（予定）
    ├── rust/              # Rust実装（完了）
    └── typescript/        # TypeScript実装
        ├── browser/       # ブラウザ版（完了）
        └── cli/           # CLI版（Node.js・Windows専用）
```

## 開発

### コード品質の維持

このプロジェクトでは [ruff](https://docs.astral.sh/ruff/) を使用してコード品質を維持しています。

```bash
# フォーマット
ruff format src/ tests/

# リントチェック
ruff check src/ tests/

# 自動修正可能な問題を修正
ruff check --fix src/ tests/
```

### 推奨VSCode拡張機能

- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Ruff (charliermarsh.ruff)
- EditorConfig for VS Code (editorconfig.editorconfig)

## 今後の予定

- [x] Rust実装 - [実装計画書](issue-notes/2_RUST_IMPLEMENTATION_PLAN.md) | [README](issue-notes/4_RUST_README.md) | [クイックスタート](issue-notes/4_RUST_QUICKSTART.md)
- [x] Go実装 - [実装計画書](issue-notes/2_GO_IMPLEMENTATION_PLAN.md) | [README](issue-notes/22_GO_README.md) | [クイックスタート](issue-notes/22_GO_QUICKSTART.md)
- [x] TypeScript実装（ブラウザ版） - [実装計画書](issue-notes/2_TYPESCRIPT_IMPLEMENTATION_PLAN.md) | [README](issue-notes/6_TYPESCRIPT_BROWSER_README.md)
- [x] TypeScript実装（CLI版・Windows専用） - [実装計画書](issue-notes/2_TYPESCRIPT_IMPLEMENTATION_PLAN.md) | [README](issue-notes/32_TYPESCRIPT_CLI_README.md) | [クイックスタート](issue-notes/32_TYPESCRIPT_CLI_QUICKSTART.md)
- [ ] TypeScript実装（Obsidianプラグイン版） - [実装計画書](issue-notes/20_OBSIDIAN_IMPLEMENTATION_PLAN.md) | [README](issue-notes/24_OBSIDIAN_README.md)

**実装計画の詳細**: [実装計画書サマリー](issue-notes/2_IMPLEMENTATION_PLAN_SUMMARY.md)をご覧ください。

## projectのゴール
- [x] Python:
  - ローカルで起動1秒で音が鳴るシンプルなアプリを、
  - LLM chatbotでcode生成させ、手軽にinstallして、鳴らすこと
  - が実現できるか？を検証すること
  - 結果、実現できた
- [x] Rust:
  - pythonでLLM chatbotに実装させたこのシンプルなコードが、
  - Rustでもagentにより移植可能か？を検証すること
  - 結果、実現できた（minimal版とsimple版の両方を実装）
- [x] Go:
  - 同様にGoでもagentにより移植可能か？を検証すること
  - 結果、実現できた（simple版とsmooth版の両方を実装）
- [x] TypeScript:
  - 同様にTypeScriptでもagentにより移植可能か？を検証すること
  - 結果、実現できた（ブラウザ版として実装）

## スコープ外
- MIDI制御
- エフェクト追加
- オーディオプラグイン化

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
