# Cat Oscillator Sync - TypeScript/Node.js CLI版（Windows専用）

🎵 TypeScript (Node.js) で実装したマウス制御ハードシンク・オシレータ（Windows環境向け）

## 概要

このディレクトリには、Node.js ランタイムを使用した TypeScript 実装が含まれています。
`speaker` パッケージを使用してオーディオ出力を実現し、`robotjs` を使用してマウス位置を取得します。

## 特徴

- ✅ **Windows専用設計**: Windows環境に最適化
- ✅ **Node.js使用**: 安定したランタイム環境
- ✅ **speaker パッケージ**: リアルタイムオーディオ出力
- ✅ **robotjs**: クロスプラットフォームなマウス位置取得
- ✅ **CUI で動作**: ブラウザ不要、コマンドラインから即座に起動
- ✅ **低レイテンシ**: 8ms ポーリング間隔で高い応答性
- ✅ **TypeScript ネイティブ**: 型安全な開発
- ✅ **シンプル版とスムーズ版**: 2つのモードから選択可能

## 動作環境

- **OS**: Windows 10/11
- **Node.js**: v20.0.0 以降
- **npm**: v10.0.0 以降

## インストール

### 1. Node.js のインストール

Windows用のNode.jsをインストールします：

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS版（推奨版）をダウンロード
3. インストーラーを実行してインストール

インストール後、コマンドプロンプトまたはPowerShellで確認：

```powershell
node --version
npm --version
```

### 2. リポジトリのクローン

```powershell
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync\src\typescript\cli
```

### 3. 依存パッケージのインストール

```powershell
npm install
```

**注意**: `speaker` と `robotjs` はネイティブモジュールです。
初回インストール時にコンパイルが行われます。
以下のツールが必要になる場合があります：

- **Visual Studio Build Tools** (C++ビルドツール)
- インストール方法:
  ```powershell
  npm install --global windows-build-tools
  ```
  または [Visual Studio](https://visualstudio.microsoft.com/ja/downloads/) から
  「Build Tools for Visual Studio」をインストール

### 4. TypeScriptのコンパイル

```powershell
npm run build
```

## 使用方法

### シンプル版（8msごとに階段状に周波数が変化）

```powershell
npm start
```

または

```powershell
node dist/main.js
```

### スムーズ版（1サンプルごとに滑らかに周波数が変化）

```powershell
node dist/main.js smooth
```

### 操作方法

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl + C` で終了

## プロジェクト構造

```
cli/
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── README.md             # このファイル
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

## 技術詳細

### オーディオ出力 (speaker パッケージ)

`speaker` パッケージを使用して、Node.jsからリアルタイムでオーディオを出力します。
このパッケージはネイティブモジュールとして実装されており、低レイテンシな音声出力が可能です。

```typescript
const speaker = new Speaker({
    channels: 1,          // モノラル
    bitDepth: 16,         // 16ビット
    sampleRate: 48000,    // 48kHz
    signed: true          // 符号付き整数
});
```

### マウス位置取得 (robotjs パッケージ)

`robotjs` パッケージを使用して、マウスカーソル位置を取得します。

```typescript
const pos = robot.getMousePos();
console.log(`Mouse position: ${pos.x}, ${pos.y}`);
```

### ハードシンク・オシレータ

マスターオシレータの位相がリセットされるタイミングで、スレーブオシレータの位相も強制的にリセットします。
これにより、豊かな倍音を持つ音色が生成されます。

```typescript
// マスター位相のラップアラウンドを検出
if (phaseMaster >= 1.0) {
    phaseMaster -= 1.0;
    // スレーブもリセット (HARD SYNC)
    phaseSlave = 0.0;
}
```

### シンプル版 vs スムーズ版

#### シンプル版
- マウス位置の変化が8msごとに音に反映される
- 急激にマウスを動かすと、階段状に周波数が変化
- シンプルな実装のため、仕組みを学びやすい

#### スムーズ版
- 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
- 時定数（デフォルト16ms）で滑らかさを調整可能
- より音楽的で実用的な動作

### パフォーマンス

- **サンプリングレート**: 48000 Hz
- **ポーリング間隔**: 8ms
- **バッファサイズ**: 384 フレーム (8ms @ 48kHz)
- **ビット深度**: 16ビット符号付き整数

## トラブルシューティング

### インストールエラー: node-gyp のビルドに失敗

**原因**: C++コンパイラやビルドツールが不足しています

**解決方法**:
```powershell
npm install --global windows-build-tools
```

または、Visual Studio Build Toolsをインストール：
https://visualstudio.microsoft.com/ja/downloads/

### エラー: "Cannot find module 'speaker'"

**原因**: 依存パッケージがインストールされていません

**解決方法**:
```powershell
npm install
npm run build
```

### エラー: "Failed to initialize audio"

**原因**: オーディオデバイスが見つからないか、使用中です

**解決方法**:
1. オーディオデバイスが接続されているか確認
2. 他のアプリケーションでオーディオデバイスを使用していないか確認
3. PCを再起動してみる

### エラー: "robotjs が動作しない"

**原因**: ネイティブモジュールのビルドに失敗した可能性があります

**解決方法**:
```powershell
npm uninstall robotjs
npm install robotjs --build-from-source
```

### 音が出ない

**解決方法**:
1. ボリュームが適切に設定されているか確認
2. 既定のオーディオデバイスが正しく設定されているか確認
3. コマンドプロンプトまたはPowerShellを管理者権限で実行してみる

## 開発

### 開発モード

TypeScriptファイルを編集した後、以下のコマンドでビルドと実行を一度に行えます：

```powershell
npm run dev
```

### コードの変更

1. `src/` ディレクトリ内のTypeScriptファイルを編集
2. `npm run build` でコンパイル
3. `npm start` で実行

## 他の実装との比較

| 実装 | ランタイム | オーディオ | マウス | ビルド | 対応OS |
|-----|-----------|----------|--------|-------|--------|
| Python | Python 3 | sounddevice | pyautogui | 不要 | 全て |
| Rust | Native | cpal | rdev | 必要 | 全て |
| **Node.js CLI** | Node.js | **speaker** | **robotjs** | 必要 | **Windows** |
| Browser | Browser | Web Audio API | DOM Events | 必要 | 全て |

### Node.js CLI版の利点

- ✅ Windows環境に最適化
- ✅ 安定したNode.jsランタイム
- ✅ speaker パッケージによる低レイテンシ音声出力
- ✅ TypeScriptによる型安全な開発
- ✅ npmエコシステムの活用

### Node.js CLI版の欠点

- ❌ ネイティブモジュールのビルドが必要
- ❌ Windows専用（他のOSでは動作保証なし）
- ⚠️ 初回インストールがやや複雑

## パフォーマンスチューニング

### バッファサイズの調整

`src/main.ts` の `POLLING_INTERVAL_MS` を変更することで、レイテンシとCPU使用率のバランスを調整できます：

```typescript
const POLLING_INTERVAL_MS = 8;  // デフォルト: 8ms
```

- **小さい値**: より低レイテンシ、CPU使用率高
- **大きい値**: レイテンシやや高、CPU使用率低

### 時定数の調整（スムーズ版）

`src/main.ts` の `TIME_CONSTANT_MS` を変更することで、周波数変化の滑らかさを調整できます：

```typescript
const TIME_CONSTANT_MS = 16;  // デフォルト: 16ms
```

- **小さい値**: より応答性が高い（急激な変化）
- **大きい値**: より滑らか（緩やかな変化）

## ライセンス

MIT License - 詳細は [LICENSE](../../../LICENSE) を参照

## 関連ドキュメント

- [TypeScript 実装計画書](../IMPLEMENTATION_PLAN.md)
- [Python 実装](../../python/)
- [Rust 実装](../../rust/)
- [メインREADME](../../../README.md)
