# Go Implementation - Cat Oscillator Sync

🎵 Go版 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## 概要

Python版のcat-oscillator-syncをGoで実装したものです。
PortAudioを使用した低レイテンシなオーディオ出力と、クロスプラットフォーム対応のマウス位置取得を実現しています。

## 特徴

- **PortAudio使用**: Python版と同じPortAudioライブラリを使用し、一貫した音質を実現
- **クロスプラットフォーム**: Windows/Linux両対応
  - Windows: Win32 API (syscall) でマウス位置取得
  - Linux: xdotool でマウス位置取得
- **Pure Go + CGO**: 外部のGo依存関係を最小限に抑え、PortAudioのみ使用
- **2つのバージョン**:
  - **Simple版**: 8msごとに階段状に周波数が変化
  - **Smooth版**: サンプルごとの指数平滑化で滑らかな周波数変化

## 必要な環境

### 共通

- Go 1.21以上
- PortAudio ライブラリ

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install portaudio19-dev xdotool x11-utils

# Fedora/RHEL
sudo dnf install portaudio-devel xdotool xorg-x11-utils

# Arch Linux
sudo pacman -S portaudio xdotool xorg-xdpyinfo
```

### Windows

**重要**: Go版はCGO（C言語バインディング）を使用するため、以下の両方が必要です。

1. **GCC (CGO用コンパイラ) - 必須**:
   
   以下のいずれかをインストールしてください：
   
   - **TDM-GCC** (推奨・簡単):
     1. [TDM-GCC ダウンロードページ](https://jmeubank.github.io/tdm-gcc/) から最新版をダウンロード
     2. インストーラーを実行し、デフォルト設定でインストール
     3. コマンドプロンプトで `gcc --version` を実行して確認
   
   - **MSYS2** (より高度):
     1. [MSYS2](https://www.msys2.org/) をダウンロードしてインストール
     2. MSYS2ターミナルで以下を実行:
        ```bash
        pacman -S mingw-w64-x86_64-gcc
        ```
     3. システム環境変数PATHに `C:\msys64\mingw64\bin` を追加
   
   **確認方法**:
   ```bash
   gcc --version
   ```
   
   GCCが見つからない場合、ビルド時に以下のエラーが発生します:
   ```
   build constraints exclude all Go files
   ```

2. **PortAudio DLLのインストール**:
   
   自動ダウンロード（推奨）:
   ```bash
   cd src/go
   python download_portaudio.py
   ```
   
   または手動でダウンロード:
   - [GitHub spatialaudio/portaudio-binaries](https://github.com/spatialaudio/portaudio-binaries) から `libportaudio64bit.dll` をダウンロード
   - `libportaudio64bit.dll` を `src/go/bin/` ディレクトリに配置
   
   注: python-sounddeviceも同じソースから入手しており、安全性と可用性が高いと判断しています。

## ビルド

### Linux

```bash
cd src/go

# 依存関係のダウンロード
go mod download

# Simple版のビルド
go build -o bin/sync_simple ./cmd/sync_simple

# Smooth版のビルド
go build -o bin/sync_smooth ./cmd/sync_smooth
```

### Windows

**注意**: CGOを使用するため、必ずGCCがインストールされている必要があります。

```bash
cd src\go

# 依存関係のダウンロード
go mod download

# CGOを明示的に有効化（通常は自動だが念のため）
set CGO_ENABLED=1

# Simple版のビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple

# Smooth版のビルド
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

**ビルドエラーが発生する場合**:

1. GCCがインストールされているか確認:
   ```bash
   gcc --version
   ```

2. CGOが有効になっているか確認:
   ```bash
   go env CGO_ENABLED
   ```
   `1` と表示されればOK。`0` の場合は以下を実行:
   ```bash
   set CGO_ENABLED=1
   ```

3. それでもエラーが出る場合は、詳細なエラーメッセージを確認:
   ```bash
   go build -v -x -o bin\sync_simple.exe .\cmd\sync_simple
   ```

## 実行

### Simple版

```bash
# Linux
./bin/sync_simple

# Windows
.\bin\sync_simple.exe

# または直接実行
go run ./cmd/sync_simple
```

### Smooth版

```bash
# Linux
./bin/sync_smooth

# Windows
.\bin\sync_smooth.exe

# または直接実行
go run ./cmd/sync_smooth
```

## 使い方

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl+C` で終了

## プロジェクト構成

```
src/go/
├── go.mod                      # Go モジュール定義
├── go.sum                      # 依存関係のチェックサム
├── .gitignore                  # Git除外設定
├── README.md                   # このファイル
├── IMPLEMENTATION_PLAN.md      # 実装計画書
├── cmd/
│   ├── sync_simple/
│   │   └── main.go            # Simple版エントリポイント
│   └── sync_smooth/
│       └── main.go            # Smooth版エントリポイント
├── internal/
│   ├── mouse/
│   │   ├── position.go        # マウス位置取得 (共通インターフェース)
│   │   ├── position_linux.go  # Linux実装
│   │   └── position_windows.go # Windows実装
│   └── synth/
│       ├── simple.go          # Simple版シンセサイザー
│       └── smooth.go          # Smooth版シンセサイザー
└── bin/                       # ビルド出力 (gitignore)
```

## 技術詳細

### オーディオライブラリ

- **PortAudio (gordonklaus/portaudio)**: Python版と同じPortAudioを使用
- サンプルレート: 48000 Hz
- ブロックサイズ: 8ms分のサンプル (384サンプル)

### マウス位置取得

- **Linux**: xdotoolを使用してマウス座標を取得
- **Windows**: user32.dllの`GetCursorPos` APIを直接呼び出し (syscall)
- ポーリング間隔: 8ms (125Hz)

### ハードシンク実装

両バージョンとも、マスターオシレータの位相が1.0を超えたときにスレーブオシレータの位相を0にリセットします。

#### Simple版
```go
// マスター位相が1.0を超えたら
if s.phaseMaster >= 1.0 {
    s.phaseMaster -= 1.0
    s.phaseSlave = 0.0  // ハードシンク: スレーブ位相をリセット
}
```

#### Smooth版
```go
// サンプルごとに指数平滑化
tempFreqMaster += (targetFreqMaster - tempFreqMaster) * smoothnessCoeff
tempFreqSlave += (targetFreqSlave - tempFreqSlave) * smoothnessCoeff
```

### パラメータ設定

#### Smooth版のパラメータ

```go
const (
    sampleRate       = 48000  // サンプリングレート (Hz)
    timeConstantMs   = 16     // 時定数 (ms) - 約63%到達時間
    pollingIntervalMs = 8     // マウスポーリング間隔 (ms)
)
```

## トラブルシューティング

### Linux: xdotoolが見つからない

```bash
sudo apt-get install xdotool
```

### Linux: xdpyinfoが見つからない

```bash
sudo apt-get install x11-utils
```

### PortAudioが見つからない

Linuxの場合:
```bash
# pkg-configでPortAudioが見つかるか確認
pkg-config --modversion portaudio-2.0

# 見つからない場合はインストール
sudo apt-get install portaudio19-dev
```

Windowsの場合:
- DLLが実行ファイルと同じディレクトリにあるか確認
- または、システムのPATHにDLLの場所を追加

### "build constraints exclude all Go files" エラー

このエラーは通常、以下の原因で発生します:

1. **GCCがインストールされていない** (最も一般的):
   ```bash
   # 確認
   gcc --version
   ```
   GCCが見つからない場合、TDM-GCCまたはMSYS2をインストールしてください（上記参照）。

2. **CGOが無効になっている**:
   ```bash
   # 確認
   go env CGO_ENABLED
   ```
   `0` の場合は有効化:
   ```bash
   # Windows (cmd)
   set CGO_ENABLED=1
   
   # Windows (PowerShell)
   $env:CGO_ENABLED = "1"
   
   # Linux/Mac
   export CGO_ENABLED=1
   ```

3. **GCCのパスが通っていない**:
   - システム環境変数のPATHにGCCのbinディレクトリが含まれているか確認
   - TDM-GCC: `C:\TDM-GCC-64\bin`
   - MSYS2: `C:\msys64\mingw64\bin`

### その他のCGOエラー

pkg-configエラーが出る場合:
```bash
# Windowsの場合、PortAudio DLLをダウンロード
python download_portaudio.py
```

Linuxの場合:
```bash
# PortAudioの開発ライブラリをインストール
sudo apt-get install portaudio19-dev
```

## Python版との比較

| 項目 | Python | Go |
|------|--------|-----|
| 起動速度 | 遅い | 速い (コンパイル済み) |
| 実行速度 | 普通 | 速い |
| メモリ使用量 | 多い | 少ない |
| バイナリサイズ | - | 約2.8MB |
| インストール | pip (簡単) | ビルド必要 (やや複雑) |
| 依存関係管理 | requirements.txt | go.mod (自動) |

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。

## 参考資料

- [gordonklaus/portaudio](https://github.com/gordonklaus/portaudio) - PortAudio Go bindings
- [PortAudio公式サイト](http://www.portaudio.com/)
- [実装計画書](IMPLEMENTATION_PLAN.md)

