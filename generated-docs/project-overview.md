Last updated: 2026-02-02

# Project Overview

## プロジェクト概要
- マウス操作でリアルタイムに音を制御できるインタラクティブなハードシンクシンセサイザーです。
- 豊かな倍音を生成するオシレータ同期（ハードシンク）技術を採用し、X軸でマスター、Y軸でスレーブ周波数を制御します。
- Python, Rust, Go, TypeScriptなど複数の言語で実装され、ブラウザやCLIで手軽に体験できるデモを提供しています。

## 技術スタック
- フロントエンド:
    - **Web Audio API**: ブラウザ版のTypeScript実装で、低遅延のオーディオ処理を実現します。
    - **HTML/CSS**: ブラウザ版のユーザーインターフェース構造とスタイルを定義します。
    - **Vite**: TypeScriptブラウザ版の高速な開発サーバーとビルドツールとして機能します。
- 音楽・オーディオ:
    - **ハードシンク（オシレータ同期）**: 複数のオシレータを同期させ、独特で豊かな倍音を持つ音色を生成するシンセサイザーの核となる技術です。
    - **naudiodon**: TypeScript CLI版でNode.jsからシステムオーディオデバイスへの出力を行うライブラリです。
    - **Oto**: Go言語のPure Go版で、C言語コンパイラを必要とせずオーディオ出力を行うためのライブラリです。
    - **PortAudio**: Go PortAudio版で利用される、クロスプラットフォーム対応のオーディオ入出力ライブラリです。
- 開発ツール:
    - **pipx**: Pythonアプリケーションのインストールと実行を分離して管理するツールです。
    - **pip**: Pythonパッケージのインストールと管理を行う標準ツールです。
    - **npm/yarn**: TypeScriptプロジェクトで依存関係の管理とスクリプト実行を行うためのパッケージマネージャーです。
    - **robotjs**: TypeScript CLI版でマウスカーソルの位置取得など、プログラムからのマウス操作を可能にするライブラリです。
    - **esbuild**: Obsidianプラグイン版で利用される、高速なJavaScript/TypeScriptバンドラーです。
    - **Zig cc**: Go PortAudio版でPortAudioライブラリをビルドするために使用されるC言語コンパイラです。
- テスト:
    - **pytest**: Pythonコードの単体テストや統合テストに使用されるテストフレームワークです。
- ビルドツール:
    - **Pythonスクリプト (build_and_run.py)**: 全言語版の一括ビルドと実行、各言語版の個別ビルドと実行を自動化するスクリプトです。
- 言語機能:
    - **Python**: シンセサイザーのロジックをシンプルに記述し、オーディオ処理を行うための主要言語の一つです。
    - **Rust**: パフォーマンスとメモリ安全性に優れたシステムプログラミング言語で、リアルタイムオーディオ処理に適しています。
    - **Go**: 並行処理とシンプルな構文が特徴のシステムプログラミング言語で、効率的なオーディオ処理を実装しています。
    - **TypeScript**: JavaScriptに静的型付けを導入し、大規模なアプリケーション開発を支援する言語です。
    - **Web Worker**: TypeScriptブラウザ/Obsidian版で、メインスレッドとは独立してオーディオ処理を実行し、UIの応答性を保つためのWeb APIです。
- 自動化・CI/CD:
    - **GitHub Pages**: TypeScriptブラウザ版のデモを公開・ホスティングするために利用されます。
- 開発標準:
    - **ruff**: Pythonコードのフォーマットとリントチェックを高速に行い、コード品質と一貫性を維持するツールです。
    - **EditorConfig**: 異なる開発環境間でのコードスタイルの一貫性を保つための設定ファイルです。
    - **VSCode拡張機能 (Python, Pylance, Ruff, EditorConfig)**: 開発効率を高め、プロジェクト全体のコード品質を統一するための推奨開発環境設定です。

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
- **docs/assets/index-CDju8QjF.js**: GitHub Pagesで公開されているブラウザ版デモのメインJavaScriptバンドルファイル。シンセサイザーのロジック、Web Audio APIによるオーディオ処理、マウスイベントハンドリングなどが含まれています。
- **docs/index.html**: GitHub Pagesで公開されているブラウザ版デモのHTMLエントリーポイント。JavaScriptバンドルを読み込み、シンセサイザーのユーザーインターフェース構造を提供します。
- **googled947dc864c270e07.html**: Googleサイト検証用の空ファイル。サイトの所有権を確認するために使用されます。
- **src/obsidian/src/audio/simple-worklet.ts**: Obsidianプラグイン版で、シンプルなハードシンク音源のWeb Audio API `AudioWorkletProcessor` 実装。Workletスレッドでオーディオ処理を行い、CPU負荷を分散します。
- **src/obsidian/src/audio/smooth-worklet.ts**: Obsidianプラグイン版で、指数平滑化による滑らかな周波数遷移を持つハードシンク音源の`AudioWorkletProcessor` 実装。より音楽的な音色変化を実現します。
- **src/obsidian/src/main.ts**: Obsidianプラグインのメインエントリーポイント。プラグインのライフサイクル（ロード、アンロード）を管理し、シンセサイザーの有効化やシンプル/スムーズバージョンの切り替えロジックを含みます。
- **src/obsidian/src/mouse-handler.ts**: Obsidianプラグイン版で、マウスイベントを捕捉し、その位置情報に基づいてシンセサイザーのパラメータ（マスター周波数、スレーブ周波数）を更新するロジックをカプセル化したクラスです。
- **src/obsidian/src/synth/simple.ts**: Obsidianプラグイン版のシンプルなシンセサイザーロジックを扱うファイル。`simple-worklet.ts` を利用して音源を生成・制御します。
- **src/obsidian/src/synth/smooth.ts**: Obsidianプラグイン版のスムーズなシンセサイザーロジックを扱うファイル。`smooth-worklet.ts` を利用して滑らかな音源を生成・制御します。
- **src/typescript/browser/index.html**: TypeScriptブラウザ版のHTMLエントリーポイント。ブラウザでシンセサイザーデモを実行するための基本的なUI構造と、メインスクリプトの読み込みを定義します。
- **src/typescript/browser/src/audio/simple-worklet.ts**: TypeScriptブラウザ版で、シンプルなハードシンク音源の`AudioWorkletProcessor` 実装。Web Audio APIのWorkletスレッドでリアルタイムオーディオ処理を行います。
- **src/typescript/browser/src/audio/smooth-worklet.ts**: TypeScriptブラウザ版で、指数平滑化を適用したスムーズな周波数遷移を持つハードシンク音源の`AudioWorkletProcessor` 実装です。
- **src/typescript/browser/src/main.ts**: TypeScriptブラウザ版のメインアプリケーションロジック。シンセサイザーの初期化、マウスイベントのハンドリング、オーディオストリームの開始・停止などを管理します。
- **src/typescript/browser/src/synth/simple.ts**: TypeScriptブラウザ版のシンプルなシンセサイザーロジックを扱うファイル。`AudioWorkletProcessor` を通じて音を生成・制御します。
- **src/typescript/browser/src/synth/smooth.ts**: TypeScriptブラウザ版のスムーズなシンセサイザーロジックを扱うファイル。滑らかな周波数変化を実現する音源を生成・制御します。
- **src/typescript/browser/vite.config.ts**: TypeScriptブラウザ版のVite設定ファイル。プロジェクトのビルドプロセス、開発サーバーの挙動、プラグインなどを定義します。
- **src/typescript/cli/src/audio/output.ts**: TypeScript CLI版のオーディオ出力処理を抽象化するファイル。`naudiodon`ライブラリを使用して、計算された音声データをシステムオーディオデバイスに送信します。
- **src/typescript/cli/src/diagnostics/main-diagnostic.ts**: TypeScript CLI版の診断ツールメインファイル。マウス入力、オーディオ出力、シンセサイザーの連携をテストし、全体の動作状態を診断します。
- **src/typescript/cli/src/diagnostics/test-frequency-sweep.ts**: TypeScript CLI版の周波数スイープテストファイル。特定の周波数範囲でシンセサイザーを動作させ、オーディオ出力の正確性と連続性を検証します。
- **src/typescript/cli/src/diagnostics/test-mouse-audio.ts**: TypeScript CLI版のマウスとオーディオの統合テストファイル。マウス入力によるリアルタイムな周波数制御と、それに伴うオーディオ出力の連動性を検証します。
- **src/typescript/cli/src/diagnostics/test-mouse-capture.ts**: TypeScript CLI版のマウスキャプチャテストファイル。`robotjs`ライブラリを使用してマウス位置を正確かつタイムリーに取得できるか検証します。
- **src/typescript/cli/src/main.ts**: TypeScript CLI版のメインアプリケーションロジック。シンセサイザーの初期化、マウスイベントの監視、オーディオストリームの開始・停止などを管理し、コマンドラインからシンセサイザーを起動します。
- **src/typescript/cli/src/mouse/position.ts**: TypeScript CLI版のマウス位置取得ロジック。`robotjs`ライブラリを介して現在のマウスカーソル位置（X, Y座標）と画面サイズを取得する機能を提供します。
- **src/typescript/cli/src/synth/simple.ts**: TypeScript CLI版のシンプルなシンセサイザーロジックを実装するファイル。ハードシンク波形を計算し、オーディオバッファに書き込む処理を行います。
- **src/typescript/cli/src/synth/smooth.ts**: TypeScript CLI版のスムーズなシンセサイザーロジックを実装するファイル。指数平滑化を適用することで、より滑らかな周波数変化を実現したハードシンク波形を計算します。
- **src/typescript/cli/src/types/naudiodon.d.ts**: TypeScript CLI版で使用される`naudiodon`ライブラリの型定義ファイル。TypeScriptコンパイラにライブラリのインターフェース情報を提供し、型安全な開発を可能にします。

## 関数詳細説明
- **s (docs/assets/index-CDju8QjF.js)**: (詳細不明) おそらくWeb Audio APIのコンテキストやオーディオノードを初期化し、シンセサイザーの再生を開始するバンドルされた内部関数の一部です。
- **l (docs/assets/index-CDju8QjF.js)**: (詳細不明) オーディオ処理や状態管理に関連するバンドルされた内部ヘルパー関数と考えられます。
- **function (docs/assets/index-CDju8QjF.js)**: (詳細不明) Webコンポーネントのロジックやイベントハンドリングの一部として機能する匿名関数、または特定の目的のための関数です。
- **constructor (undefined)**: クラスのインスタンス化時に呼び出される初期化メソッドです。インスタンスのプロパティ設定や初期状態の準備を行います。
- **start ()**: シンセサイザーのオーディオストリームやマウスイベント監視を開始します。引数なし。
- **catch ()**: エラーハンドリングのためのブロック。Promiseがrejectされた際やtryブロック内で例外が発生した際に実行されます。引数なし。
- **stop ()**: シンセサイザーのオーディオストリームやマウスイベント監視を停止します。引数なし。
- **updateFrequencies ()**: マウス位置に基づいてマスター周波数とスレーブ周波数を更新します。引数なし。
- **getIsRunning ()**: シンセサイザーが現在動作中であるかどうかの状態を返します。引数なし。戻り値はboolean。
- **if (...)**: 条件分岐の開始。特定の条件が真の場合に続くコードブロックを実行します。
- **handleStart ()**: オーディオ処理の開始に関連するイベントを処理します。引数なし。
- **switch (...)**: 複数の選択肢に基づいて異なるコードブロックを実行する制御フローです。
- **handleStop ()**: オーディオ処理の停止に関連するイベントを処理します。引数なし。
- **handleMouseMove ()**: マウスの移動イベントを処理し、シンセサイザーのパラメータを更新します。マウスイベントオブジェクトを引数にとる可能性があります。
- **handleResize ()**: ウィンドウのリサイズイベントを処理し、UIやパラメータの計算範囲を調整します。ウィンドウイベントオブジェクトを引数にとる可能性があります。
- **startPolling ()**: 定期的にマウス位置を取得するためのポーリング処理を開始します。引数なし。
- **stopPolling ()**: マウス位置のポーリング処理を停止します。引数なし。
- **mapRange (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts)**: ある範囲の数値を別の範囲に線形にマッピングします。引数: `value` (入力値), `inMin` (入力範囲の最小値), `inMax` (入力範囲の最大値), `outMin` (出力範囲の最小値), `outMax` (出力範囲の最大値)。戻り値: マッピングされた数値。
- **process (src/obsidian/src/audio/simple-worklet.ts, src/obsidian/src/audio/smooth-worklet.ts)**: Web Audio APIの`AudioWorkletProcessor`で、オーディオデータを処理するコールバック関数です。入力バッファ、出力バッファ、パラメータを引数にとります。
- **for (...)**: ループ処理の開始。配列の反復処理や、指定回数の処理を実行するのに使用されます。
- **onload (src/obsidian/src/main.ts)**: Obsidianプラグインがロードされた際に実行される初期化関数です。プラグインのセットアップやイベントリスナーの登録を行います。引数なし。
- **onunload (src/obsidian/src/main.ts)**: Obsidianプラグインがアンロードされる際に実行されるクリーンアップ関数です。リソースの解放やイベントリスナーの解除を行います。引数なし。
- **enableOscillator ()**: シンセサイザーの音源を有効化または無効化します。引数なし。
- **switchVersion ()**: シンセサイザーのシンプル版とスムーズ版の音源実装を切り替えます。引数なし。
- **handleMessage (src/typescript/browser/src/audio/simple-worklet.ts, src/typescript/browser/src/audio/smooth-worklet.ts)**: `AudioWorkletProcessor`がメインスレッドからのメッセージを受信した際に実行される関数です。メッセージイベントオブジェクトを引数にとります。
- **createAudioOutput (src/typescript/cli/src/audio/output.ts)**: `naudiodon`ライブラリを使用してオーディオ出力ストリームを生成します。サンプリングレートやバッファサイズなどの設定を引数にとる場合があります。戻り値はオーディオストリームオブジェクト。
- **main (src/typescript/cli/src/diagnostics/main-diagnostic.ts, src/typescript/cli/src/main.ts)**: CLIアプリケーションのメインエントリーポイント。プログラムの主要な実行ロジックを含み、通常はコマンドライン引数 (`argv`) を受け取ります。
- **printDiagnostics (src/typescript/cli/src/diagnostics/main-diagnostic.ts)**: 診断テストの結果をコンソールに出力する関数です。診断データオブジェクトを引数にとる可能性があります。
- **getMousePosition (src/typescript/cli/src/mouse/position.ts)**: `robotjs`ライブラリを使用して現在のマウスカーソル位置（X, Y座標）を取得します。引数なし。戻り値は`{x: number, y: number}`。
- **getScreenSize (src/typescript/cli/src/mouse/position.ts)**: `robotjs`ライブラリを使用して現在の画面のサイズ（幅、高さ）を取得します。引数なし。戻り値は`{width: number, height: number}`。
- **testFrequencySweep (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts)**: 指定された周波数範囲でシンセサイザーを動作させ、オーディオ出力をテストします。テストパラメータを引数にとる可能性があります。
- **analyzeResults (src/typescript/cli/src/diagnostics/test-frequency-sweep.ts, src/typescript/cli/src/diagnostics/test-mouse-audio.ts, src/typescript/cli/src/diagnostics/test-mouse-capture.ts)**: 各種テストの結果を分析し、その結果に基づいた診断レポートを生成します。テスト結果データ構造を引数にとります。
- **testMouseAudio (src/typescript/cli/src/diagnostics/test-mouse-audio.ts)**: マウス入力による周波数制御とオーディオ出力の連動をテストします。テストパラメータを引数にとる可能性があります。
- **testMouseCapture (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)**: マウス位置取得機能の正確性と応答性をテストします。テストパラメータを引数にとる可能性があります。
- **getDevices (src/typescript/cli/src/types/naudiodon.d.ts)**: `naudiodon`ライブラリの機能で、システムに利用可能なオーディオデバイスのリストを取得します。引数なし。戻り値はオーディオデバイスの配列。

## 関数呼び出し階層ツリー
```
- if (src/obsidian/src/main.ts)
  - start ()
    - s (docs/assets/index-CDju8QjF.js)
      - l ()
      - function ()
      - constructor (undefined)
    - stop ()
    - updateFrequencies ()
    - getIsRunning ()
  - onload (src/obsidian/src/main.ts)
    - onunload ()
      - enableOscillator ()
      - switchVersion ()
  - catch (src/obsidian/src/main.ts)
    - mapRange (src/typescript/cli/src/diagnostics/main-diagnostic.ts)
      - createAudioOutput (src/typescript/cli/src/audio/output.ts)
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

---
Generated at: 2026-02-02 07:03:43 JST
