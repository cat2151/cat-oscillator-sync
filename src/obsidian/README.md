# Cat Oscillator Sync - Obsidian Plugin Edition

🎵 Obsidianプラグインとして動作するマウス制御ハードシンク・シンセサイザー

## 概要

このディレクトリには、Obsidian用プラグインとしてcat-oscillator-syncを実装するための計画書が含まれています。

## 目的

obsidian-plugin-abcjsのように、Obsidianで音を鳴らすことができるか？を検証するための実装プロトタイプです。

## ドキュメント

- **[実装計画書](IMPLEMENTATION_PLAN.md)** - 詳細な実装計画とアーキテクチャ設計

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
- [TypeScript ブラウザ版 実装計画書](../typescript/IMPLEMENTATION_PLAN.md)
- [Python版実装](../python/)

### Web Audio API
- [Web Audio API ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [AudioWorklet ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)

## ステータス

**現在のステータス**: 📝 実装計画書作成完了

次のステップ:
1. Phase 1の実装開始
2. 基本的なプラグイン構造の作成
3. ブラウザ版コードの移植

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
