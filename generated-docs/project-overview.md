Last updated: 2026-01-28

# Project Overview

## プロジェクト概要
- マウス操作でリアルタイムに音響合成パラメータを制御するインタラクティブなシンセサイザーです。
- ハードシンク技術と指数平滑化により、豊かで滑らかな音色を生成します。
- Python, Rust, Go, TypeScriptなど複数の言語で実装され、それぞれの環境で動作検証されています。

## 技術スタック
- フロントエンド: 
    - **TypeScript (Browser/Obsidian)**: Webブラウザ版およびObsidianプラグイン版のインタフェースとロジックを実装しています。
    - **HTML**: Webブラウザ版のユーザーインターフェース構造を定義しています。
    - **Vite**: TypeScriptブラウザ版の高速な開発サーバーとバンドラーとして使用されています。
- 音楽・オーディオ: 
    - **ハードシンク（オシレータ同期）**: 独特の音色を生成する主要な音響合成技術です。
    - **Python (sounddevice, scipy, numpy)**: Python版でのリアルタイムオーディオ処理と数値計算に利用されています。
    - **Rust (cpal)**: Rust版でのクロスプラットフォームオーディオ入出力ライブラリです。
    - **Go (Oto, PortAudio)**: Go版でのピュアGoオーディオライブラリ(Oto)およびC言語コンパイラを必要とするPortAudioライブラリを利用したオーディオ出力に対応しています。
    - **Web Audio API (TypeScript Browser/Obsidian)**: ブラウザやObsidian環境でのオーディオ処理に利用されており、`AudioWorklet` を活用しています。
    - **naudiodon (TypeScript CLI)**: Node.js CLI版でのオーディオ入出力ライブラリです。
- 開発ツール: 
    - **Git**: ソースコードのバージョン管理に使用されています。
    - **pipx**: Pythonアプリケーションを分離された環境でインストール・実行するためのツールです。
    - **pip**: Pythonパッケージの管理ツールです。
    - **VSCode**: 推奨される統合開発環境（IDE）です。
    - **robotjs**: TypeScript CLI版でマウス位置を取得するためのライブラリです。
    - **esbuild**: Obsidianプラグイン版のバンドルツールとして使用されています。
- テスト: 
    - **pytest (Python)**: Pythonコードの単体テストフレームワークです。
- ビルドツール: 
    - **Cargo (Rust)**: Rustプロジェクトのビルドシステムとパッケージマネージャーです。
    - **Go Modules (Go)**: Goプロジェクトの依存関係管理とビルドシステムです。
    - **npm/yarn**: TypeScriptプロジェクトの依存関係管理とスクリプト実行ツールです。
    - **Vite (TypeScript Browser)**: TypeScriptブラウザ版のビルドツールです。
    - **esbuild (Obsidian)**: Obsidianプラグインのバンドルツールです。
- 言語機能: 
    - **Python 3.8+**: 主要なスクリプト言語として利用されています。
    - **Rust**: 高性能なシステムプログラミング言語です。
    - **Go**: 並行処理に強いコンパイル言語です。
    - **TypeScript**: JavaScriptに型安全性を加えた言語で、Node.js環境やブラウザ環境で使用されています。
- 自動化・CI/CD: 
    - **`build_and_run.py` スクリプト**: 各言語版の環境構築、ビルド、実行を自動化するためのPythonスクリプトです。
- 開発標準: 
    - **ruff**: Pythonコードのフォーマッター兼リンターで、コード品質の維持に貢献しています。
    - **EditorConfig**: 複数エディタ・IDE間でのコードスタイル統一設定です。
    - **Pylance**: VSCode向けPython言語サーバーです。

## ファイル階層ツリー
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

## ファイル詳細説明
- **`LICENSE`**: このプロジェクトがMITライセンスの下で公開されていることを示すライセンス情報ファイルです。
- **`README.md`**: プロジェクトの目的、機能、デモ、インストール方法、使用方法、技術詳細、プロジェクト構造などが詳細に記述されたメインドキュメントです。
- **`build_and_run.py`**: すべての言語版（Python、Rust、Go、TypeScript）を一度にビルドし、メニュー形式で選択・実行できるWindows専用のスクリプトです。
- **`src/build_utils.py`**: `build_and_run.py`などのスクリプトで共通利用されるユーティリティ関数が定義されています。
- **`src/python/sync_simple.py`**: Pythonで実装された、シンプル版のシンセサイザーのメインスクリプトです。マウス位置の変化が8msごとに音に反映されます。
- **`src/python/sync_smooth.py`**: Pythonで実装された、スムーズ版のシンセサイザーのメインスクリプトです。指数平滑化により1サンプルごとの滑らかな周波数変化を実現します。
- **`src/go/cmd/sync_simple_oto/main.go`**: Go言語 (Otoライブラリ使用) で実装されたシンプル版シンセサイザーのエントリポイントです。
- **`src/go/cmd/sync_smooth_oto/main.go`**: Go言語 (Otoライブラリ使用) で実装されたスムーズ版シンセサイザーのエントリポイントです。
- **`src/go/internal/mouse/position_windows.go`**: Windows環境に特化した、Go言語によるマウス位置取得ロジックを実装しています。
- **`src/go/internal/synth/simple.go`**: Go言語によるシンプル版シンセサイザーのオーディオ合成コアロジックを実装しています。
- **`src/go/internal/synth/smooth.go`**: Go言語によるスムーズ版シンセサイザーのオーディオ合成コアロジックを実装しています。
- **`src/rust/src/sync_simple.rs`**: Rustで実装された、シンプル版シンセサイザーのオーディオ合成コアロジックです。
- **`src/rust/src/sync_smooth.rs`**: Rustで実装された、スムーズ版シンセサイザーのオーディオ合成コアロジックです。
- **`src/typescript/browser/index.html`**: TypeScriptブラウザ版のHTMLエントリポイントであり、ユーザーインターフェースを提供します。
- **`src/typescript/browser/src/audio/simple-worklet.ts`**: Web Audio APIの`AudioWorklet`として動作する、シンプル版シンセサイザーのオーディオ処理ロジックです。
- **`src/typescript/browser/src/audio/smooth-worklet.ts`**: Web Audio APIの`AudioWorklet`として動作する、スムーズ版シンセサイザーのオーディオ処理ロジックです。
- **`src/typescript/browser/src/main.ts`**: TypeScriptブラウザ版のメインアプリケーションロジックを制御し、シンセサイザーの起動や停止を管理します。
- **`src/typescript/cli/src/audio/output.ts`**: TypeScript CLI版で、`naudiodon`ライブラリを使用してシステムオーディオへの出力ストリームを管理する機能を提供します。
- **`src/typescript/cli/src/mouse/position.ts`**: TypeScript CLI版で、`robotjs`ライブラリを介して現在のマウスカーソル位置やスクリーンサイズを取得する機能を提供します。
- **`src/typescript/cli/src/synth/simple.ts`**: TypeScript CLI版で実装されたシンプル版シンセサイザーのオーディオ合成コアロジックです。
- **`src/typescript/cli/src/synth/smooth.ts`**: TypeScript CLI版で実装されたスムーズ版シンセサイザーのオーディオ合成コアロジックです。
- **`src/obsidian/src/main.ts`**: Obsidianプラグインのメインエントリポイントです。プラグインのロード・アンロード処理や、シンセサイザーの有効化・バージョン切り替えロジックを含みます。
- **`src/obsidian/src/mouse-handler.ts`**: Obsidianプラグイン内でマウスイベントを処理し、シンセサイザーのパラメータ制御に利用するロジックを実装しています。
- **`issue-notes/`ディレクトリ**: 各言語の実装計画、課題、完了報告、クイックスタートガイドなど、開発に関する詳細なメモやドキュメントが格納されています。

## 関数詳細説明
- **`constructor()`**: 各クラス（例: `MouseControlledSynth`, `AudioWorkletProcessor`, `OscillatorModule`, `MouseHandler`）のインスタンスが生成される際に呼び出される初期化関数です。サンプリングレートや時定数、マウスポーリング間隔などの初期設定を行います。
- **`process(inputs, outputs, parameters)`**: Web Audio APIの`AudioWorkletProcessor`内で実行されるコア関数です。リアルタイムでオーディオデータを処理し、マスターオシレータとスレーブオシレータの波形を合成して出力バッファに書き込みます。
- **`onload()` (Obsidianプラグイン)**: Obsidianプラグインが起動・ロードされた際に実行される初期化処理です。シンセサイザーのインスタンス化やマウスイベントリスナーの設定などを行います。
- **`onunload()` (Obsidianプラグイン)**: Obsidianプラグインが停止・アンロードされる際に実行されるクリーンアップ処理です。オーディオリソースの解放やイベントリスナーの解除などを行います。
- **`enableOscillator(version)` (Obsidianプラグイン)**: 指定されたバージョン（シンプルまたはスムーズ）のオシレータを有効にし、オーディオ処理を開始します。
- **`switchVersion(newVersion)` (Obsidianプラグイン)**: 現在のシンセサイザーバージョンを切り替える関数です。
- **`start(version, audioContext)` (Synthクラス)**: 特定のシンセサイザー（シンプル版またはスムーズ版）のオーディオストリームを開始する関数です。
- **`createAudioOutput(samplerate, channels, bufferSize)` (TypeScript CLI)**: `naudiodon`ライブラリを利用して、指定されたサンプリングレート、チャンネル数、バッファサイズでオーディオ出力ストリームを初期化し、返します。
- **`getMousePosition()` (TypeScript CLI/Go)**: 現在のマウスカーソルのX座標とY座標をシステムから取得して返します。
- **`getScreenSize()` (TypeScript CLI)**: 現在のスクリーンの幅と高さを取得して返します。
- **`mapRange(value, inMin, inMax, outMin, outMax)` (TypeScript CLI)**: ある範囲（`inMin`から`inMax`）の数値を、別の範囲（`outMin`から`outMax`）に線形的にマッピングする汎用関数です。マウス座標を周波数に変換する際などに使用されます。
- **`main(version, pollingIntervalMs)` (TypeScript CLI)**: TypeScript CLI版アプリケーションのエントリポイントです。マウスイベントの監視、周波数計算、オーディオ出力のループを管理します。
- **`printDiagnostics(data)` (TypeScript CLI)**: 診断情報を整形してコンソールに出力する関数です。
- **`testFrequencySweep(output, minFreq, maxFreq, durationMs)` (TypeScript CLI)**: オーディオ出力が正しく機能しているかを確認するため、指定された範囲で周波数をスイープさせるテストを実行します。
- **`testMouseAudio(output, durationMs)` (TypeScript CLI)**: マウス操作とオーディオ出力の連携をテストし、マウスの動きに応じて音が変化することを確認します。
- **`testMouseCapture(durationMs)` (TypeScript CLI)**: マウス位置のキャプチャ機能が正確に動作しているかをテストします。
- **`analyzeResults(results)` (TypeScript CLI)**: 実施されたテストの結果を分析し、サマリーやエラー情報をレポートする関数です。
- **`getDevices()` (naudiodon.d.ts)**: `naudiodon`ライブラリが提供する、システム上のオーディオデバイス情報を取得する関数です。

## 関数呼び出し階層ツリー
```
- if (src/obsidian/src/main.ts)
  - onload()
    - onunload()
    - enableOscillator()
    - switchVersion()
    - start()
  - catch()
    - createAudioOutput()
      - constructor()
    - mapRange()
      - main()
      - printDiagnostics()
      - getMousePosition()
      - getScreenSize()
    - analyzeResults()
      - testMouseCapture()
- switch()
- testFrequencySweep()
- for()
- getDevices()

---
Generated at: 2026-01-28 07:03:31 JST
