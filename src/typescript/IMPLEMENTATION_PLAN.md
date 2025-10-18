# TypeScript版 実装計画書

## 概要
Python版のcat-oscillator-syncをTypeScriptで実装する計画書です。
**ブラウザ版**と**ローカル版**の2つのアプローチを検討し、それぞれのメリット・デメリットを評価します。

## 目標
- Python版と同等の機能（マウス制御によるハードシンク・オシレータ）を実装
- Windows環境での動作を優先
- 低レイテンシな音声出力
- シンプルなインストールと実行手順

## アプローチ比較

### 1. ブラウザ版
### 2. ローカル版（Node.js）
### 3. ローカル版（Deno）
### 4. ローカル版（Bun）

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

## 2. ローカル版（Node.js）実装計画

### 概要
Node.jsランタイムでPortAudioバインディングを使用する実装。

### ライブラリ選定

#### オーディオ出力

**選択肢A: node-portaudio**
- **メリット:**
  - PortAudioのNode.jsバインディング
  - Python版と同じPortAudioを使用
- **デメリット:**
  - **開発停滞:** 最終更新が古い（メンテナンスされていない）
  - **ビルドが困難:** ネイティブモジュールのビルドが必要
  - **Windows環境で複雑:**
    1. Python 2.7のインストールが必要（node-gypのため）
    2. Visual Studio Build Toolsのインストール
    3. PortAudioのソースからビルド
  - **非推奨:** メンテナンスされていない
- **GitHub:** https://github.com/joeferner/node-portaudio (archived)

**選択肢B: node-speaker + node-portaudio**
- 同様にネイティブモジュールのビルドが必要
- Windows環境で複雑

**選択肢C: Web Audio API (Electron経由)**
- Electronを使用してブラウザ版をデスクトップアプリ化
- PortAudioではないが、シンプル
- **推奨アプローチ**

#### マウス位置取得

**選択: robotjs**
- **メリット:**
  - クロスプラットフォーム対応
  - マウス位置取得が簡単
- **デメリット:**
  - ネイティブモジュール（ビルドが必要）
  - Windows環境でVisual Studio Build Toolsが必要
- **GitHub:** https://github.com/octalmage/robotjs

**代替: node-ffi + Windows API**
- より複雑だが、外部依存が少ない

### プロジェクト構成

```
src/typescript/local-nodejs/
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── README.md             # 実装後のREADME
├── src/
│   ├── main.ts           # エントリポイント
│   ├── synth/
│   │   ├── simple.ts     # シンプル版実装
│   │   └── smooth.ts     # スムーズ版実装
│   └── mouse/
│       └── position.ts   # マウス位置取得
└── dist/                 # ビルド出力
```

### 依存関係 (package.json)

```json
{
  "name": "cat-oscillator-sync-nodejs",
  "version": "0.1.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js"
  },
  "dependencies": {
    "robotjs": "^0.6.0"
    // PortAudioバインディングは現実的ではない
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0"
  }
}
```

### インストール手順

```bash
# 前提条件（非常に複雑）
1. Node.jsのインストール
2. Python 2.7のインストール（node-gyp用）
3. Visual Studio Build Toolsのインストール
4. Windows SDKのインストール

# ビルド
npm install  # ネイティブモジュールのビルドで失敗する可能性が高い

# 実行
npm start
```

### 開発環境構築の複雑度評価

**⭐ (非常に複雑 - 推奨しない)**

**理由:**
1. **ネイティブモジュールのビルド:** Python 2.7 + Visual Studio Build Tools
2. **PortAudioバインディングが古い:** メンテナンスされていない
3. **ビルド失敗のリスク:** Windows環境で特に高い
4. **手作業でのDLL配置:** 必要になる可能性

**優先度: ⭐ (最低 - 推奨しない)**

---

## 3. ローカル版（Deno）実装計画

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

## 4. ローカル版（Bun）実装計画

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

| アプローチ | 優先度 | 複雑度 | PortAudio使用 | DLL手動配置 | 推奨度 |
|---------|-------|-------|-------------|-----------|-------|
| **ブラウザ版** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | 不要 | **最推奨** |
| **Node.js + Electron** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ❌ | 不要 | 推奨 |
| **Node.js (ネイティブ)** | ⭐ | ⭐ | ✅ | 必要 | **非推奨** |
| **Deno + FFI** | ⭐⭐⭐ | ⭐⭐⭐ | ✅ | 必要 | 検討可 |
| **Bun** | ⭐ | - | - | - | 非推奨 |

---

## 推奨実装戦略

### 最優先: ブラウザ版

**理由:**
1. **最もシンプルな環境構築:** ブラウザのみ
2. **クロスプラットフォーム:** Windows以外でも動作
3. **即座に体験可能:** URLアクセスのみ
4. **Web Audio APIは低レイテンシ:** AudioWorklet使用時

**実装の優先順位:**
1. ブラウザ版（必須）
2. Electron版（オプション - デスクトップアプリとして配布したい場合）
3. Deno版（実験的 - PortAudio要件を満たしたい場合）

### PortAudio要件について

**重要な考察:**
- **要件:** 「PortAudio系ライブラリを使用」
- **ブラウザ版:** Web Audio APIを使用（PortAudioではない）
- **しかし:** Web Audio APIは低レイテンシで、目的は達成可能

**提案:**
1. **ブラウザ版を主実装として推奨**（最もシンプル）
2. **Deno + FFI版を補助実装**（PortAudio要件を満たす）
3. **Node.js + ネイティブは避ける**（複雑すぎる）

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

## Deno版実装計画（補助）

### Phase 1: FFIラッパーの実装
1. PortAudio FFI定義
2. Windows API FFI定義（マウス位置）
3. 基本動作確認

### Phase 2-3: シンプル版・スムーズ版の実装
（ブラウザ版と同様のロジック）

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

### Deno版

#### 課題1: FFI APIの複雑さ
**対策:**
- シンプルなラッパー関数を作成
- 型定義を明確に

#### 課題2: PortAudio DLLの配布
**対策:**
- DLLを実行ファイルと同梱
- または、インストールスクリプトの提供

---

## タイムライン（想定）

### ブラウザ版
- Phase 1: 2-3時間
- Phase 2: 3-4時間
- Phase 3: 2-3時間
- Phase 4: 2-3時間（オプション）
- Phase 5: 1-2時間
- **合計:** 10-15時間

### Deno版
- Phase 1: 4-6時間（FFI学習含む）
- Phase 2-3: 4-6時間
- **合計:** 8-12時間

---

## まとめ

### ブラウザ版（最推奨）

**優先度: ⭐⭐⭐⭐⭐**

**メリット:**
- ✅ 環境構築が最もシンプル（ブラウザのみ）
- ✅ クロスプラットフォーム
- ✅ 即座に体験可能
- ✅ Web Audio APIは低レイテンシ
- ✅ 外部DLL不要

**デメリット:**
- ❌ PortAudioではない（要件から外れる）
- ⚠️ ブラウザ依存

**結論:** エンドユーザー体験を最優先する場合、ブラウザ版が最適。

### Deno版（補助的選択肢）

**優先度: ⭐⭐⭐**

**メリット:**
- ✅ PortAudio使用可能（要件を満たす）
- ✅ モダンなTypeScript環境
- ✅ ビルド不要

**デメリット:**
- ❌ PortAudio DLLの手動配置が必要
- ⚠️ FFI APIの学習コストが高い

**結論:** PortAudio要件を満たしたい場合の選択肢。ただし、DLL配置が必要。

### Node.js版（非推奨）

**優先度: ⭐**

**理由:**
- ❌ ネイティブモジュールのビルドが非常に複雑
- ❌ PortAudioバインディングがメンテナンスされていない
- ❌ Python 2.7 + Visual Studio Build Tools が必要

**結論:** 実装は推奨しない。

---

## 最終推奨

**実装優先順位:**
1. **ブラウザ版（必須）** - 最もシンプルで実用的
2. **Deno版（オプション）** - PortAudio要件を満たしたい場合
3. Node.js版は避ける

**二段構えのアプローチ:**
- **メイン:** ブラウザ版で広く使えるバージョンを提供
- **サブ:** Deno版でPortAudio要件も満たす

これにより、**シンプルさ**と**要件適合**の両立が可能です。
