# TypeScript Obsidian プラグイン版 vs ブラウザ版 比較

## 概要

この比較表は、TypeScript ブラウザ版とObsidianプラグイン版の違いを明確にするためのドキュメントです。

## 基本比較

| 項目 | ブラウザ版 | Obsidianプラグイン版 |
|------|-----------|-------------------|
| **実装状況** | ✅ 実装完了 | 📝 計画書完成 |
| **動作環境** | Webブラウザ | Obsidianデスクトップアプリ |
| **インストール** | 不要（URLアクセス） | プラグインインストール必要 |
| **起動方法** | 「音を開始」ボタン | コマンドパレット or 設定 |
| **プラットフォーム** | Win/Mac/Linux/モバイル | Win/Mac/Linux（デスクトップのみ） |
| **UI** | 専用HTML+CSS | Obsidianのネイティブコンポーネント |
| **ビルドツール** | Vite | esbuild |
| **依存パッケージ** | vite, typescript | obsidian, esbuild, typescript |

## 技術スタック比較

### 共通部分

どちらも以下を使用:
- **TypeScript** - 型安全な開発
- **Web Audio API** - 音声生成
- **AudioWorklet** - 低レイテンシオーディオ処理
- **DOM Events** - マウス位置取得

### ブラウザ版固有

```typescript
// エントリポイント: main.ts
import { SimpleSynth } from './synth/simple';

class App {
  private synth: SimpleSynth | null = null;
  
  private handleStart() {
    this.synth = new SimpleSynth();
    await this.synth.start();
    this.startPolling();
  }
}
```

- HTMLファイルでUI構築
- Viteでバンドル
- 独立したWebアプリケーション

### Obsidianプラグイン版固有

```typescript
// エントリポイント: main.ts
import { Plugin } from 'obsidian';
import { SimpleSynth } from './synth/simple';

export default class CatOscillatorSyncPlugin extends Plugin {
  private synth: SimpleSynth | null = null;
  
  async onload() {
    this.addCommand({
      id: 'toggle-oscillator',
      name: 'Toggle Oscillator Sync',
      callback: () => this.toggleOscillator()
    });
  }
  
  onunload() {
    this.stopOscillator();
  }
}
```

- Obsidian Plugin APIを使用
- esbuildでバンドル
- Obsidianのプラグインとして統合

## アーキテクチャ比較

### ブラウザ版

```
index.html
  └─ main.ts (App class)
      ├─ synth/simple.ts (SimpleSynth class)
      │   └─ audio/simple-worklet.ts (AudioWorklet)
      ├─ synth/smooth.ts (SmoothSynth class)
      │   └─ audio/smooth-worklet.ts (AudioWorklet)
      └─ DOM Events (マウストラッキング)
```

### Obsidianプラグイン版

```
manifest.json
  └─ main.ts (Plugin class)
      ├─ settings.ts (設定画面)
      ├─ synth/simple.ts (SimpleSynth class) ← ブラウザ版から移植
      │   └─ audio/simple-worklet.ts (AudioWorklet) ← ブラウザ版から移植
      ├─ synth/smooth.ts (SmoothSynth class) ← ブラウザ版から移植
      │   └─ audio/smooth-worklet.ts (AudioWorklet) ← ブラウザ版から移植
      └─ mouse-handler.ts (マウストラッキング)
```

## コード再利用性

### 再利用可能なコード（約80%）

以下はブラウザ版からそのまま、または最小限の変更で移植可能:

1. **Synthクラス** (`synth/simple.ts`, `synth/smooth.ts`)
   - Web Audio API の初期化
   - AudioWorkletの管理
   - 周波数更新ロジック
   - ほぼ変更なし

2. **AudioWorklet** (`audio/simple-worklet.ts`, `audio/smooth-worklet.ts`)
   - ハードシンク・オシレータのロジック
   - サンプル生成処理
   - 完全に同一

3. **マウス制御ロジック**
   - マウス位置取得
   - 周波数マッピング
   - ポーリング処理
   - ほぼ変更なし

### 新規実装が必要なコード（約20%）

1. **Obsidian統合部分**
   - Plugin クラス
   - コマンド登録
   - 設定画面（オプション）

2. **AudioWorkletモジュール読み込み**
   - パス解決の調整
   - Blob URLによるインライン化（必要に応じて）

## 実装方針の違い

### ブラウザ版

**目的**: 手軽に試せるWebアプリ

**特徴**:
- ボタンクリックで即座に開始
- バージョン選択（Simple/Smooth）
- 周波数表示
- シンプルなUI

**ユーザー体験**:
1. URLを開く
2. バージョンを選択
3. 「音を開始」をクリック
4. マウスを動かす

### Obsidianプラグイン版

**目的**: Obsidianで音を鳴らす検証

**特徴**:
- コマンドパレットから制御
- Obsidian設定画面統合（オプション）
- バックグラウンド動作
- Obsidian環境に統合

**ユーザー体験**:
1. プラグインをインストール
2. コマンドパレット（Ctrl/Cmd + P）
3. "Toggle Oscillator Sync" を実行
4. マウスを動かす

## ビルドプロセス比較

### ブラウザ版

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**開発フロー**:
1. `npm run dev` で開発サーバー起動
2. ブラウザで `http://localhost:5173` にアクセス
3. ファイル変更がホットリロード

**本番ビルド**:
1. `npm run build`
2. `dist/` フォルダにバンドル出力
3. Webサーバーにデプロイ

### Obsidianプラグイン版

```json
{
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production"
  }
}
```

**開発フロー**:
1. `npm run dev` でファイル監視開始
2. `main.js` が自動生成される
3. Obsidianプラグインフォルダにコピー
4. Obsidianでプラグインをリロード

**本番ビルド**:
1. `npm run build`
2. `main.js`, `manifest.json` を生成
3. プラグインとして配布

## パフォーマンス比較

### レイテンシ

| 項目 | ブラウザ版 | Obsidianプラグイン版 |
|------|-----------|-------------------|
| Audio API | Web Audio API | Web Audio API（同一） |
| レンダリング | AudioWorklet | AudioWorklet（同一） |
| マウスポーリング | 8ms | 8ms（同一） |
| 期待レイテンシ | ~10-20ms | ~10-20ms（同一） |

→ **音声処理のレイテンシは理論上同じ**

### CPU/メモリ使用量

| 項目 | ブラウザ版 | Obsidianプラグイン版 |
|------|-----------|-------------------|
| プロセス | ブラウザプロセス | Obsidianプロセス |
| オーバーヘッド | ブラウザのみ | Obsidian全体 |
| メモリ使用 | 低 | Obsidianに依存 |

→ **Obsidian版はObsidian自体のリソースも含むため、やや重い可能性**

## ユースケース比較

### ブラウザ版が適している場合

- ✅ 手軽に試したい
- ✅ インストール不要で使いたい
- ✅ 複数のデバイスで使いたい
- ✅ Webで公開したい
- ✅ モバイルでも試したい（制限あり）

### Obsidianプラグイン版が適している場合

- ✅ Obsidianを日常的に使っている
- ✅ ノート取りながら音を鳴らしたい
- ✅ Obsidianのワークフローに統合したい
- ✅ デスクトップ環境で使用
- ✅ Obsidianプラグイン開発を学びたい

## 実装難易度

### ブラウザ版

**難易度**: ⭐⭐⭐ (中程度)

**理由**:
- HTML/CSS/TSの基本知識が必要
- Web Audio API の学習
- AudioWorklet の理解
- Viteの基本的な使い方

### Obsidianプラグイン版

**難易度**: ⭐⭐⭐⭐ (やや高い)

**理由**:
- ブラウザ版の知識に加えて
- Obsidian Plugin API の学習
- esbuildの設定
- AudioWorkletのバンドル対応
- Obsidianのライフサイクル理解

→ **ブラウザ版の経験があれば、追加学習は限定的**

## 開発の依存関係

### ブラウザ版

```
Node.js → npm → TypeScript + Vite
                 └─ Web標準API（ブラウザ）
```

**外部依存**: Node.js実行環境のみ

### Obsidianプラグイン版

```
Node.js → npm → TypeScript + esbuild + Obsidian API
                 └─ Web標準API（Electron/Chromium）
                     └─ Obsidian Plugin API
```

**外部依存**: Node.js実行環境 + Obsidian

## まとめ

### 共通点

- 同じ音声生成ロジック（80%のコード再利用）
- 同じWeb Audio API
- 同じマウス制御方式
- 同じレイテンシ性能

### 相違点

| 側面 | ブラウザ版 | Obsidianプラグイン版 |
|------|-----------|-------------------|
| **実装状況** | 完成 | 計画中 |
| **インストール** | 不要 | 必要 |
| **起動方法** | ボタン | コマンド |
| **統合** | 独立アプリ | Obsidianプラグイン |
| **ビルドツール** | Vite | esbuild |
| **学習コスト** | 中 | やや高 |
| **適用場面** | 汎用 | Obsidian特化 |

### 推奨アプローチ

1. **まずブラウザ版で試す** → 手軽、広く使える
2. **Obsidian利用者向けにプラグイン版を提供** → ワークフロー統合

**どちらも価値がある実装であり、補完的な関係**
