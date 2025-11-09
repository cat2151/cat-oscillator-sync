Last updated: 2025-11-10

# Project Overview

## プロジェクト概要
- マウス操作でリアルタイムに音を生成する、ハードシンク・シンセサイザーの実験的なプロジェクトです。
- マウスのX軸でマスター周波数、Y軸でスレーブ周波数を制御し、独特の音色を奏でます。
- Python, Rust, Go, TypeScriptなど、複数の言語での実装を通じてマルチプラットフォーム対応を試みています。

## 技術スタック
- フロントエンド:
    - **TypeScript (ブラウザ/Obsidian版)**: Web Audio APIやAudioWorkletを用いて、ブラウザやObsidianプラグイン上で動作するシンセサイザーを実装しています。
    - **HTML**: ブラウザ版のユーザーインターフェース構造を定義するために使用されます。
- 音楽・オーディオ:
    - **ハードシンク（オシレータ同期）**: マスターオシレータがスレーブオシレータの位相をリセットすることで、豊かな倍音を持つ独特の音色を生成する音響合成技術です。
    - **指数平滑化**: 音響パラメータ（特に周波数）の急激な変化を滑らかにし、より自然な音色遷移を実現する信号処理アルゴリズムです。
    - **PortAudio (Go版)**: Go言語による実装において、クロスプラットフォームなオーディオ入出力を提供するライブラリです。
    - **Oto (Go版)**: Pure Goで書かれたクロスプラットフォーム対応のオーディオ出力ライブラリで、C言語コンパイラなしでビルド可能です。
    - **naudiodon (TypeScript CLI版)**: Node.js環境でオーディオ入出力を扱うためのライブラリです。
    - **Web Audio API (TypeScript ブラウザ/Obsidian版)**: ウェブブラウザ上で高度な音声処理を行うためのAPIです。
    - **AudioWorklet (TypeScript ブラウザ/Obsidian版)**: Web Audio APIの一部で、メインスレッドから独立してオーディオ処理を行うためのカスタムオーディオプロセッサです。
- 開発ツール:
    - **pipx**: Pythonアプリケーションを分離された環境で簡単にインストール・実行するためのツールです。
    - **pip**: Pythonパッケージのインストールと管理を行うための標準ツールです。
    - **Git**: プロジェクトのソースコードのバージョン管理に使用されます。
    - **Visual Studio Code 拡張機能**: Python開発を効率化するための「Python」「Pylance」「Ruff」「EditorConfig for VS Code」が推奨されています。
    - **esbuild (Obsidian版)**: 高速なJavaScript/TypeScriptバンドラーで、Obsidianプラグインのビルドに使用されます。
    - **Vite (TypeScript ブラウザ版)**: 高速な開発サーバーとバンドル機能を提供するフロントエンドビルドツールです。
    - **robotjs (TypeScript CLI版)**: Node.jsでシステムのマウス操作をプログラムから行うためのライブラリです。
- テスト:
    - **pytest**: Python言語でテストを記述・実行するための強力なフレームワークです。
- ビルドツール:
    - **Pythonスクリプト (`build_and_run.py`)**: 各言語版のビルドと実行プロセスを自動化するためのカスタムスクリプトです。
    - **Cargo (Rust)**: Rust言語の公式ビルドシステムおよびパッケージマネージャーです。
    - **Go Modules (Go)**: Go言語の依存関係管理システムです。
    - **npm/yarn (TypeScript)**: Node.jsプロジェクトにおけるパッケージのインストール、依存関係管理、スクリプト実行などに使用されるパッケージマネージャーです。
    - **TypeScript Compiler (tsc)**: TypeScriptコードをJavaScriptにコンパイルするためのツールです。
    - **Zig cc (Go-PortAudio版)**: C言語コンパイラとして、特にPortAudioライブラリのビルドに使用されます。
- 言語機能:
    - **Python 3.8+**: 主要な実装言語の一つであり、スクリプトの実行環境としても使用されます。
    - **Rust**: 高性能とメモリ安全性を特徴とするシステムプログラミング言語での実装です。
    - **Go**: シンプルな構文と効率的な並行処理が特徴の言語での実装です。
    - **TypeScript**: JavaScriptに静的型付けを追加した言語で、大規模なアプリケーション開発に適しています。
- 開発標準:
    - **ruff**: Pythonコードのリンティングとフォーマットを高速に行うツールで、コード品質と一貫性を維持するために使用されます。
    - **EditorConfig**: 異なるエディタやIDE間でコードのスタイル（インデント、エンコーディングなど）を統一するための設定ファイルです。

## ファイル階層ツリー
```
cat-oscillator-sync/
├── LICENSE
├── README.md
├── pytest.ini
├── ruff.toml
└── src/
    ├── python/
    │   ├── sync_simple.py
    │   └── sync_smooth.py
    ├── go/
    ├── rust/
    └── typescript/
        ├── browser/
        └── cli/
```

## ファイル詳細説明
- **`.editorconfig`**: 異なるエディタやIDEを使用する開発者間で、コードの書式（インデントスタイル、文字コードなど）を統一するための設定ファイルです。
- **`.gitignore`**: バージョン管理システムGitが追跡すべきではないファイルやディレクトリ（例: ビルド生成物、依存関係パッケージ、設定ファイルなど）を指定します。
- **`.vscode/settings.json`**: Visual Studio Codeエディタのワークスペース固有の設定を定義するファイルで、推奨拡張機能の設定などが含まれます。
- **`BUILD_SCRIPTS.md`**: プロジェクト内の各言語版のビルド方法、実行方法、および関連するスクリプトの詳細を説明するドキュメントです。
- **`LICENSE`**: プロジェクトの利用条件を定めるライセンスファイルで、本プロジェクトはMITライセンスで公開されています。
- **`README.md`**: プロジェクト全体の概要、目的、特徴、デモ、インストール方法、使用方法、技術詳細などを記載したメインドキュメントです。
- **`_config.yml`**: 通常はJekyllなどの静的サイトジェネレーターの設定ファイルですが、本プロジェクトではリポジトリの表示設定などに利用されている可能性があります。
- **`build_and_run.py`**: 全ての言語版（Python, Rust, Go, TypeScript）を一度にビルドし、メニュー形式で実行を選択できるWindows専用の統合スクリプトです。
- **`generated-docs/`**: ドキュメント自動生成ツールによって生成されたドキュメントやレポートを格納するためのディレクトリです。
- **`issue-notes/`**: 各言語の実装計画、課題、調査結果、クイックスタートガイド、READMEの草稿など、開発過程で作成された様々なメモやドキュメントを整理して格納するディレクトリです。
- **`pyproject.toml`**: Pythonプロジェクトのメタデータ、ビルドシステム、依存関係、ツール設定などを一元的に管理するためのファイル（PEP 518/621準拠）です。
- **`pytest.ini`**: Pythonのテストフレームワーク`pytest`の動作設定を記述するファイルです。
- **`requirements.txt`**: Pythonプロジェクトが実行時に必要とする外部ライブラリとそのバージョンを一覧化したファイルです。
- **`ruff.toml`**: Pythonのリンターおよびフォーマッターである`ruff`のルール設定を定義するファイルで、コードの品質と一貫性を自動的に維持します。
- **`src/`**: プロジェクトの主要なソースコードが言語別にまとめられているルートディレクトリです。
- **`src/build_utils.py`**: `build_and_run.py`スクリプトや各言語版のビルドスクリプトで共通して利用されるユーティリティ関数やヘルパーロジックを提供します。
- **`src/go/`**: Go言語で実装されたシンセサイザーのソースコードと関連ファイル群を格納するディレクトリです。
    - **`src/go/.gitignore`**: Go言語のビルド生成物や一時ファイルなどをGitが無視するための設定です。
    - **`src/go/README.md`**: Go版シンセサイザーの実装に関する詳細情報、特徴、使い方などを説明するファイルです。
    - **`src/go/build_and_run.py`**: Go版シンセサイザーのビルド、実行、クリーンアッププロセスを自動化するPythonスクリプトです。
    - **`src/go/cmd/sync_simple_oto/main.go`**: Pure Go (Oto) 版のシンプルシンセサイザーアプリケーションのエントリポイントです。
    - **`src/go/cmd/sync_smooth_oto/main.go`**: Pure Go (Oto) 版のスムーズシンセサイザーアプリケーションのエントリポイントです。
    - **`src/go/go.mod`**: Goモジュールシステムによってプロジェクトの依存関係を定義するファイルです。
    - **`src/go/go.sum`**: `go.mod`にリストされた依存関係の整合性を保証するためのチェックサムファイルです。
    - **`src/go/internal/mouse/position.go`**: Go言語でマウスカーソルの現在位置を取得する機能を提供するモジュールです。
    - **`src/go/internal/mouse/position_stub.go`**: `position.go`のダミー実装で、特定のプラットフォームでのビルド互換性を提供します。
    - **`src/go/internal/mouse/position_windows.go`**: Windowsオペレーティングシステムに特化したマウスカーソル位置取得の実装です。
    - **`src/go/internal/mouse/mouse_test.go`**: Go版のマウス位置取得モジュールの単体テストコードです。
    - **`src/go/internal/synth/simple.go`**: Go言語で実装されたシンプル版シンセサイザーのコアロジックを定義するファイルです。
    - **`src/go/internal/synth/smooth.go`**: Go言語で実装されたスムーズ版シンセサイザー（指数平滑化適用）のコアロジックを定義するファイルです。
    - **`src/go/internal/synth/synth_test.go`**: Go版のシンセサイザーロジックの単体テストコードです。
    - **`src/go/test_windows_mouse_speed.go`**: Windows環境でのマウスポーリング速度や応答性をテストするためのGoプログラムです。
- **`src/go-portaudio/`**: PortAudioライブラリを利用してGo言語で実装されたシンセサイザーのソースコード群を格納するディレクトリです。内部構造は`src/go/`と似ていますが、オーディオバックエンドが異なります。
    - **`src/go-portaudio/QUICKSTART.md`**: PortAudio版Go実装の迅速なセットアップと実行方法を説明するガイドです。
    - **`src/go-portaudio/README.md`**: PortAudio版Go実装に関する詳細情報、特徴、Zig ccを使ったビルド方法などを説明するファイルです。
    - `src/go-portaudio/cmd/sync_simple/main.go`: PortAudio版のシンプルシンセサイザーのエントリポイント。
    - `src/go-portaudio/cmd/sync_smooth/main.go`: PortAudio版のスムーズシンセサイザーのエントリポイント。
    - 他のファイルも`src/go/`と同様の役割ですが、PortAudioライブラリに依存した実装を含みます。
- **`src/obsidian/`**: Obsidianノートアプリケーションのプラグインとして実装されたシンセサイザーのソースコード群です。
    - **`src/obsidian/manifest.json`**: Obsidianプラグインのメタデータ（プラグイン名、バージョン、開発者など）を定義するファイルです。
    - **`src/obsidian/package.json`**: Node.jsプロジェクトのメタデータ、依存関係、スクリプトコマンドを定義するファイルです。
    - **`src/obsidian/tsconfig.json`**: TypeScriptコンパイラの設定（ターゲットJSバージョン、モジュール解決方法など）を定義するファイルです。
    - **`src/obsidian/src/audio/simple-worklet.ts`**: ObsidianプラグインのWeb Audio API `AudioWorklet` を使用したシンプル版シンセサイザーのオーディオ処理ロジックです。
    - **`src/obsidian/src/audio/smooth-worklet.ts`**: ObsidianプラグインのWeb Audio API `AudioWorklet` を使用したスムーズ版シンセサイザーのオーディオ処理ロジックです。
    - **`src/obsidian/src/main.ts`**: Obsidianプラグインのエントリポイントで、プラグインのライフサイクル管理（ロード/アンロード）、UI要素の作成、イベントハンドリングを行います。
    - **`src/obsidian/src/mouse-handler.ts`**: Obsidianプラグイン内でマウスイベントを検出し、その位置情報をシンセサイザーのパラメータにマッピングして音を制御するロジックを扱います。
    - **`src/obsidian/src/synth/simple.ts`**: Obsidianプラグインにおけるシンプル版シンセサイザーの制御ロジックを定義します。
    - **`src/obsidian/src/synth/smooth.ts`**: Obsidianプラグインにおけるスムーズ版シンセサイザーの制御ロジックを定義します。
- **`src/python/`**: Python言語で実装されたシンセサイザーのソースコードと関連ファイル群です。
    - **`src/python/__init__.py`**: Pythonのパッケージであることを示すファイルです。
    - **`src/python/build_and_run.py`**: Python版シンセサイザーのビルドと実行を制御するPythonスクリプトです。
    - **`src/python/sync_simple.py`**: Pythonで実装されたシンプル版のハードシンクシンセサイザーのコードです。
    - **`src/python/sync_smooth.py`**: Pythonで実装されたスムーズ版（指数平滑化適用）のハードシンクシンセサイザーのコードです。
- **`src/rust/`**: Rust言語で実装されたシンセサイザーのソースコードと関連ファイル群です。
    - **`src/rust/.gitignore`**: Rustのビルド生成物やパッケージキャッシュなどをGitが無視するための設定です。
    - **`src/rust/Cargo.toml`**: Rustプロジェクトのメタデータ（名前、バージョンなど）と依存関係を定義するファイルです。
    - **`src/rust/build_and_run.py`**: Rust版シンセサイザーのビルドと実行を制御するPythonスクリプトです。
    - **`src/rust/src/sync_simple.rs`**: Rustで実装されたシンプル版のハードシンクシンセサイザーのコードです。
    - **`src/rust/src/sync_smooth.rs`**: Rustで実装されたスムーズ版（指数平滑化適用）のハードシンクシンセサイザーのコードです。
- **`src/typescript/`**: TypeScript言語で実装されたシンセサイザーのソースコード群が、ブラウザ版とCLI版に分かれて格納されています。
    - **`src/typescript/browser/`**: ブラウザ上で動作するTypeScript版シンセサイザーのソースコード群です。
        - **`src/typescript/browser/.gitignore`**: ブラウザ版固有のGit無視設定です。
        - **`src/typescript/browser/build_and_run.py`**: ブラウザ版のビルドと実行を制御するPythonスクリプトです。
        - **`src/typescript/browser/index.html`**: ブラウザ版アプリケーションのメインとなるHTMLファイルで、UIの基本構造とスクリプトのロードを定義します。
        - **`src/typescript/browser/package-lock.json`**: `npm install`によって生成される、プロジェクトの依存関係ツリーの正確なバージョンを記録するファイルです。
        - **`src/typescript/browser/package.json`**: ブラウザ版の依存関係、スクリプトコマンド、メタデータを定義するファイルです。
        - **`src/typescript/browser/src/audio/simple-worklet.ts`**: ブラウザ版シンプルシンセサイザーのWeb Audio API `AudioWorklet`実装です。
        - **`src/typescript/browser/src/audio/smooth-worklet.ts`**: ブラウザ版スムーズシンセサイザーのWeb Audio API `AudioWorklet`実装です。
        - **`src/typescript/browser/src/main.ts`**: ブラウザ版アプリケーションのエントリポイントで、DOM要素の操作、オーディオコンテキストの初期化、イベントリスナーの設定などを行います。
        - **`src/typescript/browser/src/synth/simple.ts`**: ブラウザ版シンプルシンセサイザーの制御ロジックを定義します。
        - **`src/typescript/browser/src/synth/smooth.ts`**: ブラウザ版スムーズシンセサイザーの制御ロジックを定義します。
        - **`src/typescript/browser/tsconfig.json`**: ブラウザ版TypeScriptコンパイラの設定ファイルです。
        - **`src/typescript/browser/vite.config.ts`**: Viteビルドツールの設定ファイルで、開発サーバーの挙動やビルドオプションなどを定義します。
    - **`src/typescript/cli/`**: Node.js環境で動作するCLI (コマンドラインインターフェース) 版TypeScriptシンセサイザーのソースコード群です。
        - **`src/typescript/cli/.gitignore`**: CLI版固有のGit無視設定です。
        - **`src/typescript/cli/BUFFER_SIZE_FIX.md`**: CLI版におけるオーディオバッファサイズの問題とその解決策に関するドキュメントです。
        - **`src/typescript/cli/DELIVERY_SUMMARY.md`**: CLI版のリリースに関するサマリードキュメントです。
        - **`src/typescript/cli/DIAGNOSTIC_GUIDE.md`**: CLI版の診断ガイドです。
        - **`src/typescript/cli/FREQUENCY_UPDATE_FIX.md`**: CLI版の周波数更新に関する問題とその解決策に関するドキュメントです。
        - **`src/typescript/cli/INVESTIGATION_REPORT.md`**: CLI版に関する調査レポートです。
        - **`src/typescript/cli/NAUDIODON_MIGRATION.md`**: CLI版が`naudiodon`ライブラリに移行した際の記録です。
        - **`src/typescript/cli/NAUDIODON_MIGRATION_COMPLETION.md`**: `naudiodon`移行完了の記録です。
        - **`src/typescript/cli/NAUDIODON_MIGRATION_SUMMARY.md`**: `naudiodon`移行のサマリーです。
        - **`src/typescript/cli/README.md`**: CLI版TypeScript実装に関する詳細情報、特徴、使い方などを説明するファイルです。
        - **`src/typescript/cli/USER_GUIDE.md`**: CLI版のユーザーガイドです。
        - **`src/typescript/cli/build_and_run.py`**: CLI版のビルドと実行を制御するPythonスクリプトです。
        - **`src/typescript/cli/package-lock.json`**: CLI版の依存関係の正確なバージョンを記録するファイルです。
        - **`src/typescript/cli/package.json`**: CLI版の依存関係、スクリプトコマンド、メタデータを定義するファイルです。
        - **`src/typescript/cli/src/audio/output.ts`**: `naudiodon`ライブラリを利用してオーディオ出力ストリームを管理する抽象化レイヤーを提供します。
        - **`src/typescript/cli/src/diagnostics/`**: CLI版の診断ツール群が格納されているディレクトリです。
            - **`src/typescript/cli/src/diagnostics/README.md`**: 診断ツールに関する説明です。
            - **`src/typescript/cli/src/diagnostics/main-diagnostic.ts`**: 各種診断テストを実行し、結果をまとめるメインの診断ツールです。
            - **`src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`**: シンセサイザーの周波数応答をテストするためのツールです。
            - **`src/typescript/cli/src/diagnostics/test-mouse-audio.ts`**: マウス入力とオーディオ出力の連携をテストし、レイテンシや正確性を評価するツールです。
            - **`src/typescript/cli/src/diagnostics/test-mouse-capture.ts`**: マウスカーソル位置の取得機能が正しく動作するかをテストするツールです。
        - **`src/typescript/cli/src/main.ts`**: CLIアプリケーションのメインエントリポイントで、オーディオストリームの開始、マウスイベントの監視、シンセサイザーの制御を行います。
        - **`src/typescript/cli/src/mouse/position.ts`**: `robotjs`ライブラリを使用して、システムのマウスカーソル位置とスクリーンサイズを取得する機能を提供します。
        - **`src/typescript/cli/src/synth/simple.ts`**: CLI版シンプルシンセサイザーのコアロジックを定義します。
        - **`src/typescript/cli/src/synth/smooth.ts`**: CLI版スムーズシンセサイザー（指数平滑化適用）のコアロジックを定義します。
        - **`src/typescript/cli/src/types/naudiodon.d.ts`**: `naudiodon`ライブラリの型定義ファイルで、TypeScriptの型チェックを可能にします。
        - **`src/typescript/cli/tsconfig.json`**: CLI版TypeScriptコンパイラの設定ファイルです。

## 関数詳細説明
- **`constructor()`**: クラスの新しいインスタンスを初期化するための特殊なメソッドです。各クラスの初期設定やプロパティの割り当てを担当します。
    - `src/obsidian/src/audio/simple-worklet.ts`: `AudioWorkletProcessor` の初期設定を行います。
    - `src/obsidian/src/audio/smooth-worklet.ts`: `AudioWorkletProcessor` の初期設定を行います。
    - `src/obsidian/src/mouse-handler.ts`: マウスイベントハンドラの初期化とイベントリスナーの設定を行います。
    - `src/typescript/browser/src/audio/simple-worklet.ts`: `AudioWorkletProcessor` の初期設定を行います。
    - `src/typescript/browser/src/audio/smooth-worklet.ts`: `AudioWorkletProcessor` の初期設定を行います。
    - `src/typescript/browser/src/main.ts`: メインアプリケーションクラスの初期設定を行います。
    - `src/typescript/cli/src/audio/output.ts`: オーディオ出力クラスの初期設定を行います。
    - `src/typescript/cli/src/diagnostics/test-frequency-sweep.ts`: テストロジックの初期設定を行います。
    - `src/typescript/cli/src/diagnostics/test-mouse-audio.ts`: テストロジックの初期設定を行います。
    - `src/typescript/cli/src/synth/simple.ts`: シンプル版シンセサイザーの内部状態を初期化します。
    - `src/typescript/cli/src/synth/smooth.ts`: スムーズ版シンセサイザーの内部状態を初期化します。
- **`process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean`** (src/obsidian/src/audio/simple-worklet.ts, src/obsidian/src/audio/smooth-worklet.ts):
    - 役割: Web Audio APIの`AudioWorkletProcessor`のメイン処理ループで、オーディオフレームごとに呼び出され、音響合成を実行します。
    - 引数:
        - `inputs`: 入力オーディオデータの配列。
        - `outputs`: 生成されたオーディオデータを出力するための配列。
        - `parameters`: カスタムオーディオパラメータのマップ。
    - 戻り値: `boolean` (常に`true`で継続処理を示す)。
    - 機能: マウス位置に基づく周波数でオシレータを生成し、ハードシンク処理を適用して出力を`outputs`に書き込みます。`smooth-worklet.ts`では指数平滑化が適用されます。
- **`onload()`** (src/obsidian/src/main.ts):
    - 役割: Obsidianプラグインが有効化される際に呼び出されるライフサイクルフックです。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: プラグインのUI要素の初期化、オーディオコンテキストのセットアップ、イベントリスナーの登録、シンセサイザーの起動準備などを行います。
- **`onunload()`** (src/obsidian/src/main.ts):
    - 役割: Obsidianプラグインが無効化される際に呼び出されるライフサイクルフックです。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: プラグインが使用していたリソース（オーディオストリーム、イベントリスナーなど）を解放し、クリーンアップ処理を行います。
- **`catch(error: Error)`** (src/obsidian/src/main.ts, src/obsidian/src/synth/simple.ts, src/obsidian/src/synth/smooth.ts, src/typescript/browser/src/main.ts, src/typescript/browser/src/synth/simple.ts, src/typescript/browser/src/synth/smooth.ts, src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/diagnostics/test-mouse-capture.ts, src/typescript/cli/src/main.ts):
    - 役割: エラーハンドリングのためのブロック。非同期操作や実行時に発生した例外を捕捉し、適切なエラー処理を行います。
    - 引数: `error: Error` (捕捉されたエラーオブジェクト)。
    - 戻り値: なし。
    - 機能: エラーメッセージのログ出力、ユーザーへの通知、アプリケーションの状態のリセットなど、エラーからの回復や診断を支援します。
- **`enableOscillator()`** (src/obsidian/src/main.ts):
    - 役割: オシレータ（シンセサイザー）のインスタンスを生成し、オーディオ再生を開始する準備をします。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: `AudioContext`の作成、`AudioWorklet`モジュールのロード、シンセサイザーオブジェクトの初期化などを行います。
- **`switchVersion()`** (src/obsidian/src/main.ts):
    - 役割: シンセサイザーの「シンプル版」と「スムーズ版」の間で機能を切り替えます。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: 現在アクティブなシンセサイザーインスタンスを停止し、選択されたバージョンのシンセサイザーインスタンスを新しく生成・起動します。
- **`start()`** (src/obsidian/src/synth/simple.ts, src/obsidian/src/synth/smooth.ts, src/typescript/browser/src/synth/simple.ts, src/typescript/browser/src/synth/smooth.ts):
    - 役割: シンセサイザーのオーディオ処理と再生を開始します。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: `AudioContext`を開始し、Web Audio APIノードグラフを設定して、音響合成を開始します。
- **`handleMessage(event: MessageEvent)`** (src/typescript/browser/src/audio/simple-worklet.ts, src/typescript/browser/src/audio/smooth-worklet.ts):
    - 役割: `AudioWorklet`がメインスレッドからメッセージを受信した際に呼び出されるハンドラです。
    - 引数: `event: MessageEvent` (受信したメッセージイベントオブジェクト)。
    - 戻り値: なし。
    - 機能: 受信したメッセージの内容に応じて、シンセサイザーのパラメータ（周波数など）を更新します。
- **`handleStart()`** (src/typescript/browser/src/main.ts):
    - 役割: ブラウザ版アプリケーションのオーディオ再生開始処理を司ります。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: `AudioContext`の初期化、`AudioWorklet`モジュールの追加、シンセサイザーインスタンスの生成と起動を行います。
- **`createAudioOutput(samplerate: number, bufferSize: number): AudioOutput`** (src/typescript/cli/src/audio/output.ts):
    - 役割: `naudiodon`ライブラリを使用して、指定されたサンプリングレートとバッファサイズでオーディオ出力ストリームを初期化し、管理するオブジェクトを生成します。
    - 引数:
        - `samplerate: number`: オーディオのサンプリングレート（例: 48000 Hz）。
        - `bufferSize: number`: オーディオバッファのサイズ。
    - 戻り値: `AudioOutput` (オーディオ出力ストリームを制御するためのオブジェクト)。
    - 機能: システムのオーディオデバイスを列挙し、デフォルトの出力デバイスを選択してオーディオストリームをオープンします。
- **`mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number`** (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/main.ts):
    - 役割: ある数値範囲の値を別の数値範囲に線形的にマッピングするユーティリティ関数です。
    - 引数:
        - `value: number`: マッピングしたい入力値。
        - `inMin: number`: 入力範囲の最小値。
        - `inMax: number`: 入力範囲の最大値。
        - `outMin: number`: 出力範囲の最小値。
        - `outMax: number`: 出力範囲の最大値。
    - 戻り値: `number` (マッピングされた出力値)。
    - 機能: マウス座標（例: 0〜画面幅）を周波数範囲（例: 40Hz〜600Hz）に変換する際に使用されます。
- **`main()`** (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts):
    - 役割: CLIアプリケーションまたは診断ツールの主要なエントリポイントとなる関数です。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: アプリケーションの初期設定、主要ロジックの実行、リソースの管理など、プログラムの全体的なフローを調整します。
- **`printDiagnostics()`** (src/typescript/cli/src/diagnostics/main-diagnostic.ts):
    - 役割: 実行された診断テストの結果をコンソールに出力します。
    - 引数: なし。
    - 戻り値: なし。
    - 機能: 各テスト項目とその結果（成功/失敗、測定値など）を分かりやすく表示し、デバッグや問題特定を支援します。
- **`testFrequencySweep(output: AudioOutput, samplerate: number): Promise<SweepResult>`** (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts):
    - 役割: シンセサイザーが様々な周波数を正確に生成できるかをテストするための周波数スイープ（掃引）を実行します。
    - 引数:
        - `output: AudioOutput`: オーディオ出力ストリームオブジェクト。
        - `samplerate: number`: サンプリングレート。
    - 戻り値: `Promise<SweepResult>` (スイープテストの結果を含むPromise)。
    - 機能: 定義された周波数範囲を段階的に変化させながら音を生成し、その応答を記録します。
- **`analyzeResults(results: SweepResult | MouseAudioResult | MouseCaptureResult): AnalysisReport`** (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/diagnostics/test-mouse-capture.ts):
    - 役割: 各種診断テスト（周波数スイープ、マウスオーディオ、マウスキャプチャ）の結果データを分析し、レポートを生成します。
    - 引数: `results: ...Result` (テスト結果データオブジェクト)。
    - 戻り値: `AnalysisReport` (分析結果の要約レポート)。
    - 機能: 記録されたデータを統計的に処理し、パフォーマンス指標、エラー率、検出された問題点などを抽出して報告します。
- **`testMouseAudio(output: AudioOutput, samplerate: number): Promise<MouseAudioResult>`** (src/typescript/cli/src/diagnostics/test-mouse-audio.ts):
    - 役割: マウス入力がリアルタイムにオーディオ出力に反映されるかをテストし、マウス制御シンセサイザーの応答性を評価します。
    - 引数:
        - `output: AudioOutput`: オーディオ出力ストリームオブジェクト。
        - `samplerate: number`: サンプリングレート。
    - 戻り値: `Promise<MouseAudioResult>` (マウスオーディオテストの結果を含むPromise)。
    - 機能: マウスを動かしながら音を生成させ、マウス位置の取得とオーディオ出力の間のレイテンシや同期を測定します。
- **`testMouseCapture(): Promise<MouseCaptureResult>`** (src/typescript/cli/src/diagnostics/test-mouse-capture.ts):
    - 役割: マウスカーソル位置の取得機能が正確かつ安定して動作するかをテストします。
    - 引数: なし。
    - 戻り値: `Promise<MouseCaptureResult>` (マウスキャプチャテストの結果を含むPromise)。
    - 機能: 一定時間、連続してマウス位置を取得し、そのデータの正確性、ポーリング間隔、エラーの有無などを検証します。
- **`getMousePosition(): { x: number; y: number }`** (src/typescript/cli/src/mouse/position.ts):
    - 役割: 現在のマウスカーソルのスクリーン座標（X, Y）を取得します。
    - 引数: なし。
    - 戻り値: `{ x: number; y: number }` (マウスのX, Y座標を含むオブジェクト)。
    - 機能: `robotjs`ライブラリを利用してOSレベルのマウス位置情報を取得し、それをアプリケーションに提供します。
- **`getScreenSize(): { width: number; height: number }`** (src/typescript/cli/src/mouse/position.ts):
    - 役割: 現在のプライマリディスプレイの画面解像度（幅と高さ）を取得します。
    - 引数: なし。
    - 戻り値: `{ width: number; height: number }` (スクリーンの幅と高さを含むオブジェクト)。
    - 機能: `robotjs`ライブラリを利用してOSレベルの画面解像度情報を取得し、マウス位置のマッピング範囲を決定するのに役立てます。
- **`getDevices(): AudioDeviceInfo[]`** (src/typescript/cli/src/types/naudiodon.d.ts):
    - 役割: システムに接続されている利用可能なオーディオデバイスの一覧を取得します。
    - 引数: なし。
    - 戻り値: `AudioDeviceInfo[]` (オーディオデバイス情報の配列)。
    - 機能: オーディオデバイスの選択や診断に利用され、各デバイスの名前、ID、入出力チャネル数などの情報を提供します。

## 関数呼び出し階層ツリー
```
- onload (src/obsidian/src/main.ts)
  - enableOscillator (src/obsidian/src/main.ts)
  - switchVersion (src/obsidian/src/main.ts)
  - start (src/obsidian/src/synth/simple.ts または src/obsidian/src/synth/smooth.ts)
- onunload (src/obsidian/src/main.ts)
- catch (src/obsidian/src/main.ts)
  - createAudioOutput (src/typescript/cli/src/audio/output.ts)
    - constructor (src/typescript/cli/src/audio/output.ts)
- mapRange (src/typescript/cli/src/diagnostics/main-diagnostic.ts または src/typescript/cli/src/main.ts)
  - main (src/typescript/cli/src/diagnostics/main-diagnostic.ts または src/typescript/cli/src/main.ts)
  - printDiagnostics (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
  - getMousePosition (src/typescript/cli/src/mouse/position.ts)
  - getScreenSize (src/typescript/cli/src/mouse/position.ts)
- testMouseCapture (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
  - analyzeResults (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
- testFrequencySweep (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)
- getDevices (src/typescript/cli/src/types/naudiodon.d.ts)

---
Generated at: 2025-11-10 07:03:52 JST
