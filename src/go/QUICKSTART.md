# Go版 クイックスタートガイド

このガイドでは、Go版cat-oscillator-syncを最速で動かす方法を説明します。

## 前提条件

- Go 1.21以上がインストールされていること
- Linux環境（Ubuntu/Debianを想定）

## インストール手順

### 1. 必要なパッケージのインストール

```bash
sudo apt-get update
sudo apt-get install -y portaudio19-dev xdotool x11-utils
```

### 2. リポジトリのクローン（まだの場合）

```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go
```

### 3. 依存関係のダウンロード

```bash
go mod download
```

### 4. ビルド

```bash
# Simple版
go build -o bin/sync_simple ./cmd/sync_simple

# Smooth版
go build -o bin/sync_smooth ./cmd/sync_smooth
```

### 5. 実行

```bash
# Simple版を実行
./bin/sync_simple

# または Smooth版を実行
./bin/sync_smooth
```

## ビルドせずに直接実行

開発中は`go run`を使うと便利です：

```bash
# Simple版
go run ./cmd/sync_simple

# Smooth版
go run ./cmd/sync_smooth
```

## 終了方法

`Ctrl+C` を押すとプログラムが終了します。

## 使い方

1. プログラムを起動すると自動的にオーディオが開始されます
2. マウスを動かして音を制御します：
   - **X軸（左右）**: マスター周波数 (40Hz - 600Hz)
   - **Y軸（上下）**: スレーブ周波数 (2000Hz - 100Hz)
3. マウスを画面の中央に持っていくと、中間の周波数になります
4. マウスを動かすと、リアルタイムに音が変化します

## Simple版とSmooth版の違い

### Simple版
- 8msごとに周波数が階段状に変化
- マウスを素早く動かすと、音が段階的に変化する
- シンプルな実装で理解しやすい

### Smooth版
- サンプルごとに滑らかに周波数が変化
- 指数平滑化により自然な音の遷移
- より音楽的で実用的

## トラブルシューティング

### PortAudioが見つからない

```bash
sudo apt-get install portaudio19-dev
```

### xdotoolが見つからない

```bash
sudo apt-get install xdotool
```

### xdpyinfoが見つからない

```bash
sudo apt-get install x11-utils
```

### 音が出ない

1. オーディオデバイスが正しく接続されているか確認
2. 音量がミュートになっていないか確認
3. 他のアプリケーションでオーディオが使用されていないか確認

### ビルドエラー

```bash
# 依存関係を再取得
go clean -modcache
go mod download
go mod tidy
```

## Windows版

Windows版の詳細なインストール手順は [README.md](README.md) を参照してください。

### Windows版の簡易手順

1. Go 1.21以上をインストール
2. MinGW-w64またはTDM-GCCをインストール
3. PortAudio DLLをダウンロード

```powershell
cd src\go
python download_portaudio.py
```

4. ビルドして実行

```powershell
go build -o bin\sync_simple.exe .\cmd\sync_simple
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
.\bin\sync_simple.exe
```

## テストの実行

```bash
# すべてのテストを実行
go test ./...

# 詳細な出力付き
go test -v ./...

# 特定のパッケージのみ
go test -v ./internal/synth
go test -v ./internal/mouse
```

## コードのフォーマット

```bash
# すべてのGoファイルをフォーマット
go fmt ./...

# コードの静的解析
go vet ./...
```

## より詳しい情報

- [README.md](README.md): 詳細なドキュメント
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md): 実装計画書
- [COMPLETION_REPORT.md](COMPLETION_REPORT.md): 実装完了報告

## ライセンス

MIT License - 詳細は [LICENSE](../../LICENSE) を参照
