# Oto版クイックスタート

## 🚀 最も簡単な方法で音を出す

### Windows上でビルド

```cmd
cd src\go
go build -o bin\sync_simple_oto.exe .\cmd\sync_simple_oto
bin\sync_simple_oto.exe
```

たったこれだけです！**C言語コンパイラもMinGWも不要**です。

### Linux/macOS上でWindows版をビルド

```bash
cd src/go
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto
```

生成された `bin/sync_simple_oto.exe` をWindows PCにコピーして実行するだけです。

## 📦 配布用バイナリの作成

Oto版は完全にスタンドアロンです。実行ファイル1つで動作します：

```cmd
REM シンプル版とスムーズ版の両方をビルド
go build -o bin\sync_simple_oto.exe .\cmd\sync_simple_oto
go build -o bin\sync_smooth_oto.exe .\cmd\sync_smooth_oto

REM bin\sync_simple_oto.exe と bin\sync_smooth_oto.exe を配布
REM DLL不要、ランタイム不要、そのまま実行可能！
```

## 🔄 PortAudio版との比較

| 項目 | Oto版 ⭐推奨 | PortAudio版 |
|-----|------------|------------|
| ビルドの簡単さ | ✅ `go build`だけ | ❌ C言語コンパイラ必須 |
| クロスコンパイル | ✅ 簡単 | ❌ 困難 |
| 依存関係 | ✅ なし | ❌ libportaudio64bit.dll必要 |
| バイナリサイズ | 3.0 MB | 小さい + DLL |
| レイテンシ | 良好（20ms） | 最高（8ms） |
| 用途 | ⭐ 一般ユーザー | プロフェッショナル |

## 💡 どちらを選ぶべきか？

### Oto版を選ぶべき場合（ほとんどのケース）
- ✅ すぐに試したい
- ✅ ビルド環境を汚したくない
- ✅ 簡単に配布したい
- ✅ クロスコンパイルしたい
- ✅ モノフォニックシンセには十分な性能

### PortAudio版を選ぶべき場合
- プロフェッショナルなオーディオアプリケーション
- 最低レイテンシが必要
- すでにMinGWやTDM-GCCがインストール済み

## 🎮 使い方

プログラムを実行すると、以下のようなメッセージが表示されます：

```
🎵 Cat Oscillator Sync - Simple Version with Oto (Go)
マウスを動かして音を制御してください
X軸: マスター周波数 (40Hz - 600Hz)
Y軸: スレーブ周波数 (100Hz - 2000Hz)
Press Ctrl+C to exit

※ Pure Go実装 (CGO不要)

Screen size: 1920x1080
Audio context initialized
Buffer size: 20ms

Audio stream started

マウスを動かして音を制御してください (Ctrl+C で終了)
```

マウスを動かすと音が変化します。`Ctrl+C` で終了します。

## 📚 詳細情報

詳しい情報は以下を参照してください：

- [README_OTO.md](README_OTO.md) - Oto版の詳細な説明
- [README.md](README.md) - PortAudio版の説明
- [INVESTIGATION_CGO_ALTERNATIVES.md](INVESTIGATION_CGO_ALTERNATIVES.md) - CGOについての調査

## 🐛 トラブルシューティング

### Goのバージョンが古い

```cmd
go version
```

Go 1.24以上が必要です。[go.dev](https://go.dev/dl/)からダウンロードしてください。

### 音が出ない

1. Windowsのサウンド設定を確認
2. 他のオーディオアプリを閉じる
3. 管理者権限で実行してみる

### 音が途切れる

`main.go`の`bufferSizeMs`を大きくしてください（デフォルト: 20ms → 40ms）
