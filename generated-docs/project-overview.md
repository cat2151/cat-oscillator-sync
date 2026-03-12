Last updated: 2026-03-13

# Project Overview

## プロジェクト概要
- マウス操作で音色をリアルタイムに制御できる、オシレータ・ハードシンク・シンセサイザーです。
- Webブラウザ、Python、Rust、Goなど複数のプログラミング言語で実装されており、それぞれ異なる特性を持ちます。
- 「Simple版」と「Smooth版」の2種類のシンセシスモードを提供し、多様なサウンド体験が可能です。

## 技術スタック
- フロントエンド:
    - TypeScript: Web Audio APIを用いたブラウザベースのシンセサイザー実装に利用されています。
    - Web Audio API: ブラウザでのリアルタイムオーディオ処理と低レイテンシ出力に利用されています。
    - Vite: TypeScriptブラウザ版の高速開発サーバーおよびビルドツールとして使用されています。
- 音楽・オーディオ:
    - オシレータ・ハードシンク・シンセシス: プロジェクトの中核となる音響合成アルゴリズム（Simple版とSmooth版の2種類）。
    - Web Audio API: ブラウザ版のオーディオ出力。
    - PortAudio: Go言語版（PortAudio+Zig cc）における低レイテンシオーディオI/Oライブラリ。
    - Oto: Go言語版（Pure Go）におけるPure Go実装のオーディオ出力ライブラリ。
    - naudiodon: TypeScript CLI版におけるNode.js向けのオーディオ出力ライブラリ。
- 開発ツール:
    - Git: プロジェクトのバージョン管理システム。
    - GitHub Actions: READMEファイルの自動翻訳など、継続的インテグレーション/デリバリーに利用されています。
    - npm: TypeScriptプロジェクトのパッケージ管理。
    - Cargo: Rustプロジェクトのパッケージ管理およびビルドツール。
    - pipx/pip: Pythonプロジェクトのパッケージ管理。
    - go build: Goプロジェクトのビルドコマンド。
    - Zig cc: Go言語版（PortAudio+Zig cc）でC言語コンパイラとして使用されます。
- テスト:
    - pytest: Pythonプロジェクトのテストフレームワーク。
    - Go言語標準テスト: Go言語に組み込まれているテスト機能。
- ビルドツール:
    - npm: TypeScriptプロジェクトのビルド。
    - Cargo: Rustプロジェクトのビルド。
    - go build: Goプロジェクトのビルド。
    - pip: Pythonプロジェクトの依存関係インストール。
    - Vite: TypeScript Browser版のビルド。
- 言語機能:
    - Python, Rust, Go, TypeScript: 同じシンセシスアルゴリズムを複数のプログラミング言語で実装し、比較・検証するために使用されています。
- 自動化・CI/CD:
    - GitHub Actions: 多言語READMEの自動翻訳などの自動化プロセスに利用。
    - build_and_run.py: Windows環境で各言語版の一括ビルドと実行を自動化するユーティリティスクリプト。
- 開発標準:
    - .editorconfig: エディタ設定をプロジェクト全体で統一するためのファイル。
    - ruff.toml: Pythonコードのフォーマットとリンティング（コード品質検査）の設定ファイル。

## ファイル階層ツリー
```
📄 .editorconfig
📄 .gitignore
📁 .vscode/
  📊 settings.json
📖 BROWSER_FIX_SUMMARY.md
📄 LICENSE
📖 README.ja.md
📖 README.md
📄 _config.yml
📄 build_and_run.py
📁 generated-docs/
🌐 googled947dc864c270e07.html
📁 issue-notes/
  📖 96.md
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
        📘 constants.ts
        📘 main.ts
        📁 synth/
          📘 simple.ts
          📘 smooth.ts
        📘 vite-env.d.ts
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
```

## ファイル詳細説明
- `README.ja.md`, `README.md`: プロジェクトの概要、インストール方法、使い方、技術詳細などを説明する日本語版と英語版のメインドキュメント。
- `LICENSE`: プロジェクトのライセンス情報（MIT License）。
- `_config.yml`: GitHub Pagesの設定ファイル。
- `build_and_run.py`: Windows環境で各言語版（Python, Rust, Go, TypeScript）のビルドと実行を一元的に行うためのPythonスクリプト。
- `pyproject.toml`, `requirements.txt`: Pythonプロジェクトの依存関係と設定ファイル。
- `pytest.ini`: Pythonのテストフレームワークpytestの設定ファイル。
- `ruff.toml`: Pythonコードのフォーマッタ/リンタであるRuffの設定ファイル。
- `src/go/`: Go言語によるシンセサイザー実装のディレクトリ。
    - `src/go/cmd/sync_simple_oto/main.go`, `src/go/cmd/sync_smooth_oto/main.go`: Pure Go (Oto) 版のSimple/Smoothシンセサイザーのエントリーポイント。
    - `src/go/internal/mouse/position.go`: Go言語版でのマウス位置取得ロジック。
    - `src/go/internal/synth/simple.go`, `src/go/internal/synth/smooth.go`: Go言語版のSimple/Smoothシンセシスアルゴリズムのコア実装。
- `src/go-portaudio/`: Go言語によるPortAudio+Zig cc版シンセサイザー実装のディレクトリ。
    - `src/go-portaudio/cmd/sync_simple/main.go`, `src/go-portaudio/cmd/sync_smooth/main.go`: PortAudio版のSimple/Smoothシンセサイザーのエントリーポイント。
    - `src/go-portaudio/download_portaudio.py`: PortAudioのDLLをダウンロードするためのPythonスクリプト。
- `src/python/`: Pythonによるシンセサイザー実装のディレクトリ。
    - `src/python/sync_simple.py`, `src/python/sync_smooth.py`: Python版のSimple/Smoothシンセサイザーのエントリーポイントと実装。
- `src/rust/`: Rustによるシンセサイザー実装のディレクトリ。
    - `src/rust/src/sync_simple.rs`, `src/rust/src/sync_smooth.rs`: Rust版のSimple/Smoothシンセサイザーのエントリーポイントと実装。
- `src/typescript/browser/`: TypeScriptによるブラウザ版シンセサイザー実装のディレクトリ。
    - `src/typescript/browser/index.html`: ブラウザ版のウェブページのエントリーファイル。
    - `src/typescript/browser/package.json`, `package-lock.json`: TypeScriptブラウザ版の依存関係とプロジェクト設定ファイル。
    - `src/typescript/browser/src/audio/simple-worklet.ts`, `src/typescript/browser/src/audio/smooth-worklet.ts`: Web Audio APIのAudioWorkletProcessorとして、Simple/Smoothシンセシスロジックをバックグラウンドで処理するスクリプト。
    - `src/typescript/browser/src/main.ts`: ブラウザ版のメインロジック、オーディオコンテキストの初期化やイベントハンドリング。
    - `src/typescript/browser/src/synth/simple.ts`, `src/typescript/browser/src/synth/smooth.ts`: ブラウザ版のSimple/Smoothシンセサイザーの制御ロジック。
    - `src/typescript/browser/vite.config.ts`: Viteビルドツールの設定ファイル。
- `src/typescript/cli/`: TypeScriptによるCLI版シンセサイザー実装のディレクトリ。
    - `src/typescript/cli/README.md`: CLI版のREADMEファイル。
    - `src/typescript/cli/package.json`, `package-lock.json`: TypeScript CLI版の依存関係とプロジェクト設定ファイル。
    - `src/typescript/cli/src/audio/output.ts`: naudiodonライブラリを使用したオーディオ出力の抽象化レイヤー。
    - `src/typescript/cli/src/diagnostics/`: 診断ツール関連ファイル群。
        - `src/typescript/cli/src/diagnostics/main-diagnostic.ts`: 主要な診断ツールのエントリーポイント。
        - `src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`: 周波数スイープテストの実装。
        - `src/typescript/cli/src/diagnostics/test-mouse-audio.ts`: マウス入力とオーディオ出力の連携テスト。
        - `src/typescript/cli/src/diagnostics/test-mouse-capture.ts`: マウスキャプチャ機能のテスト。
    - `src/typescript/cli/src/main.ts`: CLI版のメインロジック、マウス入力とオーディオ出力の連携処理。
    - `src/typescript/cli/src/mouse/position.ts`: robotjsライブラリを使用したマウス位置取得ロジック。
    - `src/typescript/cli/src/synth/simple.ts`, `src/typescript/cli/src/synth/smooth.ts`: CLI版のSimple/Smoothシンセシスアルゴリズムのコア実装。
    - `src/typescript/cli/src/types/naudiodon.d.ts`: naudiodonライブラリの型定義ファイル。

## 関数詳細説明
- `constructor` (src/typescript/browser/src/audio/simple-worklet.ts, src/typescript/browser/src/audio/smooth-worklet.ts): Web Audio APIのAudioWorkletProcessorクラスのコンストラクタ。オーディオ処理の初期設定を行います。
- `handleMessage` (src/typescript/browser/src/audio/simple-worklet.ts, src/typescript/browser/src/audio/smooth-worklet.ts): AudioWorkletProcessorで、メインスレッドから送られたメッセージ（例: マウス座標）を処理し、シンセシスパラメータを更新します。
- `handleStart` (src/typescript/browser/src/main.ts): ブラウザ版アプリケーションの起動時にオーディオコンテキストを初期化し、シンセサイザーの再生を開始します。
- `start` (src/typescript/browser/src/synth/simple.ts, src/typescript/browser/src/synth/smooth.ts): 各シンセサイザーインスタンスの再生を開始し、Web Audio APIのノードを接続します。
- `createAudioOutput` (src/typescript/cli/src/audio/output.ts): CLI版で、naudiodonライブラリを使用してオーディオ出力ストリームを初期化し、設定を行います。
- `mapRange` (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts): ある範囲の値を別の範囲に線形変換するユーティリティ関数。マウス座標から周波数値を計算する際などに使用されます。
- `main` (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts): CLI版アプリケーションの主要なエントリーポイント関数。診断ツールまたはメインのシンセサイザーアプリケーションを実行します。
- `printDiagnostics` (src/typescript/cli/src/diagnostics/main-diagnostic.ts): 診断結果をコンソールに出力する関数。
- `testFrequencySweep` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts): 特定の周波数範囲で音を鳴らし、オーディオ出力が正しく機能するかをテストします。
- `analyzeResults` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/diagnostics/test-mouse-capture.ts): 各診断テストの結果を分析し、レポートを生成します。
- `testMouseAudio` (src/typescript/cli/src/diagnostics/test-mouse-audio.ts): マウス入力とオーディオ出力の連携をテストし、レイテンシなどのパフォーマンスを評価します。
- `testMouseCapture` (src/typescript/cli/src/diagnostics/test-mouse-capture.ts): マウス位置の取得機能が正しく動作するかをテストし、その精度を評価します。
- `getMousePosition` (src/typescript/cli/src/mouse/position.ts): 現在のマウスカーソル座標 (X, Y) を取得します。
- `getScreenSize` (src/typescript/cli/src/mouse/position.ts): 画面の解像度（幅と高さ）を取得します。
- `getDevices` (src/typescript/cli/src/types/naudiodon.d.ts): naudiodonライブラリの機能の一部で、システム上の利用可能なオーディオデバイスのリストを取得します。

## 関数呼び出し階層ツリー
```
- アプリケーション起動/初期化 (main, handleStartなど)
  - オーディオ出力初期化 (createAudioOutput, AudioWorkletProcessorのconstructorなど)
    - シンセシスロジック生成 (simple.ts, smooth.ts内の音波生成ロジック)
  - マウス位置取得 (getMousePosition)
    - マウス座標から周波数・音色パラメータへの変換 (mapRangeなどのユーティリティ関数)
      - シンセシスロジックへのパラメータ適用

---
Generated at: 2026-03-13 07:05:03 JST
