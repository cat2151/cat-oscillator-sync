# Cat Oscillator Sync - Obsidian Plugin Edition

🎵 Obsidianプラグインとして動作するマウス制御ハードシンク・シンセサイザー

## 概要

このディレクトリには、Obsidian用プラグインとしてcat-oscillator-syncを実装するための計画書が含まれています。

## 目的

obsidian-plugin-abcjsのように、Obsidianで音を鳴らすことができるか？を検証するための実装プロトタイプです。

## ドキュメント

- **[実装計画書](20_OBSIDIAN_IMPLEMENTATION_PLAN.md)** - 詳細な実装計画とアーキテクチャ設計

## 参考実装

このObsidianプラグイン版は、以下を参考に設計されています：

1. **TypeScript ブラウザ版** (`src/typescript/browser/`)
   - Web Audio APIの使用方法
   - AudioWorkletの実装
   - マウス制御ロジック

2. **obsidian-plugin-abcjs**
   - Obsidianプラグインの基本構造
   - コマンドの実装方法
   - 音声再生の統合

## 主要な特徴

### 音声制御方式（計画）

以下の3つのアプローチを検討：

1. **プラグイン有効時に自動再生**（仮仕様）
   - プラグインを有効にすると自動的に音が鳴る
   - シンプルだが、常に音が鳴り続ける

2. **コマンドでON/OFF切り替え**（推奨）
   - コマンドパレットから「Toggle Oscillator Sync」を実行
   - ユーザーが必要な時だけ音を鳴らせる
   - obsidian-plugin-abcjsと同様のアプローチ

3. **設定画面でON/OFF**（高度）
   - 設定画面にトグルスイッチを追加
   - UI上で直感的に制御

→ **推奨実装**: コマンド方式（実用性とシンプルさのバランス）

### 技術スタック

- **Obsidian Plugin API** - プラグインの基盤
- **TypeScript** - 型安全な開発
- **Web Audio API** - 音声生成（AudioWorklet使用）
- **esbuild** - 高速ビルド

## プロジェクト構成（計画）

```
src/obsidian/
├── manifest.json           # プラグイン情報（必須）
├── package.json            # npm設定
├── tsconfig.json           # TypeScript設定
├── esbuild.config.mjs      # ビルド設定
├── IMPLEMENTATION_PLAN.md  # 実装計画書
├── README.md              # このファイル
├── src/
│   ├── main.ts            # プラグインのエントリポイント
│   ├── settings.ts        # 設定画面
│   ├── synth/
│   │   ├── simple.ts      # シンプル版（ブラウザ版から移植）
│   │   └── smooth.ts      # スムーズ版（ブラウザ版から移植）
│   └── audio/
│       ├── simple-worklet.ts   # AudioWorklet（ブラウザ版から移植）
│       └── smooth-worklet.ts
└── styles.css             # プラグイン用スタイル（オプション）
```

## 実装フェーズ

### Phase 1: 基本構造
- プロジェクトのセットアップ
- manifest.json、package.json、tsconfig.json作成
- 基本的なプラグインクラスの実装

### Phase 2: 音声機能
- ブラウザ版からSynthクラスを移植
- AudioWorkletの移植
- 基本的な音声再生の動作確認

### Phase 3: マウス制御
- MouseHandlerクラスの実装
- マウスイベントリスナーの登録
- 周波数マッピング機能

### Phase 4: コマンド実装
- Toggle/Enable/Disableコマンドの追加
- コマンドパレットからの制御

### Phase 5: 設定画面（オプション）
- 設定タブの追加
- パラメータ調整機能

### Phase 6: ドキュメント
- 使用方法の説明
- トラブルシューティング

## 技術的課題

### 1. AudioWorkletモジュールのパス解決
- Obsidianプラグインでのバンドル環境でのAudioWorklet読み込み
- Blob URLを使用したインライン化で対応

### 2. Obsidian APIの統合
- プラグインライフサイクル（onload/onunload）
- コマンド登録
- 設定の永続化

### 3. デスクトップ版のみ対応
- Web Audio APIの制限により、モバイル版では動作しない
- `manifest.json`で`isDesktopOnly: true`を設定

## 参考リンク

### Obsidian関連
- [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [obsidian-plugin-abcjs](https://github.com/abcjs-music/obsidian-plugin-abcjs)

### 本プロジェクト関連
- [TypeScript ブラウザ版](../typescript/browser/)
- [TypeScript ブラウザ版 実装計画書](2_TYPESCRIPT_IMPLEMENTATION_PLAN.md)
- [Python版実装](../python/)

### Web Audio API
- [Web Audio API ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [AudioWorklet ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)

## ステータス

**現在のステータス**: ✅ 実装完了

実装済み機能:
1. ✅ Phase 1: プロジェクト構造の作成
2. ✅ Phase 2-3: 音声機能の実装（SimpleSynth, SmoothSynth, AudioWorklet）
3. ✅ Phase 4: メインプラグインクラスの実装
4. ✅ Phase 5: マウス制御の実装
5. ✅ Phase 6: コマンドの実装（toggle, enable, disable, version switching）

## インストール方法

### 開発版のインストール

1. **ビルド**
   ```bash
   cd src/obsidian
   npm install
   npm run build
   ```

2. **Obsidianプラグインフォルダへコピー**
   
   プラグインフォルダの場所:
   - Windows: `%APPDATA%\Obsidian\YourVaultName\.obsidian\plugins\`
   - macOS: `~/Library/Application Support/obsidian/YourVaultName/.obsidian/plugins/`
   - Linux: `~/.config/obsidian/YourVaultName/.obsidian/plugins/`

   ```bash
   # cat-oscillator-syncフォルダを作成
   mkdir -p /path/to/your/vault/.obsidian/plugins/cat-oscillator-sync
   
   # 必要なファイルをコピー
   cp main.js /path/to/your/vault/.obsidian/plugins/cat-oscillator-sync/
   cp manifest.json /path/to/your/vault/.obsidian/plugins/cat-oscillator-sync/
   ```

3. **Obsidianでプラグインを有効化**
   - Obsidianを再起動
   - Settings → Community plugins → Installed plugins
   - "Cat Oscillator Sync"を有効化

## 使用方法

### 基本操作

1. **コマンドパレットを開く**
   - Windows/Linux: `Ctrl + P`
   - macOS: `Cmd + P`

2. **オシレータを起動**
   - コマンド: "Enable Oscillator Sync" または "Toggle Oscillator Sync"
   - マウスを動かすと音が鳴り始めます

3. **音のコントロール**
   - **マウスX座標**: マスター周波数（40-600 Hz）を制御
     - 左: 低い音
     - 右: 高い音
   - **マウスY座標**: スレーブ周波数（100-2000 Hz）を制御
     - 上: 高い音
     - 下: 低い音

4. **オシレータを停止**
   - コマンド: "Disable Oscillator Sync" または "Toggle Oscillator Sync"

### バージョン切り替え

プラグインは2つのバージョンをサポート:

- **Simple版**: 周波数が即座に変わる（デフォルト）
  - コマンド: "Switch to Simple Version"
  
- **Smooth版**: 周波数が滑らかに変わる
  - コマンド: "Switch to Smooth Version"

### コマンド一覧

| コマンド | 説明 |
|---------|------|
| Toggle Oscillator Sync | オシレータのON/OFF切り替え |
| Enable Oscillator Sync | オシレータを起動 |
| Disable Oscillator Sync | オシレータを停止 |
| Switch to Simple Version | Simple版に切り替え |
| Switch to Smooth Version | Smooth版に切り替え |

## 技術仕様

### 実装されている機能

1. **Web Audio API統合**
   - AudioWorkletを使用した低レイテンシ音声生成
   - Blob URLによるworkletコードのインライン化

2. **ハードシンク・オシレータ**
   - マスターオシレータとスレーブオシレータの同期
   - ノコギリ波生成

3. **マウストラッキング**
   - 8msごとの周波数更新（125 Hz）
   - 画面サイズに応じた周波数マッピング

4. **2つのバージョン**
   - Simple版: 即座の周波数変更
   - Smooth版: 指数関数的平滑化（16msタイムコンスタント）

### ファイル構成

```
src/obsidian/
├── manifest.json           # プラグイン情報
├── main.js                # ビルド済みプラグイン（自動生成）
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── esbuild.config.mjs     # ビルド設定
└── src/
    ├── main.ts            # プラグインエントリポイント
    ├── mouse-handler.ts   # マウストラッキング
    ├── synth/
    │   ├── simple.ts      # Simple版シンセサイザー
    │   └── smooth.ts      # Smooth版シンセサイザー
    └── audio/
        ├── simple-worklet.ts  # Simple版AudioWorklet
        └── smooth-worklet.ts  # Smooth版AudioWorklet
```

## トラブルシューティング

### 音が鳴らない

1. **ブラウザの音声権限を確認**
   - Obsidianがデスクトップ版であることを確認（モバイル版は非対応）

2. **コンソールログを確認**
   - Developer Tools を開く（Ctrl/Cmd + Shift + I）
   - Console タブでエラーメッセージを確認

3. **プラグインを再起動**
   - オシレータを無効化してから再度有効化

### 音が途切れる

- CPUリソースが不足している可能性があります
- 他のCPU負荷の高いアプリケーションを閉じてみてください

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 開発

### 開発モード

ファイル変更を監視して自動ビルド:

```bash
npm run dev
```

### ビルドのみ

```bash
npm run build
```

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
