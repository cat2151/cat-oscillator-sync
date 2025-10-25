# Go版 (Pure Go - Oto) - Cat Oscillator Sync

🎵 Pure Go版 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## ⭐ 主な特徴

**Pure Go実装 - C言語コンパイラ不要！**

- ✅ **Pure Go実装** - CGO不要、C言語コンパイラ不要
- ✅ **簡単ビルド** - `go build`だけでビルド可能
- ✅ **クロスコンパイル対応** - Linux/macOS上からWindows版をビルド可能
- ✅ **環境を汚さない** - 追加のツールチェインが不要
- ✅ モノフォニックシンセには十分な性能

## 📋 必要な環境

- Windows 10/11
- Go 1.24以上
- **C言語コンパイラは不要！**

## 🚀 ビルド方法

### Windows上でビルド

```cmd
cd src\go

REM シンプル版をビルド
go build -o bin\sync_simple_oto.exe .\cmd\sync_simple_oto

REM スムーズ版をビルド
go build -o bin\sync_smooth_oto.exe .\cmd\sync_smooth_oto
```

### Linux/macOS上でWindows版をクロスコンパイル

```bash
cd src/go

# シンプル版をビルド
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto

# スムーズ版をビルド
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o bin/sync_smooth_oto.exe ./cmd/sync_smooth_oto
```

## 🎮 実行方法

```cmd
cd src\go\bin

REM シンプル版を実行
sync_simple_oto.exe

REM スムーズ版を実行
sync_smooth_oto.exe
```

## 使い方

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl+C` で終了

## バージョンの違い

### Simple版 (sync_simple_oto.exe)
- 8msごとに周波数が階段状に変化
- マウスを素早く動かすと、音が段階的に変化する
- シンプルな実装で理解しやすい

### Smooth版 (sync_smooth_oto.exe)
- サンプルごとに滑らかに周波数が変化
- 指数平滑化により自然な音の遷移
- より音楽的で実用的

## 技術詳細

### 使用ライブラリ

- **[ebitengine/oto/v3](https://github.com/ebitengine/oto)**: Pure Go オーディオライブラリ
  - Ebitengineゲームエンジンプロジェクトの一部
  - Windows上では WASAPI または WinMM を使用
  - `purego` ライブラリを使用してシステムコールを実行（CGO不要）

### オーディオ設定

- サンプルレート: 48000 Hz
- チャンネル数: 1 (モノラル)
- フォーマット: Float32 Little Endian
- バッファサイズ: 8ms

### マウス位置取得

- **Windows**: user32.dllの`GetCursorPos` APIを直接呼び出し (syscall)
- ポーリング間隔: 8ms (125Hz)

## PortAudio版との比較

このプロジェクトには2つのGo実装があります：

### go版（このディレクトリ）- Oto使用
- ✅ **Pure Go** - コンパイラ不要
- ✅ **簡単ビルド** - `go build`だけ
- ✅ **環境を汚さない** - 追加のツールチェイン不要
- ✅ モノフォニックシンセには十分な性能
- ⚠️ レイテンシは若干劣る可能性

### go-portaudio版 ([../go-portaudio/](../go-portaudio/))
- ✅ 最高のレイテンシとパフォーマンス
- ✅ プロフェッショナル向け
- ❌ **Zig ccが必要**（CGO使用）
- ⚠️ セットアップがやや複雑

**一般ユーザーにはこのgo版（Oto）を推奨します。**

## プロジェクト構成

```
src/go/
├── go.mod                           # Go モジュール定義
├── go.sum                           # 依存関係のチェックサム
├── .gitignore                       # Git除外設定
├── README.md                        # このファイル
├── cmd/
│   ├── sync_simple_oto/            # Oto版シンプル
│   │   └── main.go
│   └── sync_smooth_oto/            # Oto版スムーズ
│       └── main.go
├── internal/
│   ├── mouse/                      # マウス位置取得
│   │   ├── position.go             # 共通インターフェース
│   │   ├── position_stub.go        # スタブ実装
│   │   └── position_windows.go     # Windows実装
│   └── synth/                      # シンセサイザーロジック
│       ├── simple.go               # Simple版
│       └── smooth.go               # Smooth版
└── bin/                            # ビルド出力 (gitignore)
    ├── sync_simple_oto.exe
    └── sync_smooth_oto.exe
```

## トラブルシューティング

### ビルドエラーが出る

最新のGoバージョンを使用していることを確認してください:
```cmd
go version
```

Go 1.24以上が必要です。古いバージョンの場合は[公式サイト](https://go.dev/dl/)からダウンロードしてください。

### 音が出ない

1. Windowsのサウンド設定を確認してください
2. 他のオーディオアプリケーションを閉じてください
3. プログラムを管理者権限で実行してみてください

### 音が途切れる（グリッチ）

バッファサイズを大きくすることで改善する可能性があります。
`cmd/sync_*_oto/main.go`の`bufferSizeMs`定数を変更してください（デフォルト: 8ms）

```go
const (
    bufferSizeMs = 20 // 8ms から 20ms に変更
)
```

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
