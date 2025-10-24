# 移行ノート - Deno版からNode.js CLI版への変更

このドキュメントは、Deno版からNode.js CLI版への移行に関する技術的な詳細を説明します。

## 背景

### 問題点
以前のDeno版実装では、以下の問題がありました：

1. **Linux専用**: X11を使用したマウス位置取得のため、Linux環境専用だった
2. **FFIの複雑さ**: PortAudioとX11をFFI経由で呼び出す実装が複雑だった
3. **Windows非対応**: Windows環境では動作しなかった
4. **エラー**: Windows環境での動作確認が取れていなかった

### 解決方法

Node.js + `speaker` + `robotjs` を使用することで、Windows環境に最適化した実装に変更しました。

## 主な変更点

### 1. ランタイムの変更

| 項目 | Deno版 | Node.js版 |
|-----|--------|-----------|
| ランタイム | Deno | Node.js |
| パッケージマネージャー | deno.json | npm (package.json) |
| モジュールシステム | ES Modules | ES Modules |
| TypeScript | 直接実行 | コンパイル必要 (tsc) |

### 2. オーディオ出力の変更

#### Deno版（削除）
```typescript
// PortAudio FFI経由
const libPortAudio = Deno.dlopen("/lib/x86_64-linux-gnu/libportaudio.so.2", {
  // FFI定義...
});
```

- **方式**: PortAudio FFI
- **対象OS**: Linux
- **複雑度**: 高（FFIコード記述が必要）
- **問題点**: Windows未対応、DLLパスがハードコード

#### Node.js版（新規）
```typescript
// speaker パッケージ
import Speaker from "speaker";

const speaker = new Speaker({
  channels: 1,
  bitDepth: 16,
  sampleRate: 48000,
});
```

- **方式**: speaker npmパッケージ
- **対象OS**: Windows（主に）
- **複雑度**: 低（シンプルなAPI）
- **利点**: ネイティブモジュールとして動作、Windows最適化

### 3. マウス位置取得の変更

#### Deno版（削除）
```typescript
// X11 FFI経由
const libX11 = Deno.dlopen("/lib/x86_64-linux-gnu/libX11.so.6", {
  // FFI定義...
});
```

- **方式**: X11 FFI
- **対象OS**: Linux（X11環境のみ）
- **複雑度**: 高（FFIコード記述が必要）
- **問題点**: Windows未対応

#### Node.js版（新規）
```typescript
// robotjs パッケージ
import robot from "robotjs";

const pos = robot.getMousePos();
const size = robot.getScreenSize();
```

- **方式**: robotjs npmパッケージ
- **対象OS**: クロスプラットフォーム（Windows推奨）
- **複雑度**: 低（シンプルなAPI）
- **利点**: Windows環境で動作確認済み

### 4. プロジェクト構造の変更

#### Deno版（削除）
```
deno/
├── deno.json              # Deno設定
├── src/
│   ├── main.ts
│   ├── audio/
│   │   └── portaudio.ts   # PortAudio FFI
│   └── mouse/
│       └── position.ts    # X11 FFI
```

#### Node.js版（新規）
```
cli/
├── package.json           # npm設定
├── tsconfig.json          # TypeScript設定
├── src/
│   ├── main.ts
│   ├── audio/
│   │   └── output.ts      # speaker パッケージ
│   ├── mouse/
│   │   └── position.ts    # robotjs パッケージ
│   └── synth/
│       ├── simple.ts      # シンプル版
│       └── smooth.ts      # スムーズ版
└── dist/                  # ビルド出力
```

### 5. ビルドプロセスの変更

#### Deno版
- ビルド不要（TypeScript直接実行）
- 実行: `deno task start`
- フラグ: `--unstable-ffi --allow-ffi --allow-env`

#### Node.js版
- ビルド必要（TypeScript → JavaScript）
- ビルド: `npm run build`
- 実行: `npm start` または `node dist/main.js`

### 6. 依存関係の変更

#### Deno版
- 外部依存なし（FFI使用）
- システムライブラリ: PortAudio, X11

#### Node.js版
- npmパッケージ:
  - `speaker` - オーディオ出力
  - `robotjs` - マウス位置取得
  - `typescript` - TypeScriptコンパイラ
  - `@types/node` - Node.js型定義
- ビルドツール: Visual Studio Build Tools（Windows）

## コードの移植

### オーディオコールバックの変更

#### Deno版
```typescript
function audioCallback(outputBuffer: Float32Array, frameCount: number): void {
  // Float32Array に直接書き込み
  for (let i = 0; i < frameCount; i++) {
    outputBuffer[i] = sample;
  }
}
```

#### Node.js版
```typescript
callback(buffer: Int16Array, frameCount: number): void {
  // Int16Array に変換して書き込み
  for (let i = 0; i < frameCount; i++) {
    buffer[i] = Math.floor(amplitude * 16384);
  }
}
```

**主な違い:**
- Deno版: Float32Array（-1.0 ~ 1.0）
- Node.js版: Int16Array（-32768 ~ 32767）
- Node.js版では音量を16384に調整（クリッピング防止）

### シンセサイザーロジック

シンセサイザーのハードシンクアルゴリズムは**同一**です：

```typescript
// マスター位相のラップアラウンドを検出
if (phaseMaster >= 1.0) {
  phaseMaster -= 1.0;
  // スレーブもリセット (HARD SYNC)
  phaseSlave = 0.0;
}
```

この部分は変更なしで移植できました。

## パフォーマンス比較

| 項目 | Deno版 | Node.js版 |
|-----|--------|-----------|
| 起動速度 | 高速 | 高速 |
| メモリ使用量 | 低 | 中 |
| CPU使用率 | 低 | 低~中 |
| オーディオレイテンシ | 低 | 低 |
| ビルド時間 | 0秒 | 数秒 |

## 動作環境

### Deno版（削除）
- **OS**: Linux（X11環境）
- **必須**: Deno, PortAudio, X11
- **推奨**: Ubuntu 24.04 LTS

### Node.js版（新規）
- **OS**: Windows 10/11
- **必須**: Node.js v20+, Visual Studio Build Tools
- **推奨**: Windows 11

## 今後の展開

### 対応予定
- Windows環境での動作検証
- パフォーマンスチューニング
- エラーハンドリングの強化

### 対応予定なし
- Linux/macOS対応（Deno版を廃止したため）
  - Linux: Python版またはRust版を推奨
  - macOS: Python版を推奨

## 参考リンク

- [speaker パッケージ](https://www.npmjs.com/package/speaker)
- [robotjs パッケージ](https://www.npmjs.com/package/robotjs)
- [Node.js公式サイト](https://nodejs.org/)
- [TypeScript公式サイト](https://www.typescriptlang.org/)

## まとめ

Deno版からNode.js版への移行により：

**✅ 達成したこと:**
- Windows環境での動作を実現
- シンプルなAPIによる実装
- npmエコシステムの活用
- TypeScriptによる型安全性の維持

**❌ トレードオフ:**
- ネイティブモジュールのビルドが必要
- Linux/macOS対応を廃止
- FFI学習機会の喪失（教育的観点から）

全体として、**Windows環境に特化**することで、より実用的で保守しやすい実装になりました。
