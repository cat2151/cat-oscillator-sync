Last updated: 2026-01-29

# Project Overview

## プロジェクト概要
- マウス操作でリアルタイムに音色を制御できる、インタラクティブなシンセサイザーです。
- ハードシンク（オシレータ同期）技術を活用し、豊かで表現力豊かなサウンドを生成します。
- Python, Rust, Go, TypeScriptといった多様な言語で実装された音響合成の実験プロジェクトです。

## 技術スタック
- フロントエンド:
    - **TypeScript (ブラウザ版)**: Webブラウザ上で動作するシンセサイザーの実装に利用。Web Audio APIとWeb Audio Workletを使用。
    - **Obsidianプラグイン (TypeScript)**: ノートアプリObsidian内でシンセサイザーを動作させるプラグイン開発に利用。
- 音楽・オーディオ:
    - **ハードシンク (Oscillator Sync)**: オシレータの位相を強制的にリセットすることで、複雑な倍音を持つ音色を生成する音響合成技術。
    - **PortAudio (Go, Rust)**: 複数のプラットフォームで動作するオーディオI/Oライブラリ。Go版とRust版で使用。
    - **Oto (Go)**: Pure Goで書かれたクロスプラットフォームなオーディオライブラリ。Go版（CGO不要版）で使用。
    - **naudiodon (TypeScript CLI)**: Node.jsでオーディオストリームを扱うためのライブラリ。TypeScript CLI版で使用。
- 開発ツール:
    - **pipx**: Pythonアプリケーションを隔離された環境にインストール・実行するためのツール。
    - **pip**: Pythonパッケージ管理ツール。
    - **Git**: バージョン管理システム。
    - **VS Code拡張機能**: Python, Pylance, Ruff, EditorConfigなど、開発効率向上のための推奨拡張機能。
- テスト:
    - **pytest**: Pythonコードの単体テストフレームワーク。
    - (Go, Rust, TypeScript): 各言語の標準テスト機能や診断スクリプトが部分的に利用されています。
- ビルドツール:
    - **Cargo**: Rustのビルドシステムおよびパッケージマネージャー。
    - **Go Modules**: Go言語の依存関係管理システム。
    - **esbuild (Obsidian)**: TypeScript/JavaScriptコードを高速にバンドル・トランスパイルするツール。
    - **Vite (TypeScript Browser)**: 高速な開発サーバーとバンドラを提供するフロントエンドビルドツール。
    - **npm/yarn**: Node.jsプロジェクトのパッケージ管理ツール。
    - **Zig cc**: Go言語のPortAudio版をビルドする際に利用されるC言語コンパイラ。
- 言語機能:
    - **Python 3.8+**: 主要な実装言語の一つ。
    - **Rust**: 高性能なシステムプログラミング言語。
    - **Go**: シンプルさと効率性を重視したコンパイル言語。
    - **TypeScript**: JavaScriptに静的型チェックを追加した言語。
    - **JavaScript (Node.js)**: TypeScript CLI版の実行環境。
- 自動化・CI/CD:
    - **`build_and_run.py`**: マルチ言語版のビルドと実行を統合するカスタムスクリプト。
- 開発標準:
    - **ruff**: Pythonコードのリンティングとフォーマットを高速に行うツール。
    - **EditorConfig**: 異なるエディタやIDE間で一貫したコーディングスタイルを維持するための設定ファイル。

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
    ├── go/                # Go実装（Oto版）
    │   ├── cmd/
    │   │   ├── sync_simple_oto/ # シンプル版Goシンセサイザーのエントリポイント
    │   │   └── sync_smooth_oto/ # スムーズ版Goシンセサイザーのエントリポイント
    │   └── internal/
    │       ├── mouse/      # Go版マウス位置取得モジュール
    │       └── synth/      # Go版シンセサイザーコアロジック
    ├── go-portaudio/      # Go実装（PortAudio版）
    │   ├── cmd/
    │   │   ├── sync_simple/ # シンプル版Go PortAudioシンセサイザーのエントリポイント
    │   │   └── sync_smooth/ # スムーズ版Go PortAudioシンセサイザーのエントリポイント
    │   └── internal/
    │       ├── mouse/      # Go PortAudio版マウス位置取得モジュール
    │       └── synth/      # Go PortAudio版シンセサイザーコアロジック
    ├── obsidian/          # Obsidianプラグイン実装
    │   ├── src/
    │   │   ├── audio/      # Obsidian版Web Audio Workletスクリプト
    │   │   ├── synth/      # Obsidian版シンセサイザーコアロジック
    │   │   └── main.ts     # Obsidianプラグインのエントリポイント
    │   │   └── mouse-handler.ts # Obsidian版マウスイベントハンドラ
    ├── rust/              # Rust実装
    │   └── src/
    │       ├── sync_simple.rs # シンプル版Rustシンセサイザー
    │       └── sync_smooth.rs # スムーズ版Rustシンセサイザー
    └── typescript/        # TypeScript実装
        ├── browser/       # ブラウザ版
        │   ├── src/
        │   │   ├── audio/  # ブラウザ版Web Audio Workletスクリプト
        │   │   ├── synth/  # ブラウザ版シンセサイザーコアロジック
        │   │   └── main.ts # ブラウザ版アプリケーションのエントリポイント
        └── cli/           # CLI版（Node.js）
            ├── src/
            │   ├── audio/  # CLI版オーディオ出力処理
            │   ├── diagnostics/ # CLI版診断ツール
            │   ├── mouse/  # CLI版マウス位置取得処理
            │   ├── synth/  # CLI版シンセサイザーコアロジック
            │   └── main.ts # CLI版アプリケーションのエントリポイント
```

## ファイル詳細説明
- **`LICENSE`**: プロジェクトのライセンス情報 (MIT License) を定義しています。
- **`README.md`**: プロジェクトの概要、インストール方法、使用方法、技術詳細などを説明するメインドキュメントです。
- **`pytest.ini`**: Pythonのテストフレームワークであるpytestの設定ファイルです。
- **`ruff.toml`**: Pythonコードのリンター・フォーマッターであるruffの設定ファイルです。
- **`src/python/sync_simple.py`**: マウス位置に応じて周波数が8ms間隔で階段状に変化する、Python版シンプルシンセサイザーのコアロジックです。
- **`src/python/sync_smooth.py`**: 指数平滑化により1サンプルごとに滑らかな周波数変化を実現する、Python版スムースシンセサイザーのコアロジックです。
- **`src/go/cmd/sync_simple_oto/main.go`**: Go言語（Otoライブラリ使用）によるシンプル版シンセサイザーのエントリポイントです。
- **`src/go/cmd/sync_smooth_oto/main.go`**: Go言語（Otoライブラリ使用）によるスムース版シンセサイザーのエントリポイントです。
- **`src/go/internal/mouse/position.go`**: Go言語版でマウス位置を取得するための共通インターフェースやヘルパー関数を提供します。
- **`src/go/internal/mouse/position_windows.go`**: Go言語版において、Windows OSでのマウス位置取得処理を実装しています。
- **`src/go/internal/synth/simple.go`**: Go言語版シンプルシンセサイザーの音響合成ロジックです。
- **`src/go/internal/synth/smooth.go`**: Go言語版スムースシンセサイザーの音響合成ロジックです。
- **`src/go-portaudio/cmd/sync_simple/main.go`**: Go言語（PortAudioライブラリ使用）によるシンプル版シンセサイザーのエントリポイントです。
- **`src/go-portaudio/cmd/sync_smooth/main.go`**: Go言語（PortAudioライブラリ使用）によるスムース版シンセサイザーのエントリポイントです。
- **`src/rust/src/sync_simple.rs`**: Rust言語によるシンプル版シンセサイザーのコアロジックです。
- **`src/rust/src/sync_smooth.rs`**: Rust言語によるスムース版シンセサイザーのコアロジックです。
- **`src/obsidian/src/audio/simple-worklet.ts`**: Obsidianプラグイン版シンプルシンセのWeb Audio Workletスクリプトで、オーディオ処理のバックグラウンド実行を担います。
- **`src/obsidian/src/audio/smooth-worklet.ts`**: Obsidianプラグイン版スムースシンセのWeb Audio Workletスクリプトで、滑らかなオーディオ処理を実行します。
- **`src/obsidian/src/main.ts`**: Obsidianプラグインのメインファイルで、プラグインのロード・アンロード、UIインタラクション、シンセサイザーの制御を扱います。
- **`src/obsidian/src/mouse-handler.ts`**: Obsidianプラグインにおいて、マウスイベントを捕捉し、シンセサイザーのパラメータにマッピングする処理を担います。
- **`src/obsidian/src/synth/simple.ts`**: Obsidianプラグイン版シンプルシンセの初期化と制御ロジックを提供します。
- **`src/obsidian/src/synth/smooth.ts`**: Obsidianプラグイン版スムースシンセの初期化と制御ロジックを提供します。
- **`src/typescript/browser/index.html`**: ブラウザ版TypeScriptアプリケーションのウェブページ構造を定義するHTMLファイルです。
- **`src/typescript/browser/src/audio/simple-worklet.ts`**: ブラウザ版TypeScriptシンプルシンセのWeb Audio Workletスクリプトです。
- **`src/typescript/browser/src/audio/smooth-worklet.ts`**: ブラウザ版TypeScriptスムースシンセのWeb Audio Workletスクリプトです。
- **`src/typescript/browser/src/main.ts`**: ブラウザ版TypeScriptアプリケーションのメインスクリプトで、DOM操作、イベントハンドリング、シンセサイザー制御を担います。
- **`src/typescript/browser/src/synth/simple.ts`**: ブラウザ版TypeScriptシンプルシンセの初期化と制御ロジックを提供します。
- **`src/typescript/browser/src/synth/smooth.ts`**: ブラウザ版TypeScriptスムースシンセの初期化と制御ロジックを提供します。
- **`src/typescript/cli/src/audio/output.ts`**: TypeScript CLI版で、`naudiodon`ライブラリを使用してオーディオ出力ストリームを管理する機能を提供します。
- **`src/typescript/cli/src/diagnostics/main-diagnostic.ts`**: CLI診断ツールのメインスクリプトで、マウス入力とオーディオ出力の診断機能を提供します。
- **`src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`**: CLI診断ツールの一部で、指定された周波数範囲でオーディオをスイープし、出力をテストします。
- **`src/typescript/cli/src/diagnostics/test-mouse-audio.ts`**: CLI診断ツールの一部で、マウス制御によるオーディオ出力をテストし、応答性を検証します。
- **`src/typescript/cli/src/diagnostics/test-mouse-capture.ts`**: CLI診断ツールの一部で、マウス位置キャプチャ機能の正確性とパフォーマンスをテストします。
- **`src/typescript/cli/src/main.ts`**: TypeScript CLIアプリケーションのメインエントリポイントで、シンセサイザーの初期化、マウスイベント処理、オーディオ出力を行います。
- **`src/typescript/cli/src/mouse/position.ts`**: TypeScript CLI版で、`robotjs`ライブラリを使用してマウスカーソルの現在位置とスクリーンサイズを取得する機能を提供します。
- **`src/typescript/cli/src/synth/simple.ts`**: TypeScript CLI版シンプルシンセの音響合成ロジックです。
- **`src/typescript/cli/src/synth/smooth.ts`**: TypeScript CLI版スムースシンセの音響合成ロジックです。

## 関数詳細説明
- **`onload()` (src/obsidian/src/main.ts)**:
    - 役割: Obsidianプラグインがロードされた際に実行される初期化処理です。シンセサイザーのUI要素設定やイベントリスナー登録を行います。
    - 引数: なし
    - 戻り値: なし
- **`onunload()` (src/obsidian/src/main.ts)**:
    - 役割: Obsidianプラグインがアンロードされる際に実行されるクリーンアップ処理です。オーディオストリームの停止やリソース解放を行います。
    - 引数: なし
    - 戻り値: なし
- **`enableOscillator()` (src/obsidian/src/main.ts)**:
    - 役割: オシレータを有効化し、シンセサイザーの音響生成を開始します。
    - 引数: `version: "simple" | "smooth"` (シンセサイザーのバージョン指定)
    - 戻り値: なし
- **`switchVersion()` (src/obsidian/src/main.ts)**:
    - 役割: シンセサイザーのバージョンをシンプル版とスムース版で切り替えます。
    - 引数: `version: "simple" | "smooth"` (切り替えるシンセサイザーのバージョン)
    - 戻り値: なし
- **`process()` (src/obsidian/src/audio/simple-worklet.ts, src/obsidian/src/audio/smooth-worklet.ts)**:
    - 役割: Web Audio WorkletProcessorのコアメソッド。オーディオデータが生成されるたびに呼び出され、音響合成のロジックを実行します。
    - 引数: `inputs: Float32Array[][]`, `outputs: Float32Array[][]`, `parameters: Record<string, Float32Array>`
    - 戻り値: `boolean` (Workletがアクティブかどうか)
- **`start()` (src/obsidian/src/synth/simple.ts, src/obsidian/src/synth/smooth.ts, src/typescript/browser/src/synth/simple.ts, src/typescript/browser/src/synth/smooth.ts)**:
    - 役割: シンセサイザーのオーディオコンテキストとWeb Audio Workletを初期化し、音響合成を開始します。
    - 引数: `container: HTMLElement` (DOM要素 - ブラウザ版のみ), `audioContext: AudioContext` (Web Audioコンテキスト)
    - 戻り値: なし
- **`handleStart()` (src/typescript/browser/src/main.ts)**:
    - 役割: ブラウザ版アプリケーションで、ユーザーがシンセサイザーの開始をトリガーした際のイベントを処理します。
    - 引数: なし
    - 戻り値: なし
- **`createAudioOutput()` (src/typescript/cli/src/audio/output.ts)**:
    - 役割: Node.js環境でオーディオ出力ストリームを作成し、初期化します。指定されたサンプリングレートとバッファサイズでオーディオデバイスを開きます。
    - 引数: `samplerate: number`, `bufferSize: number`, `deviceIndex?: number`
    - 戻り値: `Promise<AudioOutput>` (オーディオ出力オブジェクト)
- **`mapRange()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts)**:
    - 役割: ある数値範囲の値を別の数値範囲に線形にマッピングします。例えば、マウスのX座標を周波数範囲に変換する際に使用されます。
    - 引数: `value: number`, `in_min: number`, `in_max: number`, `out_min: number`, `out_max: number`
    - 戻り値: `number` (マッピングされた値)
- **`main()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts)**:
    - 役割: CLIアプリケーションまたは診断ツールの主要なエントリポイントです。シンセサイザーのセットアップ、マウスイベントのポーリング、オーディオデータの生成と出力のループを制御します。
    - 引数: なし
    - 戻り値: `Promise<void>`
- **`printDiagnostics()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts)**:
    - 役割: 診断情報をコンソールに出力します。マウス座標、周波数値、CPU使用率などが含まれます。
    - 引数: `diagnostics: DiagnosticInfo`
    - 戻り値: なし
- **`testFrequencySweep()` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)**:
    - 役割: 特定の周波数範囲を掃引するテストを実行し、オーディオ出力が正しく機能しているか、音の品質に問題がないかを検証します。
    - 引数: なし
    - 戻り値: `Promise<void>`
- **`analyzeResults()` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/diagnostics/test-mouse-capture.ts)**:
    - 役割: 各種テストの結果を分析し、合格/不合格の判定や、問題点の概要をレポートとして出力します。
    - 引数: `results: any[]` (テスト結果データ)
    - 戻り値: なし
- **`testMouseAudio()` (src/typescript/cli/src/diagnostics/test-mouse-audio.ts)**:
    - 役割: マウスの動きとオーディオ出力の連動をテストします。マウスを動かした際に音が適切に変化するかを確認します。
    - 引数: なし
    - 戻り値: `Promise<void>`
- **`testMouseCapture()` (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)**:
    - 役割: マウス位置のキャプチャ機能が正確に動作しているか、またポーリング間隔に応じた応答性があるかをテストします。
    - 引数: なし
    - 戻り値: `Promise<void>`
- **`getMousePosition()` (src/typescript/cli/src/mouse/position.ts)**:
    - 役割: 現在のマウスカーソルのX, Y座標を取得します。
    - 引数: なし
    - 戻り値: `Promise<{ x: number; y: number }>`
- **`getScreenSize()` (src/typescript/cli/src/mouse/position.ts)**:
    - 役割: 現在のプライマリディスプレイの幅と高さを取得します。
    - 引数: なし
    - 戻り値: `Promise<{ width: number; height: number }>`
- **`getDevices()` (src/typescript/cli/src/types/naudiodon.d.ts)**:
    - 役割: システムで利用可能なオーディオデバイスのリストを取得します。
    - 引数: なし
    - 戻り値: `AudioDevice[]` (オーディオデバイス情報の配列)

## 関数呼び出し階層ツリー
```
- **Obsidian プラグイン関連**
  - `onload()` (src/obsidian/src/main.ts)
    - `enableOscillator()` (src/obsidian/src/main.ts)
    - `switchVersion()` (src/obsidian/src/main.ts)
      - `start()` (src/obsidian/src/synth/simple.ts, src/obsidian/src/synth/smooth.ts)
  - `onunload()` (src/obsidian/src/main.ts)
  - `process()` (src/obsidian/src/audio/simple-worklet.ts, src/obsidian/src/audio/smooth-worklet.ts) - (Web Audio Workletにより呼び出される)

- **TypeScript CLI アプリケーション関連**
  - `main()` (src/typescript/cli/src/main.ts)
    - `createAudioOutput()` (src/typescript/cli/src/audio/output.ts)
    - `getMousePosition()` (src/typescript/cli/src/mouse/position.ts)
    - `getScreenSize()` (src/typescript/cli/src/mouse/position.ts)
    - `mapRange()` (src/typescript/cli/src/main.ts)

- **TypeScript CLI 診断ツール関連**
  - `main()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
    - `printDiagnostics()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
    - `getMousePosition()` (src/typescript/cli/src/mouse/position.ts)
    - `getScreenSize()` (src/typescript/cli/src/mouse/position.ts)
    - `mapRange()` (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
  - `testFrequencySweep()` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)
    - `createAudioOutput()` (src/typescript/cli/src/audio/output.ts)
    - `analyzeResults()` (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)
  - `testMouseAudio()` (src/typescript/cli/src/diagnostics/test-mouse-audio.ts)
    - `createAudioOutput()` (src/typescript/cli/src/audio/output.ts)
    - `getMousePosition()` (src/typescript/cli/src/mouse/position.ts)
    - `getScreenSize()` (src/typescript/cli/src/mouse/position.ts)
    - `mapRange()` (src/typescript/cli/src/diagnostics/test-mouse-audio.ts)
    - `analyzeResults()` (src/typescript/cli/src/diagnostics/test-mouse-audio.ts)
  - `testMouseCapture()` (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
    - `getMousePosition()` (src/typescript/cli/src/mouse/position.ts)
    - `getScreenSize()` (src/typescript/cli/src/mouse/position.ts)
    - `analyzeResults()` (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)

- **TypeScript Browser アプリケーション関連**
  - `handleStart()` (src/typescript/browser/src/main.ts)
    - `start()` (src/typescript/browser/src/synth/simple.ts, src/typescript/browser/src/synth/smooth.ts)
  - `handleMessage()` (src/typescript/browser/src/audio/simple-worklet.ts, src/typescript/browser/src/audio/smooth-worklet.ts) - (Web Audio Workletにより呼び出される)

- **その他**
  - `getDevices()` (src/typescript/cli/src/types/naudiodon.d.ts)

---
Generated at: 2026-01-29 07:05:49 JST
