# Cat Oscillator Sync - Browser Edition

🎵 ブラウザで動作するマウス制御ハードシンク・シンセサイザー

## 概要

Web Audio APIとAudioWorkletを使用した、ブラウザ上で動作するオシレータ・ハードシンク・シンセサイザーです。マウスの位置によってリアルタイムに音響パラメータを制御できます。

## 特徴

- **2つのバージョン**:
  - **Simple版**: 階段状の周波数変化（Python版 sync_simple.py 相当）
  - **Smooth版**: 指数平滑化による滑らかな周波数変化（Python版 sync_smooth.py 相当）
  
- **低レイテンシ**: AudioWorkletによる高速なオーディオ処理
- **インストール不要**: ブラウザだけで動作
- **クロスプラットフォーム**: Windows、macOS、Linux対応

## 必要な環境

- モダンなブラウザ（Chrome 66+, Firefox 76+, Edge 79+, Safari 14.1+）
  - AudioWorklet APIをサポートしている必要があります

## 使い方（エンドユーザー）

1. ブラウザでページを開く
2. バージョンを選択（Simple / Smooth）
3. 「音を開始」ボタンをクリック
4. マウスを動かして音を制御
   - **X軸（横方向）**: マスター周波数（40-600 Hz）
   - **Y軸（縦方向）**: スレーブ周波数（100-2000 Hz）

## 開発環境のセットアップ

### 必要なツール

- Node.js 18+ （npmを含む）

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/browser

# 依存関係のインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/` フォルダに出力されます。

### プレビュー

```bash
npm run preview
```

ビルドした結果をプレビューできます。

## 技術詳細

### アーキテクチャ

```
src/
├── main.ts              # メインアプリケーション（UI制御）
├── synth/
│   ├── simple.ts        # Simple版シンセサイザー
│   └── smooth.ts        # Smooth版シンセサイザー
└── audio/
    ├── simple-worklet.ts   # Simple版AudioWorklet Processor
    └── smooth-worklet.ts   # Smooth版AudioWorklet Processor
```

### AudioWorkletについて

AudioWorkletは、Web Audio APIの低レイテンシなオーディオ処理を実現する仕組みです。
従来のScriptProcessorNodeと比べて、以下の利点があります：

- 専用のオーディオスレッドで実行（メインスレッドをブロックしない）
- グリッチやノイズが少ない
- より低いレイテンシ

### 実装の違い

#### Simple版
- マウス位置の変化が8msごとに音に反映される
- 階段状の周波数変化
- Python版 `sync_simple.py` と同等の動作

#### Smooth版
- 指数平滑化により1サンプルごとの滑らかな周波数変化
- 時定数16msで滑らかに追従
- Python版 `sync_smooth.py` と同等の動作

## ハードシンクとは

ハードシンク（オシレータ同期）は、一つのオシレータ（マスター）が別のオシレータ（スレーブ）の位相を強制的にリセットする音響合成技術です。

- マスター周波数とスレーブ周波数の比率によって音色が変化
- 豊かな倍音を持つ音色が生成される
- 古典的なアナログシンセサイザーで使われていた技法

## パフォーマンス

- サンプリングレート: 48000 Hz
- マウスポーリング間隔: 8ms（125 Hz）
- 時定数（Smooth版）: 16ms

## ブラウザ互換性

| ブラウザ | 最小バージョン | AudioWorklet対応 |
|---------|--------------|-----------------|
| Chrome  | 66+          | ✅              |
| Firefox | 76+          | ✅              |
| Edge    | 79+          | ✅              |
| Safari  | 14.1+        | ✅              |

## トラブルシューティング

### 音が出ない

1. ブラウザのオーディオ再生が許可されているか確認
2. システムの音量設定を確認
3. ブラウザのコンソールでエラーを確認
4. AudioWorkletをサポートしているブラウザか確認

### レイテンシが高い

- Chrome系のブラウザが最も低レイテンシです
- ブラウザの設定で「ハードウェアアクセラレーション」を有効にしてください

## ライセンス

このプロジェクトは [MIT License](../../../LICENSE) の下で公開されています。

## 関連リンク

- [Python版実装](../../python/)
- [実装計画書](2_TYPESCRIPT_IMPLEMENTATION_PLAN.md)
- [Web Audio API ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [AudioWorklet ドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet)
