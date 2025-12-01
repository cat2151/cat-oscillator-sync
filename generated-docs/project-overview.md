Last updated: 2025-12-02

# Project Overview

## プロジェクト概要
- マウスの位置に応じてリアルタイムに音響パラメータを制御するインタラクティブなシンセサイザーです。
- ハードシンク技術により豊かで表現力のある音色を生成し、X/Y軸でマスター・スレーブ周波数を制御します。
- Python, Rust, Go, TypeScriptなど多言語での実装検証と学習を目的としたクロスプラットフォームプロジェクトです。

## 技術スタック
- フロントエンド:
    -   **TypeScript**: ブラウザ版、CLI版、Obsidianプラグイン版の主要な実装言語として使用されています。
    -   **HTML**: ブラウザ版のユーザーインターフェース構造を定義します (`src/typescript/browser/index.html`)。
    -   **Vite**: TypeScriptブラウザ版の高速なビルドと開発サーバーを提供します。
    -   **Obsidian API**: Obsidianノートアプリのプラグイン開発フレームワークとして、Obsidian版の実装に利用されます。
- 音楽・オーディオ:
    -   **Python**: 音声出力とリアルタイム制御ロジックのプロトタイピングに使用されます。
    -   **Rust**: 高性能な音声合成と低レベルオーディオ処理のために使用されます。
    -   **Go (Oto, PortAudio)**: 低レイテンシでクロスプラットフォームなオーディオ出力ライブラリとして使用されます（OtoはPure Go版、PortAudioはCGO利用版）。
    -   **Node.js (naudiodon)**: TypeScript CLI版でオーディオデバイスへの出力を行います。
    -   **Web Audio API (AudioWorklet)**: TypeScriptのブラウザ版およびObsidianプラグイン版で、高精度なカスタムオーディオ処理を可能にします。
    -   **ハードシンク**: マスターオシレータがスレーブオシレータの位相をリセットし、特徴的な倍音を生成する音響合成技術そのものです。
- 開発ツール:
    -   **Python**: 各言語版のビルド/実行スクリプトやユーティリティの作成に活用されます。
    -   **Rust**: システムプログラミング言語として、高性能なシンセサイザーロジックの実装に使用されます。
    -   **Go**: 並行処理に強く、クロスプラットフォームなアプリケーション開発に使用されます。
    -   **TypeScript**: 型安全なJavaScript開発を可能にし、大規模なプロジェクトでのコード品質を保ちます。
    -   **pipx / pip**: Pythonアプリケーションおよびライブラリのインストールと管理に使用されます。
    -   **Git**: プロジェクトのバージョン管理システムとして利用されます。
    -   **VS Code拡張機能**: Python, Pylance, Ruff, EditorConfigなどが開発環境の効率化をサポートします。
    -   **robotjs**: TypeScript CLI版でマウスカーソルの位置情報を取得するために使用されます。
- テスト:
    -   **pytest**: Pythonコードの単体テストフレームワークとして利用されます (`pytest.ini`)。
    -   **診断/テストスクリプト**: 各言語版に実装された特定のテストスクリプト（例: `test-frequency-sweep.ts`）で、オーディオ出力やマウスキャプチャの正確性を検証します。
- ビルドツール:
    -   **Pythonスクリプト**: `build_and_run.py`や`src/build_utils.py`など、全言語版および個別言語版のビルドと実行を自動化します。
    -   **Cargo**: Rustプロジェクトのビルドシステムとパッケージマネージャーです。
    -   **Go Modules**: Go言語の依存関係管理システムです (`go.mod`, `go.sum`)。
    -   **npm / yarn**: TypeScriptプロジェクトの依存関係管理とスクリプト実行に使用されます (`package.json`, `package-lock.json`)。
    -   **esbuild**: Obsidianプラグイン版のJavaScriptバンドルを高速に処理します。
    -   **tsc**: TypeScriptコードをJavaScriptにコンパイルする公式コンパイラです (`tsconfig.json`)。
- 言語機能:
    -   **指数平滑化**: スムーズ版シンセサイザーで、マウス位置の変化による周波数遷移を滑らかにするためのアルゴリズムとして実装されています。
- 自動化・CI/CD:
    -   **Pythonスクリプト (build_and_run.py)**: マルチ言語ビルドおよび実行プロセスの自動化を可能にします。
- 開発標準:
    -   **ruff**: Pythonコードの品質維持のためのリンターおよびフォーマッターとして使用されます (`ruff.toml`)。
    -   **EditorConfig**: 異なるエディタやIDE間でコーディングスタイル（インデント、改行など）を統一します (`.editorconfig`)。

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
-   `.editorconfig`: 異なるエディタ間でインデントスタイルや文字エンコーディングなどの基本的なコーディングルールを統一するための設定ファイルです。
-   `.gitignore`: Gitのバージョン管理から除外すべきファイルやディレクトリ（例: ビルド成果物、一時ファイル）を指定するファイルです。
-   `.vscode/settings.json`: Visual Studio Codeエディタのワークスペース固有の設定を定義するファイルです。
-   `BUILD_SCRIPTS.md`: プロジェクト全体のビルドおよび実行スクリプトに関する詳細な手順や説明が記述されたドキュメントです。
-   `LICENSE`: プロジェクトがMITライセンスの下で公開されていることを示すライセンス条項ファイルです。
-   `README.md`: プロジェクトの概要、目的、主な特徴、インストール方法、使用方法、技術詳細などが記述されたメインドキュメントです。
-   `_config.yml`: Jekyllなどの静的サイトジェネレータで使用される設定ファイルです（このプロジェクトではGitHub Pagesのサイト構成に関連する可能性があります）。
-   `build_and_run.py`: 全ての言語実装（Python, Rust, Go, TypeScript）を一括でビルドし、メニューから選択して実行するための汎用Pythonスクリプトです。
-   `generated-docs/`: ドキュメンテーションツールによって自動生成されたドキュメントを格納するためのディレクトリです。
-   `googled947dc864c270e07.html`: Google Search Consoleなどのサイト認証に使用される検証ファイルです。
-   `issue-notes/`: 各言語実装の計画、検証、問題解決に関する詳細なメモやドキュメントを格納するディレクトリです。開発の経緯や技術的な選択が記録されています。
-   `pyproject.toml`: Pythonプロジェクトのメタデータ、ビルドシステム、依存関係、ツール設定などを一元的に管理するためのファイルです。
-   `pytest.ini`: Pythonのテストフレームワークであるpytestの設定ファイルです。
-   `requirements.txt`: Pythonプロジェクトが依存する外部ライブラリとそのバージョンをリストアップしたファイルです。
-   `ruff.toml`: Pythonの高速リンターおよびフォーマッターであるRuffの設定ファイルです。コード品質の維持に役立ちます。
-   `src/`: プロジェクトの全てのソースコードが格納されているルートディレクトリです。
    -   `src/build_utils.py`: 各言語版の`build_and_run.py`スクリプトで共通して利用されるユーティリティ関数を提供します。
    -   `src/go/`: Go言語で実装されたシンセサイザーのソースコードディレクトリです。
        -   `src/go/README.md`: Go版実装に関する特定の説明ドキュメントです。
        -   `src/go/build_and_run.py`: Go版のビルドと実行を自動化するためのPythonスクリプトです。
        -   `src/go/cmd/sync_simple_oto/main.go`: Pure GoのOtoライブラリを使用したシンプル版Goシンセサイザーのエントリポイントです。
        -   `src/go/cmd/sync_smooth_oto/main.go`: Pure GoのOtoライブラリを使用したスムーズ版Goシンセサイザーのエントリポイントです。
        -   `src/go/go.mod`, `src/go/go.sum`: Goモジュールの依存関係とそのハッシュ値を管理するファイルです。
        -   `src/go/internal/mouse/position.go`: Go版でのマウス位置取得に関する共通インターフェースを定義します。
        -   `src/go/internal/mouse/position_stub.go`: マウス位置取得のスタブ実装（主にテスト用）です。
        -   `src/go/internal/mouse/position_windows.go`: Windows環境に特化したマウス位置取得の実装です。
        -   `src/go/internal/mouse/mouse_test.go`: Go版マウス関連機能のテストコードです。
        -   `src/go/internal/synth/simple.go`: Go版シンプルシンセサイザーのオーディオ生成ロジックが実装されています。
        -   `src/go/internal/synth/smooth.go`: Go版スムーズシンセサイザーのオーディオ生成ロジックが実装されています。
        -   `src/go/internal/synth/synth_test.go`: Go版シンセサイザーロジックのテストコードです。
        -   `src/go/test_windows_mouse_speed.go`: Windows環境でのマウス速度テストに特化したGoスクリプトです。
    -   `src/go-portaudio/`: C言語コンパイラ（Zig cc）とPortAudioライブラリを使用したGo言語実装のディレクトリです。ファイル構成は`src/go/`に類似しています。
    -   `src/obsidian/`: Obsidianノートアプリのプラグインとして動作するTypeScript実装のディレクトリです。
        -   `src/obsidian/manifest.json`: ObsidianプラグインのID、バージョン、作者などのメタデータを定義します。
        -   `src/obsidian/src/audio/simple-worklet.ts`: Web Audio APIのAudioWorkletを用いたシンプル版シンセサイザーのオーディオ処理モジュールです。
        -   `src/obsidian/src/audio/smooth-worklet.ts`: Web Audio APIのAudioWorkletを用いたスムーズ版シンセサイザーのオーディオ処理モジュールです。
        -   `src/obsidian/src/main.ts`: Obsidianプラグインのメインエントリポイントで、初期化やUI要素の管理を行います。
        -   `src/obsidian/src/mouse-handler.ts`: マウスイベントを処理し、シンセサイザーのパラメータを制御するロジックです。
        -   `src/obsidian/src/synth/simple.ts`: Obsidianプラグイン版シンプルシンセサイザーのロジックをカプセル化します。
        -   `src/obsidian/src/synth/smooth.ts`: Obsidianプラグイン版スムーズシンセサイザーのロジックをカプセル化します。
    -   `src/python/`: Python言語で実装されたシンセサイザーのソースコードディレクトリです。
        -   `src/python/__init__.py`: `python`ディレクトリをPythonパッケージとしてマークします。
        -   `src/python/build_and_run.py`: Python版のビルドと実行を自動化するためのスクリプトです。
        -   `src/python/sync_simple.py`: シンプルな8ms間隔で周波数を更新するPython版シンセサイザーの実装です。
        -   `src/python/sync_smooth.py`: 指数平滑化により滑らかな周波数変化を実現するPython版シンセサイザーの実装です。
    -   `src/rust/`: Rust言語で実装されたシンセサイザーのソースコードディレクトリです。
        -   `src/rust/Cargo.toml`: Rustプロジェクトの依存関係、メタデータ、ビルド設定を定義するファイルです。
        -   `src/rust/build_and_run.py`: Rust版のビルドと実行を自動化するためのPythonスクリプトです。
        -   `src/rust/src/sync_simple.rs`: シンプル版Rustシンセサイザーの実装です。
        -   `src/rust/src/sync_smooth.rs`: スムーズ版Rustシンセサイザーの実装です。
    -   `src/typescript/`: TypeScript言語で実装されたソースコードの親ディレクトリです。
        -   `src/typescript/browser/`: ブラウザ上で動作するTypeScriptシンセサイザーの実装です。
            -   `src/typescript/browser/index.html`: ブラウザ版のWebページ構造を定義するHTMLファイルです。
            -   `src/typescript/browser/src/audio/simple-worklet.ts`: ブラウザ版シンプルシンセサイザーのWeb Audio API AudioWorkletモジュールです。
            -   `src/typescript/browser/src/audio/smooth-worklet.ts`: ブラウザ版スムーズシンセサイザーのWeb Audio API AudioWorkletモジュールです。
            -   `src/typescript/browser/src/main.ts`: ブラウザ版アプリケーションのメインロジック（UIイベント処理、オーディオコンテキスト管理など）です。
            -   `src/typescript/browser/src/synth/simple.ts`: ブラウザ版シンプルシンセサイザーのロジックをカプセル化します。
            -   `src/typescript/browser/src/synth/smooth.ts`: ブラウザ版スムーズシンセサイザーのロジックをカプセル化します。
            -   `src/typescript/browser/vite.config.ts`: Viteビルドツールの設定ファイルです。
        -   `src/typescript/cli/`: Node.js環境で動作するCLI版TypeScriptシンセサイザーの実装です。
            -   `src/typescript/cli/src/audio/output.ts`: CLI版のオーディオ出力インターフェースを定義し、naudiodonライブラリを使用して音声を再生します。
            -   `src/typescript/cli/src/diagnostics/`: CLI版の診断およびテストスクリプトが格納されています。
                -   `src/typescript/cli/src/diagnostics/main-diagnostic.ts`: 各診断テストを実行し、結果を出力するメインスクリプトです。
                -   `src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`: 周波数スイープテストを実行し、オーディオ出力の正確性を検証します。
                -   `src/typescript/cli/src/diagnostics/test-mouse-audio.ts`: マウス操作とオーディオ出力の連携をテストします。
                -   `src/typescript/cli/src/diagnostics/test-mouse-capture.ts`: マウスキャプチャ機能の正確性をテストします。
            -   `src/typescript/cli/src/main.ts`: CLI版アプリケーションのメインエントリポイントで、シンセサイザーの起動とマウスイベントループを制御します。
            -   `src/typescript/cli/src/mouse/position.ts`: `robotjs`ライブラリを使用して、マウスカーソルの位置および画面サイズを取得する機能を提供します。
            -   `src/typescript/cli/src/synth/simple.ts`: CLI版シンプルシンセサイザーのオーディオ生成ロジックが実装されています。
            -   `src/typescript/cli/src/synth/smooth.ts`: CLI版スムーズシンセサイザーのオーディオ生成ロジックが実装されています。
            -   `src/typescript/cli/src/types/naudiodon.d.ts`: `naudiodon`ライブラリのTypeScript型定義ファイルです。

## 関数詳細説明
-   `constructor`: オブジェクトのインスタンスが作成される際に実行される初期化関数です。
    -   例: `src/obsidian/src/audio/simple-worklet.ts` では、AudioWorkletProcessorの初期設定を行います。
-   `process(inputs, outputs, parameters)`: (AudioWorkletProcessorのメソッド) オーディオ処理ループ内で、入力オーディオバッファを処理し、出力オーディオバッファを生成します。
    -   例: `src/obsidian/src/audio/simple-worklet.ts` では、シンプル版の波形データを生成して出力します。
-   `onload()`: (Obsidianプラグインのメソッド) Obsidianプラグインがロードされる際に一度だけ実行される初期化処理です。UI要素の作成やイベントリスナーの登録などを行います。
    -   ファイル: `src/obsidian/src/main.ts`
-   `onunload()`: (Obsidianプラグインのメソッド) Obsidianプラグインがアンロードされる際に実行されるクリーンアップ処理です。リソースの解放やイベントリスナーの解除を行います。
    -   ファイル: `src/obsidian/src/main.ts`
-   `enableOscillator()`: オシレータのサウンド生成を有効または無効にする機能を切り替えます。
    -   ファイル: `src/obsidian/src/main.ts`
-   `switchVersion()`: シンセサイザーのバージョン（シンプル版またはスムーズ版）を切り替えるロジックを管理します。
    -   ファイル: `src/obsidian/src/main.ts`
-   `start()`: シンセサイザーのオーディオ生成プロセスを開始します。これにはオーディオコンテキストの初期化やWorkletの起動が含まれる場合があります。
    -   例: `src/obsidian/src/synth/simple.ts` では、シンプル版シンセサイザーのオーディオストリームを開始します。
-   `handleMessage(event)`: (AudioWorkletProcessorのメソッド) メインスレッドからAudioWorkletに送信されたメッセージを処理します。
    -   例: `src/typescript/browser/src/audio/simple-worklet.ts` では、周波数などのシンセサイザーパラメータの更新を受け取ります。
-   `handleStart()`: ブラウザ版アプリケーションで、ユーザーが開始ボタンをクリックした際に実行される処理です。オーディオコンテキストの開始やマウスイベントの登録を行います。
    -   ファイル: `src/typescript/browser/src/main.ts`
-   `createAudioOutput(options)`: オーディオ出力ストリームを初期化し、オーディオデータを再生するためのインターフェースを提供します。
    -   ファイル: `src/typescript/cli/src/audio/output.ts`
-   `mapRange(value, inMin, inMax, outMin, outMax)`: ある数値範囲の値を、別の数値範囲に線形にマッピング（変換）するユーティリティ関数です。
    -   例: `src/typescript/cli/src/diagnostics/main-diagnostic.ts` では、マウスのX/Y座標をシンセサイザーの周波数範囲に変換します。
-   `main()`: アプリケーションまたは診断スクリプトの主要なエントリポイント関数です。全体の実行フローを制御します。
    -   例: `src/typescript/cli/src/diagnostics/main-diagnostic.ts` では、診断ツールの主要な実行ロジックを含みます。
-   `printDiagnostics(results)`: 診断テストの結果を整形してコンソールに出力します。
    -   ファイル: `src/typescript/cli/src/diagnostics/main-diagnostic.ts`
-   `getMousePosition()`: 現在のマウスカーソルのX軸およびY軸座標を取得します。
    -   ファイル: `src/typescript/cli/src/mouse/position.ts`
-   `getScreenSize()`: ディスプレイ（画面）の幅と高さをピクセル単位で取得します。
    -   ファイル: `src/typescript/cli/src/mouse/position.ts`
-   `testFrequencySweep(output, minFreq, maxFreq, durationMs)`: 特定の周波数範囲で音をスイープ（連続的に変化）させ、オーディオ出力の特性をテストします。
    -   ファイル: `src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`
-   `analyzeResults(results)`: テストや診断で得られた生データを分析し、意味のある情報や結論を導き出します。
    -   例: `src/typescript/cli/src/diagnostics/test-frequency-sweep.ts` では、周波数スイープの結果を分析します。
-   `testMouseAudio(output, synth)`: マウス操作とオーディオ出力の連携が正しく機能するかをテストします。
    -   ファイル: `src/typescript/cli/src/diagnostics/test-mouse-audio.ts`
-   `testMouseCapture()`: マウスカーソルの位置を正確にキャプチャ（取得）できるかをテストします。
    -   ファイル: `src/typescript/cli/src/diagnostics/test-mouse-capture.ts`
-   `getDevices()`: (naudiodonライブラリのメソッド) システム上で利用可能なオーディオデバイスのリストを取得します。
    -   ファイル: `src/typescript/cli/src/types/naudiodon.d.ts`

## 関数呼び出し階層ツリー
```
- onload (src/obsidian/src/main.ts)
  - onunload ()
    - enableOscillator ()
    - switchVersion ()
    - start ()
- createAudioOutput (src/typescript/cli/src/audio/output.ts)
  - constructor (undefined)
- mapRange (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
  - main ()
  - printDiagnostics ()
  - getMousePosition ()
  - getScreenSize ()
- analyzeResults ()
  - testMouseCapture (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
- testFrequencySweep (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)
- getDevices (src/typescript/cli/src/types/naudiodon.d.ts)

---
Generated at: 2025-12-02 07:03:48 JST
