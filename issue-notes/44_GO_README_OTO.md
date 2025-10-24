# Go Oto版 - Cat Oscillator Sync (Pure Go実装)

🎵 Pure Go版 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## ⭐ 主な特徴

**このOto版は、C言語コンパイラやMinGWが不要です！**

- ✅ **Pure Go実装** - CGO不要、C言語コンパイラ不要
- ✅ **簡単ビルド** - `go build`だけでビルド可能
- ✅ **クロスコンパイル対応** - Linux/macOS上からWindows版をビルド可能
- ✅ **環境を汚さない** - MinGWなどの大きなツールチェインが不要

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

### PortAudio版との違い

#### Oto版 (このREADME)
- ✅ **Pure Go** - C言語コンパイラ不要
- ✅ **簡単ビルド** - `go build`だけ
- ✅ **環境を汚さない** - 追加のツールチェイン不要
- ⚠️ レイテンシやパフォーマンスは PortAudio より若干劣る可能性
- ✅ モノフォニックシンセには十分な性能

#### PortAudio版 (cmd/sync_simple, cmd/sync_smooth)
- ❌ **CGO必須** - C言語コンパイラ必須（MinGW/TDM-GCC等）
- ❌ **複雑なビルド** - 環境セットアップが必要
- ✅ 最高のレイテンシとパフォーマンス
- ✅ プロフェッショナル向け

### なぜOto版を推奨するのか？

このプロジェクトの`oscsync`はモノフォニックシンセであり、処理負荷が非常に小さいため、
**Oto版でも十分に目的を達成できます**。

ユーザーにとって:
- ビルドが簡単
- 環境を汚さない
- すぐに試せる

これらの利点は、わずかなレイテンシの差よりも重要です。

### オーディオ設定

- サンプルレート: 48000 Hz
- チャンネル数: 1 (モノラル)
- フォーマット: Float32 Little Endian
- バッファサイズ: 20ms

### マウス位置取得

- **Windows**: user32.dllの`GetCursorPos` APIを直接呼び出し (syscall)
- ポーリング間隔: 8ms (125Hz)

## プロジェクト構成

```
src/go/
├── cmd/
│   ├── sync_simple_oto/       # Oto版シンプル
│   │   └── main.go
│   ├── sync_smooth_oto/       # Oto版スムーズ
│   │   └── main.go
│   ├── sync_simple/           # PortAudio版シンプル
│   │   └── main.go
│   └── sync_smooth/           # PortAudio版スムーズ
│       └── main.go
├── internal/
│   ├── mouse/                 # マウス位置取得
│   └── synth/                 # シンセサイザーロジック
└── bin/                       # ビルド出力
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
`main.go`の`bufferSizeMs`定数を変更してください（デフォルト: 20ms）

```go
const (
    bufferSizeMs = 40 // 20ms から 40ms に変更
)
```

## 関連ドキュメント

- [README.md](README.md) - PortAudio版の詳細
- [INVESTIGATION_CGO_ALTERNATIVES.md](INVESTIGATION_CGO_ALTERNATIVES.md) - CGO要件の調査報告
- [QUICKSTART.md](QUICKSTART.md) - クイックスタートガイド

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
