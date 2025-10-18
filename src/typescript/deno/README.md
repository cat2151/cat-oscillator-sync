# Cat Oscillator Sync - Deno版

🎵 TypeScript (Deno) で実装したマウス制御ハードシンク・オシレータ

## 概要

このディレクトリには、Deno ランタイムを使用した TypeScript 実装が含まれています。
FFI (Foreign Function Interface) を使用して、PortAudio と X11 を直接呼び出すことで、
ネイティブなオーディオ出力とマウス位置取得を実現しています。

## 特徴

- ✅ **PortAudio 使用**: FFI 経由で直接 PortAudio を使用
- ✅ **CUI で動作**: ブラウザ不要、コマンドラインから即座に起動
- ✅ **低レイテンシ**: 8ms ポーリング間隔で高い応答性
- ✅ **TypeScript ネイティブ**: ビルド不要、TypeScript を直接実行
- ✅ **シンプルな依存関係**: Deno と PortAudio のみ

## 動作環境

- **OS**: Linux (X11 環境)
- **Deno**: v1.45.5 以降
- **ライブラリ**: PortAudio, X11

## インストール

### 1. Deno のインストール

```bash
# Linux/macOS
curl -fsSL https://deno.land/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex
```

### 2. PortAudio のインストール

#### Ubuntu/Debian
```bash
sudo apt-get install libportaudio2 portaudio19-dev
```

#### Fedora/RHEL
```bash
sudo dnf install portaudio portaudio-devel
```

#### macOS
```bash
brew install portaudio
```

### 3. X11 の確認 (Linux)

X11 は通常プリインストールされていますが、念のため確認：

```bash
ldconfig -p | grep libX11
```

## 使用方法

### 実行

```bash
cd src/typescript/deno
deno task start
```

または

```bash
deno run --unstable-ffi --allow-ffi --allow-env src/main.ts
```

### 操作方法

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl + C` で終了

## プロジェクト構造

```
deno/
├── deno.json              # Deno 設定ファイル
├── README.md             # このファイル
└── src/
    ├── main.ts           # エントリポイント
    ├── audio/
    │   └── portaudio.ts  # PortAudio FFI ラッパー
    ├── mouse/
    │   └── position.ts   # X11 マウス位置取得 FFI ラッパー
    └── synth/
        └── (将来の拡張用)
```

## 技術詳細

### FFI (Foreign Function Interface)

Deno の FFI 機能を使用して、C ライブラリを直接呼び出しています：

- **PortAudio**: オーディオストリームの管理と出力
- **X11**: マウスカーソル位置の取得

### ハードシンク・オシレータ

マスターオシレータの位相がリセットされるタイミングで、スレーブオシレータの位相も強制的にリセットします。
これにより、豊かな倍音を持つ音色が生成されます。

```typescript
// マスター位相のラップアラウンドを検出
if (phaseMaster >= 1.0) {
  phaseMaster -= 1.0;
  // スレーブもリセット
  phaseSlave = 0.0;
}
```

### パフォーマンス

- **サンプリングレート**: 48000 Hz
- **ポーリング間隔**: 8ms
- **バッファサイズ**: 384 フレーム (8ms @ 48kHz)

## トラブルシューティング

### PortAudio が見つからない

```
Error: Could not open library: libportaudio.so.2
```

**解決方法**: PortAudio をインストールしてください
```bash
sudo apt-get install libportaudio2
```

### X11 が見つからない

```
Error: Could not open library: libX11.so.6
```

**解決方法**: X11 をインストールしてください
```bash
sudo apt-get install libx11-6
```

### FFI パーミッションエラー

```
error: Requires --allow-ffi permission
```

**解決方法**: FFI 権限を許可してください
```bash
deno run --allow-ffi --allow-env src/main.ts
```

### オーディオデバイスが見つからない

```
Error: No default output device found
```

**解決方法**: 
1. オーディオデバイスが接続されているか確認
2. PulseAudio や ALSA が正しく設定されているか確認

## 他の実装との比較

| 実装 | ランタイム | オーディオ | マウス | ビルド | 複雑度 |
|-----|-----------|----------|--------|-------|--------|
| Python | Python 3 | sounddevice | pyautogui | 不要 | ⭐⭐⭐⭐⭐ |
| Rust | Native | cpal | rdev | 必要 | ⭐⭐⭐ |
| **Deno** | Deno | PortAudio FFI | X11 FFI | **不要** | ⭐⭐⭐⭐ |
| Browser | Browser | Web Audio API | DOM Events | 必要 | ⭐⭐⭐⭐⭐ |

### Deno 版の利点

- ✅ TypeScript をそのまま実行（ビルド不要）
- ✅ PortAudio を直接使用（要件を満たす）
- ✅ モダンな TypeScript 環境
- ✅ シンプルな依存関係管理

### Deno 版の欠点

- ❌ FFI API の学習コストが高い
- ❌ プラットフォーム固有のコード（Linux の場合は X11、Windows の場合は要調整）
- ⚠️ FFI は実験的機能（安定性に若干の懸念）

## 今後の拡張

- [ ] スムーズ版の実装 (指数平滑化)
- [ ] Windows 対応 (user32.dll FFI)
- [ ] macOS 対応 (Cocoa FFI)
- [ ] パラメータの動的調整

## ライセンス

MIT License - 詳細は [LICENSE](../../../LICENSE) を参照

## 関連ドキュメント

- [TypeScript 実装計画書](../IMPLEMENTATION_PLAN.md)
- [Python 実装](../../python/)
- [Rust 実装](../../rust/)
- [メインREADME](../../../README.md)
