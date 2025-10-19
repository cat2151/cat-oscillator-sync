# TypeScript版 実装計画書

## 概要
Python版のcat-oscillator-syncをTypeScriptで実装する計画書です。
**ブラウザ版**と**CLI版（Node.js）**の2つのアプローチで実装します。

## 目標
- Python版と同等の機能（マウス制御によるハードシンク・オシレータ）を実装
- **Windows環境での動作に特化**
- 低レイテンシな音声出力
- シンプルなインストールと実行手順

## 実装アプローチ

### 1. ブラウザ版
### 2. CLI版（Node.js・Windows専用）

---

## 1. ブラウザ版実装計画

### 概要
Web Audio APIを使用したブラウザ上で動作する実装。

### ライブラリ選定

#### オーディオ出力
**選択: Web Audio API (標準API)**
- **メリット:**
  - ブラウザ標準API（追加インストール不要）
  - クロスプラットフォーム対応
  - 低レイテンシ（AudioWorklet使用時）
  - リアルタイムオーディオ処理に最適化
- **デメリット:**
  - ブラウザ依存（古いブラウザは非対応）
  - PortAudioではない（要件から外れる）
- **ドキュメント:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

#### マウス位置取得
**選択: DOM Events (標準API)**
- `mousemove`イベントで位置取得
- 追加ライブラリ不要
- **ドキュメント:** https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent

#### UI フレームワーク（オプション）
- **選択: バニラTypeScript（推奨）**
  - シンプルな実装のため、フレームワーク不要
- **代替: React / Vue / Svelte**
  - より複雑なUIが必要な場合のみ

### プロジェクト構成

```
src/typescript/browser/
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── IMPLEMENTATION_PLAN.md # 本ドキュメント
├── README.md             # 実装後のREADME
├── index.html            # エントリHTML
├── src/
│   ├── main.ts           # エントリポイント
│   ├── synth/
│   │   ├── simple.ts     # シンプル版実装
│   │   └── smooth.ts     # スムーズ版実装
│   └── audio/
│       └── worklet.ts    # AudioWorklet processor
└── dist/                 # ビルド出力
    ├── index.html
    └── bundle.js
```

### 依存関係 (package.json)

```json
{
  "name": "cat-oscillator-sync-browser",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### インストール手順

#### 開発環境
```bash
# Node.jsのインストール（npmを含む）
# https://nodejs.org/ から最新LTS版

# リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/browser

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

#### 本番環境（ビルド）
```bash
# ビルド
npm run build

# dist/ フォルダをウェブサーバーにデプロイ
```

#### エンドユーザー（最もシンプル）
```
1. ブラウザでURLにアクセス
2. マウスを動かして音を鳴らす
```

### 開発環境構築の複雑度評価

**⭐⭐⭐⭐⭐ (非常に簡単 - エンドユーザー視点)**

**理由:**
1. **追加インストール不要:** ブラウザのみ
2. **クロスプラットフォーム:** Windows, macOS, Linuxで同一動作
3. **即座に起動:** URLアクセスだけ

**開発者視点: ⭐⭐⭐⭐ (簡単)**
1. Node.jsのインストール
2. `npm install`
3. `npm run dev`

**優先度: ⭐⭐⭐⭐⭐ (最高 - エンドユーザー体験)**

---

## 2. CLI版（Node.js・Windows専用）実装計画

### 概要
Node.jsランタイムで`speaker`パッケージを使用したWindows専用のCLI実装。

### ライブラリ選定

#### オーディオ出力

**選択: speaker**
- **メリット:**
  - リアルタイムオーディオ出力が可能
  - 低レイテンシ
  - Windows環境で動作確認済み
  - アクティブにメンテナンスされている
- **デメリット:**
  - ネイティブモジュール（ビルドが必要）
  - Visual Studio Build Toolsが必要
- **GitHub:** https://github.com/TooTallNate/node-speaker
- **npm:** https://www.npmjs.com/package/speaker

#### マウス位置取得

**選択: robotjs**
- **メリット:**
  - Windows環境で動作確認済み
  - シンプルなAPI
  - マウス位置とスクリーンサイズを取得可能
- **デメリット:**
  - ネイティブモジュール（ビルドが必要）
  - Visual Studio Build Toolsが必要
- **GitHub:** https://github.com/octalmage/robotjs

### プロジェクト構成

```
src/typescript/cli/
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── README.md             # 実装後のREADME
├── QUICKSTART.md         # クイックスタート
├── .gitignore            # Git除外設定
├── src/
│   ├── main.ts           # エントリポイント
│   ├── audio/
│   │   └── output.ts     # speaker を使用したオーディオ出力
│   ├── mouse/
│   │   └── position.ts   # robotjs を使用したマウス位置取得
│   └── synth/
│       ├── simple.ts     # シンプル版シンセサイザー
│       └── smooth.ts     # スムーズ版シンセサイザー
└── dist/                 # ビルド出力
```

### 依存関係 (package.json)

```json
{
  "name": "cat-oscillator-sync-cli",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "tsc && node dist/main.js"
  },
  "dependencies": {
    "speaker": "^0.5.4",
    "robotjs": "^0.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0"
  }
}
```

### インストール手順（Windows）

```powershell
# 1. Node.jsのインストール
# https://nodejs.org/ からLTS版をダウンロードしてインストール

# 2. ビルドツールのインストール（管理者権限で実行）
winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"

# 3. リポジトリのクローンと移動
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync\src\typescript\cli

# 4. 依存パッケージのインストール
npm install

# 5. ビルド
npm run build

# 6. 実行
npm start
```

### 使用方法

```powershell
# シンプル版
npm start

# スムーズ版
node dist/main.js smooth
```

### 開発環境構築の複雑度評価

**⭐⭐⭐⭐ (簡単 - Windows専用として推奨)**

**理由:**
1. **Node.jsのインストール:** 公式インストーラーで簡単
2. **ビルドツール:** 1コマンドでインストール可能
3. **依存関係:** `npm install`で自動解決
4. **動作確認済み:** speakerパッケージはWindows環境で確認済み

**優先度: ⭐⭐⭐⭐ (高 - Windows専用として推奨)**

### 実装済みの機能

- ✅ シンプル版シンセサイザー（8msごとの周波数更新）
- ✅ スムーズ版シンセサイザー（指数平滑化）
- ✅ リアルタイムマウス位置取得
- ✅ 低レイテンシオーディオ出力
- ✅ Windows最適化
- ✅ 詳細なREADMEとクイックスタート

---

## アーカイブ: その他の検討したアプローチ

以下のアプローチも検討しましたが、Windows環境での複雑さや動作保証の観点から採用しませんでした。

### 3. ローカル版（Deno）- アーカイブ

### 概要
DenoランタイムでFFI（Foreign Function Interface）を使用する実装。

### ライブラリ選定

#### オーディオ出力

**選択: Deno FFIでPortAudioを呼び出し**
- **メリット:**
  - TypeScriptネイティブ（追加のビルド不要）
  - モダンなランタイム
  - FFIでPortAudioの関数を直接呼び出し可能
- **デメリット:**
  - **PortAudio DLLが必要:**
    1. PortAudioのDLLをダウンロード
    2. `portaudio_x64.dll`を適切な場所に配置
  - FFIコードの記述が複雑
  - 安定性に懸念（FFIはまだ発展途上）
- **ドキュメント:** https://deno.land/manual/runtime/ffi_api

**代替: Web Audio API (Deno Deploy不可)**
- DenoはWeb Audio APIをサポートしていない（ブラウザAPIのため）

#### マウス位置取得

**選択: Deno FFIでWindows APIを呼び出し**
- `user32.dll`の`GetCursorPos`を呼び出し
- **メリット:** 外部依存なし
- **デメリット:** FFIコードが必要

**代替: deno-win32**
- Windows API用のDenoライブラリ（開発中）

### プロジェクト構成

```
src/typescript/local-deno/
├── deno.json             # Deno設定
├── README.md             # 実装後のREADME
├── src/
│   ├── main.ts           # エントリポイント
│   ├── synth/
│   │   ├── simple.ts     # シンプル版実装
│   │   └── smooth.ts     # スムーズ版実装
│   ├── audio/
│   │   └── portaudio.ts  # PortAudio FFIラッパー
│   └── mouse/
│       └── position.ts   # マウス位置取得（FFI）
```

### 依存関係

**外部ライブラリ不要（FFI使用）**

deno.json:
```json
{
  "tasks": {
    "start": "deno run --allow-ffi --allow-read src/main.ts"
  }
}
```

### インストール手順

```bash
# 前提条件
1. Denoのインストール
   # PowerShellで
   irm https://deno.land/install.ps1 | iex

2. PortAudio DLLのダウンロードと配置
   - http://files.portaudio.com/download.html
   - portaudio_x64.dllを実行ディレクトリに配置

# 実行
deno task start
```

### 開発環境構築の複雑度評価

**⭐⭐⭐ (中程度)**

**理由:**
1. **Denoのインストール:** シンプル（1コマンド）
2. **PortAudio DLLの配置:** 手作業が必要
3. **FFIコードの記述:** 複雑（学習コスト高）
4. **ビルド不要:** TypeScriptをそのまま実行

**優先度: ⭐⭐⭐ (中程度)**

**メリット:**
- モダンなTypeScript環境
- 依存関係管理がシンプル

**デメリット:**
- FFI APIがまだ発展途上
- PortAudio DLLの手動配置が必要

---

### 4. ローカル版（Bun）- アーカイブ

### 概要
Bunランタイムを使用する実装。Node.jsの代替として注目されている。

### ライブラリ選定

#### オーディオ出力

**選択: Bun FFIでPortAudioを呼び出し**
- **メリット:**
  - 超高速なTypeScriptランタイム
  - FFIサポート（Denoと同様）
  - Node.js互換性
- **デメリット:**
  - **Windows対応が不完全:** Bunは主にLinux/macOS向け
  - **Windowsサポートは実験的:** 安定性に懸念
  - PortAudio DLLが必要
- **ドキュメント:** https://bun.sh/docs/api/ffi

#### 現状評価
- **Windows対応が不十分:** 2024年1月時点でWindows版はベータ
- **本プロジェクトには不適:** Windows優先のため

### 開発環境構築の複雑度評価

**評価対象外（Windows対応不十分のため）**

**優先度: ⭐ (最低 - Windows対応不十分)**

---

## アプローチ別総合評価

| アプローチ | 優先度 | 複雑度 | Windows対応 | ビルド必要 | 推奨度 |
|---------|-------|-------|-----------|----------|-------|
| **ブラウザ版** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | 必要 | **最推奨（Web）** |
| **CLI版 (Node.js + speaker)** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | 必要 | **推奨（Windows）** |

---

## 推奨実装戦略

### Windows環境向けの推奨実装

**実装の優先順位:**
1. **CLI版（Node.js + speaker）** - Windows専用、CUIで動作
2. **ブラウザ版** - クロスプラットフォーム、Webで動作

### CLI版（Node.js + speaker）の利点

**理由:**
1. **Windows環境で動作確認済み:** `speaker`パッケージはWindows環境で確認済み
2. **低レイテンシ:** リアルタイムオーディオ出力
3. **シンプルなAPI:** `speaker`と`robotjs`で実装がシンプル
4. **CUIで動作:** コマンドプロンプトから即座に起動
5. **TypeScript:** 型安全な開発環境

### ブラウザ版の利点

**理由:**
1. **環境構築が不要:** ブラウザのみ
2. **クロスプラットフォーム:** Windows以外でも動作
3. **即座に体験可能:** URLアクセスのみ
4. **Web Audio APIは低レイテンシ:** AudioWorklet使用時

---

## 実装計画（ブラウザ版）

### Phase 1: 基本構造の実装
1. プロジェクトのセットアップ（Vite + TypeScript）
2. Web Audio APIの基本動作確認
3. AudioWorkletの実装

### Phase 2: シンプル版の実装
1. マウス位置取得（DOM Events）
2. 周波数マッピング関数
3. ハードシンク・オシレータの実装
   - マスターオシレータ
   - スレーブオシレータ（位相リセット）
4. AudioWorklet Processorの実装
5. 動作確認

### Phase 3: スムーズ版の実装
1. 指数平滑化アルゴリズムの実装
2. サンプルごとの周波数補間
3. パラメータ調整UI（オプション）
4. 動作確認

### Phase 4: UI/UX改善
1. シンプルなビジュアライザー（オプション）
2. 周波数表示
3. レスポンシブデザイン

### Phase 5: ドキュメント整備
1. README.mdの更新
2. デモサイトのデプロイ（GitHub Pages等）

---

## 実装計画（CLI版・Node.js）

### Phase 1: プロジェクト構造の構築
1. Node.jsプロジェクトの初期化
2. TypeScript設定
3. 依存パッケージのインストール（speaker、robotjs）

### Phase 2: オーディオ出力とマウス制御の実装
1. speakerパッケージを使用したオーディオ出力モジュール
2. robotjsを使用したマウス位置取得モジュール
3. 基本動作確認

### Phase 3: シンプル版シンセサイザーの実装
1. ハードシンク・オシレータのロジック実装
2. マウス位置から周波数へのマッピング
3. リアルタイムオーディオ生成

### Phase 4: スムーズ版シンセサイザーの実装
1. 指数平滑化アルゴリズムの実装
2. サンプルごとの周波数補間

### Phase 5: ドキュメント整備
1. README.mdの作成（Windows専用手順）
2. QUICKSTART.mdの作成
3. トラブルシューティング情報の追加

---

## 技術的課題と対策

### ブラウザ版

#### 課題1: AudioWorkletの学習コスト
**対策:**
- 公式ドキュメント参照
- サンプルコード活用

#### 課題2: ブラウザ互換性
**対策:**
- モダンブラウザ（Chrome, Firefox, Edge）をターゲット
- ブラウザチェックの実装

#### 課題3: レイテンシ
**対策:**
- AudioWorkletを使用（ScriptProcessorNodeより低レイテンシ）
- 適切なバッファサイズの設定

### CLI版（Node.js）

#### 課題1: ネイティブモジュールのビルド
**対策:**
- Visual Studio Build Toolsのインストール手順を明確化
- winget（Windows Package Manager）を使用した簡単インストール方法を推奨
- Visual Studio Build Tools 2022の使用を推奨
- 詳細なトラブルシューティングガイドの提供

#### 課題2: Windows専用の動作保証
**対策:**
- Windows 10/11での動作確認
- Windows専用であることをドキュメントに明記
- 他のOS向けにはPython版やRust版を推奨

---

## タイムライン（実績）

### ブラウザ版
- Phase 1-5: 完了
- **ステータス:** ✅ 実装完了

### CLI版（Node.js）
- Phase 1-5: 完了
- **ステータス:** ✅ 実装完了

---

## まとめ

### CLI版（Node.js + speaker）- Windows専用推奨

**優先度: ⭐⭐⭐⭐**

**メリット:**
- ✅ Windows環境で動作確認済み
- ✅ `speaker`パッケージによる低レイテンシ
- ✅ リアルタイムオーディオ出力
- ✅ TypeScriptによる型安全な開発
- ✅ CUIで動作（コマンドプロンプトから起動）
- ✅ シンプルなAPIと実装

**デメリット:**
- ❌ ネイティブモジュールのビルドが必要
- ⚠️ Visual Studio Build Toolsが必要
- ⚠️ Windows専用（他のOS では動作保証なし）

**結論:** Windows環境でCUIアプリケーションとして動作させたい場合に最適。

### ブラウザ版（Web向け推奨）

**優先度: ⭐⭐⭐⭐⭐**

**メリット:**
- ✅ 環境構築が最もシンプル（ブラウザのみ）
- ✅ クロスプラットフォーム
- ✅ 即座に体験可能
- ✅ Web Audio APIは低レイテンシ
- ✅ 外部依存不要

**デメリット:**
- ⚠️ ブラウザ依存

**結論:** Webで広く公開したい場合や、クロスプラットフォーム対応が必要な場合に最適。

---

## 最終推奨（Windows環境向け）

**実装済み:**
1. ✅ **CLI版（Node.js + speaker）** - Windows専用、CUIアプリケーション
2. ✅ **ブラウザ版** - クロスプラットフォーム、Webアプリケーション

**Windows環境での選択基準:**
- **CUIで使いたい:** → CLI版
- **Webで公開したい:** → ブラウザ版
- **両方使いたい:** → 両方とも利用可能

これにより、**Windows環境に最適化されたCLI版**と**クロスプラットフォームなブラウザ版**の両方を提供できます。
