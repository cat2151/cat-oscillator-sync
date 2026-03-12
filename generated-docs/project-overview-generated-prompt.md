Last updated: 2026-03-13


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

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

## 🌐 ブラウザで試す

**[→ GitHub Pages でデモを開く](https://cat2151.github.io/cat-oscillator-sync/)**

ブラウザですぐに試せます。インストール不要！

---

## 📦 実装状況とインストール方法

このプロジェクトは、同じオシレータシンクアルゴリズムを複数の言語で実装しています。
各実装には**Simple版**（8msごとに階段状の周波数変化）と**Smooth版**（1サンプルごとの滑らかな周波数変化）があります。

### 🐍 Python版

**状態**: ✅ 完全動作

**ワンライナーインストール（推奨）**:
```bash
pipx install git+https://github.com/cat2151/cat-oscillator-sync
```

**実行**:
```bash
cat-oscillator-sync-simple  # Simple版
cat-oscillator-sync-smooth  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync
pip install -r requirements.txt
python src/python/sync_simple.py
```

**詳細**: [Pythonでシンセサイザーのオシレータシンクのサウンドを50行で鳴らして楽しむ](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)

---

### 🦀 Rust版

**状態**: ✅ 完全動作

**ワンライナーインストール**:
```bash
cargo install --git https://github.com/cat2151/cat-oscillator-sync --root . cat-oscillator-sync
```

インストール後、バイナリは `./bin/` ディレクトリに配置されます。

**実行**:
```bash
./bin/sync_simple  # Simple版
./bin/sync_smooth  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/rust
cargo build --release
cargo run --release --bin sync_simple
```

**特徴**:
- ✅ 高速でメモリ安全な実装
- ✅ 低レイテンシ（約8ms）
- ✅ ワンライナーでインストール可能

---

### 🐹 Go版（Pure Go - Oto）⭐推奨

**状態**: ✅ 完全動作・C言語コンパイラ不要

**ワンライナーインストール**:
```bash
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple_oto@latest
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_smooth_oto@latest
```

**実行**:
```bash
sync_simple_oto  # Simple版
sync_smooth_oto  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go
go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto
go build -o bin/sync_smooth_oto.exe ./cmd/sync_smooth_oto
./bin/sync_simple_oto.exe
```

**特徴**:
- ✅ Pure Go実装 - CGO不要、C言語コンパイラ不要
- ✅ 簡単ビルド - `go build`だけでビルド可能
- ✅ クロスコンパイル対応

**詳細**: [src/go/README.md](src/go/README.md)

---

### 🐹 Go版（PortAudio + Zig cc）

**状態**: ✅ 完全動作・Zig ccが必要

**インストール方法**:

この版はZig ccを使用するため、ワンライナーインストールは推奨しません。
環境構築が必要なため、以下の手順に従ってください：

```bash
# 1. Zigのインストール（まだの場合）
scoop install zig  # または公式サイトからダウンロード

# 2. リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go-portaudio

# 3. PortAudio DLLのダウンロード
python download_portaudio.py

# 4. ビルド
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1
go build -o bin/sync_simple.exe ./cmd/sync_simple
go build -o bin/sync_smooth.exe ./cmd/sync_smooth
```

**実行**:
```bash
cd bin
sync_simple.exe  # Simple版
sync_smooth.exe  # Smooth版
```

**特徴**:
- ✅ 最高のレイテンシとパフォーマンス
- ❌ Zig ccが必要（CGO使用）
- ⚠️ セットアップがやや複雑

**一般ユーザーにはPure Go版（Oto）を推奨します。**

**詳細**: [src/go-portaudio/README.md](src/go-portaudio/README.md)

---

### 🌐 TypeScript版（Browser）

**状態**: ✅ 完全動作・GitHub Pages公開中

**使用方法**:

**オンラインで試す（最も簡単）**:
- [GitHub Pages デモ](https://cat2151.github.io/cat-oscillator-sync/)にアクセス
- インストール不要！

**ローカルで開発する場合**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/browser
npm install
npm run dev  # 開発サーバー起動
# または
npm run build  # 本番ビルド
```

**特徴**:
- ✅ インストール不要でブラウザで動作
- ✅ Web Audio APIによる低レイテンシ（約3ms）
- ✅ Simple版とSmooth版の両方を実装
- ✅ クロスプラットフォーム対応

---

### 💻 TypeScript版（CLI - Windows専用）

**状態**: ✅ 動作中・バッファ遅延あり（約170ms）

**インストール方法**:

```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/cli
npm install
npm run build
```

**実行**:
```bash
npm start              # Simple版
node dist/main.js smooth  # Smooth版
```

**注意事項**:
- ⚠️ Windows専用（robotjs、naudiodonのネイティブモジュール依存）
- ⚠️ バッファ遅延約170ms（naudiodonの制限）
- ⚠️ Visual Studio Build Toolsが必要

**特徴**:
- ✅ Node.jsベースのCLI実装
- ⚠️ レイテンシは他の実装より高い（約170ms）

**より低レイテンシが必要な場合は、Browser版、Python版、Rust版、Go版を推奨します。**

**詳細**: [src/typescript/cli/README.md](src/typescript/cli/README.md)

---

## 📊 実装の比較

| 言語 | 状態 | インストール難易度 | レイテンシ | 推奨度 |
|------|------|-------------------|----------|--------|
| TypeScript (Browser) | ✅ | ⭐⭐⭐⭐⭐（インストール不要） | 約3ms | ⭐⭐⭐⭐⭐ |
| Python | ✅ | ⭐⭐⭐⭐⭐（pipx 1行） | 約8ms | ⭐⭐⭐⭐⭐ |
| Go (Pure Go - Oto) | ✅ | ⭐⭐⭐⭐（go install） | 約16ms | ⭐⭐⭐⭐ |
| Rust | ✅ | ⭐⭐⭐（cargo install） | 約8ms | ⭐⭐⭐⭐ |
| Go (PortAudio) | ✅ | ⭐⭐（Zig cc必要） | 約8ms | ⭐⭐⭐ |
| TypeScript (CLI) | ✅ | ⭐⭐（ビルドツール必要） | 約170ms | ⭐⭐ |

---

## 🎮 使い方

すべての実装で共通の操作方法：

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl + C` で終了

---

## 🔧 全アプリケーションの一括ビルド＆実行（Windows専用）

すべての言語版を一度にビルドし、メニューから選んで実行できます：

```bash
python build_and_run.py
```

このスクリプトは、各言語のビルドスクリプトを順番に実行し、メニューから選んで実行できるようにします。

---

## 📝 技術詳細

### ハードシンク（オシレータ同期）とは

ハードシンクは、一つのオシレータ（マスター）が別のオシレータ（スレーブ）の位相を強制的にリセットする音響合成技術です。

- 豊かな倍音を持つ音色が生成される
- マスター周波数とスレーブ周波数の比率によって音色が変化
- 古典的なアナログシンセサイザーで使われていた技法

### Simple版とSmooth版の違い

#### Simple版
- マウス位置の変化が8msごとに音に反映される
- 急激にマウスを動かすと、階段状に周波数が変化
- シンプルな実装のため、仕組みを学びやすい

#### Smooth版
- 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
- 時定数（デフォルト16ms）で滑らかさを調整可能
- より音楽的で実用的な動作

---

## 📚 プロジェクトのゴール

- [x] Python: LLM chatbotでcode生成し、手軽にinstallして、起動1秒で音が鳴るシンプルなアプリを実現
- [x] Rust: Pythonの実装をagentによりRustに移植可能かを検証
- [x] Go: 同様にGoでもagentにより移植可能かを検証
- [x] TypeScript: 同様にTypeScriptでもagentにより移植可能かを検証

**結果**: すべての言語で実現できました！

---

## 🎯 完了した実装

- [x] Python実装
- [x] Rust実装
- [x] Go実装（Pure Go - Oto）
- [x] Go実装（PortAudio + Zig cc）
- [x] TypeScript実装（ブラウザ版）
- [x] TypeScript実装（CLI版・Windows専用）

---

## ⚖️ ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

---

## 🔗 関連リンク

- [メイン README](README.md)
- [Zenn scraps記事（Python版解説）](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)
- [GitHub Pages デモ](https://cat2151.github.io/cat-oscillator-sync/)

---

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています


依存関係:
{}

## ファイル階層ツリー
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

## ファイル詳細分析
**googled947dc864c270e07.html** (1行, 53バイト)
  - 関数: なし
  - インポート: なし

**src/typescript/browser/index.html** (212行, 4966バイト)
  - 関数: なし
  - インポート: なし

**src/typescript/browser/src/audio/simple-worklet.ts** (66行, 1872バイト)
  - 関数: constructor, handleMessage, if, for
  - インポート: なし

**src/typescript/browser/src/audio/smooth-worklet.ts** (82行, 2757バイト)
  - 関数: constructor, handleMessage, if, for
  - インポート: なし

**src/typescript/browser/src/constants.ts** (3行, 104バイト)
  - 関数: なし
  - インポート: なし

**src/typescript/browser/src/main.ts** (189行, 6084バイト)
  - 関数: constructor, if, switch, catch, handleStart
  - インポート: ./synth/simple, ./synth/smooth

**src/typescript/browser/src/synth/simple.ts** (95行, 3006バイト)
  - 関数: catch, if, start
  - インポート: ../audio/simple-worklet.ts?worker&url, ../constants

**src/typescript/browser/src/synth/smooth.ts** (92行, 2604バイト)
  - 関数: catch, if, start
  - インポート: ../audio/smooth-worklet.ts?worker&url, ../constants

**src/typescript/browser/src/vite-env.d.ts** (8行, 173バイト)
  - 関数: なし
  - インポート: なし

**src/typescript/browser/vite.config.ts** (21行, 451バイト)
  - 関数: なし
  - インポート: vite, path

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
- if (src/typescript/browser/src/synth/simple.ts)
  - start ()
  - catch (src/typescript/browser/src/synth/simple.ts)
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
- for (src/typescript/cli/src/diagnostics/test-mouse-capture.ts)
- getDevices (src/typescript/cli/src/types/naudiodon.d.ts)


## プロジェクト構造（ファイル一覧）
.vscode/settings.json
BROWSER_FIX_SUMMARY.md
README.ja.md
README.md
googled947dc864c270e07.html
issue-notes/96.md
src/go/README.md
src/go-portaudio/QUICKSTART.md
src/go-portaudio/README.md
src/typescript/browser/index.html
src/typescript/browser/package-lock.json
src/typescript/browser/package.json
src/typescript/browser/src/audio/simple-worklet.ts
src/typescript/browser/src/audio/smooth-worklet.ts
src/typescript/browser/src/constants.ts
src/typescript/browser/src/main.ts
src/typescript/browser/src/synth/simple.ts
src/typescript/browser/src/synth/smooth.ts
src/typescript/browser/src/vite-env.d.ts
src/typescript/browser/tsconfig.json
src/typescript/browser/vite.config.ts
src/typescript/cli/BUFFER_SIZE_FIX.md
src/typescript/cli/DELIVERY_SUMMARY.md
src/typescript/cli/DIAGNOSTIC_GUIDE.md
src/typescript/cli/FREQUENCY_UPDATE_FIX.md
src/typescript/cli/INVESTIGATION_REPORT.md
src/typescript/cli/NAUDIODON_MIGRATION.md
src/typescript/cli/NAUDIODON_MIGRATION_COMPLETION.md
src/typescript/cli/NAUDIODON_MIGRATION_SUMMARY.md
src/typescript/cli/README.md

上記の情報を基に、プロンプトで指定された形式でプロジェクト概要を生成してください。
特に以下の点を重視してください：
- 技術スタックは各カテゴリごとに整理して説明
- ファイル階層ツリーは提供された構造をそのまま使用
- ファイルの説明は各ファイルの実際の内容と機能に基づく
- 関数の説明は実際に検出された関数の役割に基づく
- 関数呼び出し階層は実際の呼び出し関係に基づく


---
Generated at: 2026-03-13 07:04:32 JST
