Last updated: 2025-12-02


# プロジェクト概要生成プロンプト（来訪者向け）

## 生成するもの：
- projectを3行で要約する
- プロジェクトで使用されている技術スタックをカテゴリ別に整理して説明する
- プロジェクト全体のファイル階層ツリー（ディレクトリ構造を図解）
- プロジェクト全体のファイルそれぞれの説明
- プロジェクト全体の関数それぞれの説明
- プロジェクト全体の関数の呼び出し階層ツリー

## 生成しないもの：
- Issues情報（開発者向け情報のため）
- 次の一手候補（開発者向け情報のため）
- ハルシネーションしそうなもの（例、存在しない機能や計画を勝手に妄想する等）

## 出力フォーマット：
以下のMarkdown形式で出力してください：

```markdown
# Project Overview

## プロジェクト概要
[以下の形式で3行でプロジェクトを要約]
- [1行目の説明]
- [2行目の説明]
- [3行目の説明]

## 技術スタック
[使用している技術をカテゴリ別に整理して説明]
- フロントエンド: [フロントエンド技術とその説明]
- 音楽・オーディオ: [音楽・オーディオ関連技術とその説明]
- 開発ツール: [開発支援ツールとその説明]
- テスト: [テスト関連技術とその説明]
- ビルドツール: [ビルド・パース関連技術とその説明]
- 言語機能: [言語仕様・機能とその説明]
- 自動化・CI/CD: [自動化・継続的統合関連技術とその説明]
- 開発標準: [コード品質・統一ルール関連技術とその説明]

## ファイル階層ツリー
```
[プロジェクトのディレクトリ構造をツリー形式で表現]
```

## ファイル詳細説明
[各ファイルの役割と機能を詳細に説明]

## 関数詳細説明
[各関数の役割、引数、戻り値、機能を詳細に説明]

## 関数呼び出し階層ツリー
```
[関数間の呼び出し関係をツリー形式で表現]
```
```


以下のプロジェクト情報を参考にして要約を生成してください：

## プロジェクト情報
名前: 
説明: # cat-oscillator-sync

🎵 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## 状況

Python : 音が鳴ります。

Rust : 音が鳴ります。

Go : ✅ **Pure Go版（Oto）が利用可能です！** C言語コンパイラ不要で簡単にビルドできます。詳細は [src/go/README.md](src/go/README.md) を参照してください。
     ※PortAudio版も利用可能ですが、Zig ccが必要です。詳細は [src/go-portaudio/README.md](src/go-portaudio/README.md) を参照してください。

Go : test_windows_mouse_speed.go は正常動作しています。
  ですが演奏中は0.8秒間隔でしか周波数変化しません。
  作業中です。

TypeScript(Node.js) : 音は鳴ります。
  ですが演奏中は8秒？間隔でしか周波数変化しません。
  作業中です。

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

### クイックスタート（pipx推奨）

pipxを使用してGitリポジトリから直接インストールできます：

```bash
# pipxのインストール（まだインストールしていない場合）
pip install pipx

# cat-oscillator-syncのインストール
pipx install git+https://github.com/cat2151/cat-oscillator-sync

# インストール後、以下のコマンドで実行できます
cat-oscillator-sync-simple  # シンプル版
cat-oscillator-sync-smooth  # スムーズ版
```

### 従来の方法（リポジトリをクローン）

#### 必要な環境

- Python 3.8+
- pip

#### Pythonライブラリのインストール

```bash
pip install -r requirements.txt
```

## 使用方法

### pipxでインストールした場合

```bash
# シンプル版 (8msごとに階段状に周波数が変化)
cat-oscillator-sync-simple

# スムーズ版 (1サンプルごとに滑らかに周波数が変化)
cat-oscillator-sync-smooth
```

### リポジトリから直接実行する場合

#### シンプル版 (8msごとに階段状に周波数が変化)

```bash
python src/python/sync_simple.py
```

#### スムーズ版 (1サンプルごとに滑らかに周波数が変化)

```bash
python src/python/sync_smooth.py
```

### 操作方法

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
3. `Ctrl + C` で終了

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


依存関係:
{}

## ファイル階層ツリー
📄 .editorconfig
📄 .gitignore
📁 .vscode/
  📊 settings.json
📖 BUILD_SCRIPTS.md
📄 LICENSE
📖 README.md
📄 _config.yml
📄 build_and_run.py
📁 generated-docs/
🌐 googled947dc864c270e07.html
📁 issue-notes/
  📖 20_OBSIDIAN_IMPLEMENTATION_PLAN.md
  📖 22_GO_CGO_EXPLANATION.md
  📖 22_GO_COMPLETION_REPORT.md
  📖 22_GO_INVESTIGATION_CGO_ALTERNATIVES.md
  📖 22_GO_PRECOMPILED_BINARY_SETUP.md
  📖 22_GO_QUICKSTART.md
  📖 22_GO_README.md
  📖 24_OBSIDIAN_COMPARISON.md
  📖 24_OBSIDIAN_COMPLETION_REPORT.md
  📖 24_OBSIDIAN_MANUAL_TEST.md
  📖 24_OBSIDIAN_README.md
  📖 2_GO_IMPLEMENTATION_PLAN.md
  📖 2_IMPLEMENTATION_PLAN_SUMMARY.md
  📖 2_RUST_IMPLEMENTATION_PLAN.md
  📖 2_TYPESCRIPT_IMPLEMENTATION_PLAN.md
  📖 32_TYPESCRIPT_CLI_COMPLETION_REPORT.md
  📖 32_TYPESCRIPT_CLI_MIGRATION_NOTES.md
  📖 32_TYPESCRIPT_CLI_QUICKSTART.md
  📖 32_TYPESCRIPT_CLI_README.md
  📖 32_TYPESCRIPT_CLI_VERIFICATION.md
  📖 34_BUILD_AND_RUN.md
  📖 44_GO_IMPLEMENTATION_REPORT_OTO.md
  📖 44_GO_QUICKSTART_OTO.md
  📖 44_GO_README_OTO.md
  📖 4_RUST_COMPLETION_REPORT.md
  📖 4_RUST_QUICKSTART.md
  📖 4_RUST_README.md
  📖 56_TYPESCRIPT_CLI_AUDIO_FIX_EXPLANATION.md
  📖 56_TYPESCRIPT_CLI_AUDIO_FIX_EXPLANATION_ja.md
  📖 56_TYPESCRIPT_CLI_AUDIO_FIX_SUMMARY.md
  📖 6_TYPESCRIPT_BROWSER_COMPLETION_REPORT.md
  📖 6_TYPESCRIPT_BROWSER_MANUAL_TEST.md
  📖 6_TYPESCRIPT_BROWSER_README.md
  📖 GO_MIGRATION_ZIG_CC.md
  📖 README.md
📄 pyproject.toml
📄 pytest.ini
📄 requirements.txt
📄 ruff.toml
📁 src/
  📄 build_utils.py
  📁 go/
    📄 .gitignore
    📖 README.md
    📄 build_and_run.py
    📁 cmd/
      📁 sync_simple_oto/
        📄 main.go
      📁 sync_smooth_oto/
        📄 main.go
    📄 go.mod
    📄 go.sum
    📁 internal/
      📁 mouse/
        📄 mouse_test.go
        📄 position.go
        📄 position_stub.go
        📄 position_windows.go
      📁 synth/
        📄 simple.go
        📄 smooth.go
        📄 synth_test.go
    📄 test_windows_mouse_speed.go
  📁 go-portaudio/
    📄 .gitignore
    📖 QUICKSTART.md
    📖 README.md
    📄 build_and_run.py
    📁 cmd/
      📁 sync_simple/
        📄 main.go
      📁 sync_smooth/
        📄 main.go
    📄 download_portaudio.py
    📄 go.mod
    📁 internal/
      📁 mouse/
        📄 mouse_test.go
        📄 position.go
        📄 position_stub.go
        📄 position_windows.go
      📁 synth/
        📄 simple.go
        📄 smooth.go
        📄 synth_test.go
  📁 obsidian/
    📄 .gitignore
    📄 esbuild.config.mjs
    📊 manifest.json
    📊 package.json
    📁 src/
      📁 audio/
        📘 simple-worklet.ts
        📘 smooth-worklet.ts
      📘 main.ts
      📘 mouse-handler.ts
      📁 synth/
        📘 simple.ts
        📘 smooth.ts
    📊 tsconfig.json
  📁 python/
    📄 __init__.py
    📄 build_and_run.py
    📄 sync_simple.py
    📄 sync_smooth.py
  📁 rust/
    📄 .gitignore
    📄 Cargo.toml
    📄 build_and_run.py
    📁 src/
      📄 sync_simple.rs
      📄 sync_smooth.rs
  📁 typescript/
    📁 browser/
      📄 .gitignore
      📄 build_and_run.py
      🌐 index.html
      📊 package-lock.json
      📊 package.json
      📁 src/
        📁 audio/
          📘 simple-worklet.ts
          📘 smooth-worklet.ts
        📘 main.ts
        📁 synth/
          📘 simple.ts
          📘 smooth.ts
      📊 tsconfig.json
      📘 vite.config.ts
    📁 cli/
      📄 .gitignore
      📖 BUFFER_SIZE_FIX.md
      📖 DELIVERY_SUMMARY.md
      📖 DIAGNOSTIC_GUIDE.md
      📖 FREQUENCY_UPDATE_FIX.md
      📖 INVESTIGATION_REPORT.md
      📖 NAUDIODON_MIGRATION.md
      📖 NAUDIODON_MIGRATION_COMPLETION.md
      📖 NAUDIODON_MIGRATION_SUMMARY.md
      📖 README.md
      📖 USER_GUIDE.md
      📄 build_and_run.py
      📊 package-lock.json
      📊 package.json
      📁 src/
        📁 audio/
          📘 output.ts
        📁 diagnostics/
          📖 README.md
          📘 main-diagnostic.ts
          📘 test-frequency-sweep.ts
          📘 test-mouse-audio.ts
          📘 test-mouse-capture.ts
        📘 main.ts
        📁 mouse/
          📘 position.ts
        📁 synth/
          📘 simple.ts
          📘 smooth.ts
        📁 types/
          📘 naudiodon.d.ts
      📊 tsconfig.json

## ファイル詳細分析
**googled947dc864c270e07.html** (1行, 53バイト)
  - 関数: なし
  - インポート: なし

**src/obsidian/src/audio/simple-worklet.ts** (58行, 1446バイト)
  - 関数: constructor, if, process, for
  - インポート: なし

**src/obsidian/src/audio/smooth-worklet.ts** (72行, 2234バイト)
  - 関数: constructor, if, process, for
  - インポート: なし

**src/obsidian/src/main.ts** (153行, 3875バイト)
  - 関数: onload, if, onunload, switch, catch, enableOscillator, switchVersion
  - インポート: obsidian, ./synth/simple, ./synth/smooth

**src/obsidian/src/mouse-handler.ts** (67行, 1946バイト)
  - 関数: constructor, if
  - インポート: ./synth/simple, ./synth/smooth

**src/obsidian/src/synth/simple.ts** (76行, 2380バイト)
  - 関数: catch, if, start
  - インポート: ../audio/simple-worklet

**src/obsidian/src/synth/smooth.ts** (81行, 2553バイト)
  - 関数: catch, if, start
  - インポート: ../audio/smooth-worklet

**src/typescript/browser/index.html** (176行, 4078バイト)
  - 関数: なし
  - インポート: なし

**src/typescript/browser/src/audio/simple-worklet.ts** (66行, 1872バイト)
  - 関数: constructor, handleMessage, if, for
  - インポート: なし

**src/typescript/browser/src/audio/smooth-worklet.ts** (82行, 2757バイト)
  - 関数: constructor, handleMessage, if, for
  - インポート: なし

**src/typescript/browser/src/main.ts** (167行, 5183バイト)
  - 関数: constructor, if, switch, catch, handleStart
  - インポート: ./synth/simple, ./synth/smooth

**src/typescript/browser/src/synth/simple.ts** (73行, 2258バイト)
  - 関数: catch, if, start
  - インポート: なし

**src/typescript/browser/src/synth/smooth.ts** (69行, 1789バイト)
  - 関数: catch, if, start
  - インポート: なし

**src/typescript/browser/vite.config.ts** (13行, 187バイト)
  - 関数: なし
  - インポート: vite

**src/typescript/cli/src/audio/output.ts** (158行, 5333バイト)
  - 関数: createAudioOutput, constructor, if
  - インポート: naudiodon

**src/typescript/cli/src/diagnostics/main-diagnostic.ts** (250行, 8631バイト)
  - 関数: mapRange, main, printDiagnostics, if, catch
  - インポート: ../audio/output.js, ../mouse/position.js, ../synth/simple.js

**src/typescript/cli/src/diagnostics/test-frequency-sweep.ts** (210行, 7534バイト)
  - 関数: testFrequencySweep, analyzeResults, constructor, for, if
  - インポート: ../audio/output.js

**src/typescript/cli/src/diagnostics/test-mouse-audio.ts** (262行, 9269バイト)
  - 関数: mapRange, testMouseAudio, analyzeResults, constructor, for, if, catch
  - インポート: ../audio/output.js, ../mouse/position.js

**src/typescript/cli/src/diagnostics/test-mouse-capture.ts** (163行, 5678バイト)
  - 関数: testMouseCapture, analyzeResults, if, catch, for
  - インポート: ../mouse/position.js

**src/typescript/cli/src/main.ts** (131行, 4440バイト)
  - 関数: mapRange, main, if, catch
  - インポート: ./audio/output.js, ./mouse/position.js, ./synth/simple.js

**src/typescript/cli/src/mouse/position.ts** (42行, 674バイト)
  - 関数: getMousePosition, getScreenSize
  - インポート: robotjs

**src/typescript/cli/src/synth/simple.ts** (79行, 2165バイト)
  - 関数: constructor, for, if
  - インポート: なし

**src/typescript/cli/src/synth/smooth.ts** (89行, 2925バイト)
  - 関数: constructor, for, if
  - インポート: なし

**src/typescript/cli/src/types/naudiodon.d.ts** (47行, 1294バイト)
  - 関数: getDevices
  - インポート: stream

## 関数呼び出し階層
- if (src/obsidian/src/main.ts)
  - onload (src/obsidian/src/main.ts)
    - onunload ()
      - enableOscillator ()
      - switchVersion ()
      - start ()
  - catch (src/obsidian/src/main.ts)
    - createAudioOutput (src/typescript/cli/src/audio/output.ts)
      - constructor (undefined)
    - mapRange (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
      - main ()
      - printDiagnostics ()
      - getMousePosition ()
      - getScreenSize ()
    - analyzeResults ()
      - testMouseCapture (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
- switch (src/obsidian/src/main.ts)
- testFrequencySweep (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)
- for (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
- getDevices (src/typescript/cli/src/types/naudiodon.d.ts)


## プロジェクト構造（ファイル一覧）
.vscode/settings.json
BUILD_SCRIPTS.md
README.md
googled947dc864c270e07.html
issue-notes/20_OBSIDIAN_IMPLEMENTATION_PLAN.md
issue-notes/22_GO_CGO_EXPLANATION.md
issue-notes/22_GO_COMPLETION_REPORT.md
issue-notes/22_GO_INVESTIGATION_CGO_ALTERNATIVES.md
issue-notes/22_GO_PRECOMPILED_BINARY_SETUP.md
issue-notes/22_GO_QUICKSTART.md
issue-notes/22_GO_README.md
issue-notes/24_OBSIDIAN_COMPARISON.md
issue-notes/24_OBSIDIAN_COMPLETION_REPORT.md
issue-notes/24_OBSIDIAN_MANUAL_TEST.md
issue-notes/24_OBSIDIAN_README.md
issue-notes/2_GO_IMPLEMENTATION_PLAN.md
issue-notes/2_IMPLEMENTATION_PLAN_SUMMARY.md
issue-notes/2_RUST_IMPLEMENTATION_PLAN.md
issue-notes/2_TYPESCRIPT_IMPLEMENTATION_PLAN.md
issue-notes/32_TYPESCRIPT_CLI_COMPLETION_REPORT.md
issue-notes/32_TYPESCRIPT_CLI_MIGRATION_NOTES.md
issue-notes/32_TYPESCRIPT_CLI_QUICKSTART.md
issue-notes/32_TYPESCRIPT_CLI_README.md
issue-notes/32_TYPESCRIPT_CLI_VERIFICATION.md
issue-notes/34_BUILD_AND_RUN.md
issue-notes/44_GO_IMPLEMENTATION_REPORT_OTO.md
issue-notes/44_GO_QUICKSTART_OTO.md
issue-notes/44_GO_README_OTO.md
issue-notes/4_RUST_COMPLETION_REPORT.md
issue-notes/4_RUST_QUICKSTART.md
src/go/README.md
src/go-portaudio/QUICKSTART.md
src/obsidian/manifest.json
src/typescript/browser/index.html
src/typescript/cli/BUFFER_SIZE_FIX.md

上記の情報を基に、プロンプトで指定された形式でプロジェクト概要を生成してください。
特に以下の点を重視してください：
- 技術スタックは各カテゴリごとに整理して説明
- ファイル階層ツリーは提供された構造をそのまま使用
- ファイルの説明は各ファイルの実際の内容と機能に基づく
- 関数の説明は実際に検出された関数の役割に基づく
- 関数呼び出し階層は実際の呼び出し関係に基づく


---
Generated at: 2025-12-02 07:02:55 JST
