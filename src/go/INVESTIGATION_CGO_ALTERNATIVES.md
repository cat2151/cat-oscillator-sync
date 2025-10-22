# Go版PortAudio CGO要件の調査報告

## 問題の本質

`gordonklaus/portaudio` パッケージはCGO（C言語バインディング）を使用しており、以下のコードでC言語のPortAudioライブラリを直接呼び出しています：

```go
/*
#cgo pkg-config: portaudio-2.0
#include <portaudio.h>
extern PaStreamCallback* paStreamCallback;
*/
import "C"
```

これは、Goコードがネイティブなオーディオ機能にアクセスするために、C言語で書かれたPortAudioライブラリと連携する必要があるためです。

## なぜCGOが必要なのか

1. **PortAudioはC言語ライブラリ**: オーディオI/Oを扱うPortAudioはC言語で書かれており、Goから直接呼び出せない
2. **Pure GoのPortAudio実装は存在しない**: オーディオの低レベル制御は各OS固有のAPIを使う必要があり、Pure Goでの実装は現実的でない
3. **すべてのGo PortAudioバインディングがCGOを使用**: 他のパッケージも同様にCGOが必須

## 調査結果

### 1. MSBuild（MSVC）での実現可能性

**結論**: 現状では困難

**理由**:
- `gordonklaus/portaudio` は `pkg-config` を使用してPortAudioライブラリを検出
- `pkg-config` はUnix系ツールでWindowsでは標準で利用不可
- MSVCでコンパイルするには、パッケージの修正またはforkが必要

**実現する場合の要件**:
- Visual Studio または Build Tools for Visual Studio のインストール
- PortAudio の MSVC用ビルド
- `gordonklaus/portaudio` のforkとpkg-config依存の除去
- 環境変数 `CC=cl` の設定

**判断**: プロジェクトを複雑化させるため推奨しない

### 2. プリコンパイル済みバイナリの利用

**Go言語の制約**:
- Goは静的リンクを基本とするが、CGOを使用する場合は動的リンクが必要
- プリコンパイル済みのGoバイナリを配布することは可能だが、以下の問題がある：
  - PortAudio DLLへの依存が残る（現状と変わらない）
  - Go言語のクロスコンパイル特性を失う
  - ユーザー環境での柔軟なビルドができなくなる

**現在のアプローチ**:
- PortAudio DLLは既にプリコンパイル版を使用（`download_portaudio.py`で取得）
- 問題は、GoコードをコンパイルするためにGCCが必要な点

### 3. 別プロジェクトでのコンパイル担当

**提案**: Goバイナリをプリコンパイルして配布する専用プロジェクトを作成

#### 必要なビルドコマンド（Windows）

```cmd
# 環境設定
set CGO_ENABLED=1
set GOOS=windows
set GOARCH=amd64

# ビルド（GCCが必要）
go build -ldflags="-s -w" -o sync_simple.exe .\cmd\sync_simple
go build -ldflags="-s -w" -o sync_smooth.exe .\cmd\sync_smooth
```

#### 生成されるバイナリ

- `sync_simple.exe` - シンプル版実行ファイル（約2.8MB）
- `sync_smooth.exe` - スムーズ版実行ファイル（約2.8MB）
- `libportaudio64bit.dll` - PortAudio DLL（既存のダウンロードスクリプトで取得可能）

#### 配布プロジェクトの構成案

```
cat-oscillator-sync-go-binaries/
├── .github/
│   └── workflows/
│       └── build.yml          # GitHub Actionsでビルド
├── releases/
│   └── windows/
│       ├── sync_simple.exe
│       ├── sync_smooth.exe
│       └── libportaudio64bit.dll
└── README.md
```

#### GitHub Actionsビルド設定例

```yaml
name: Build Go Binaries

on:
  push:
    tags:
      - 'v*'

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Setup MinGW
        uses: msys2/setup-msys2@v2
        with:
          install: mingw-w64-x86_64-gcc
      
      - name: Download PortAudio DLL
        run: python download_portaudio.py
      
      - name: Build
        run: |
          go build -ldflags="-s -w" -o sync_simple.exe .\cmd\sync_simple
          go build -ldflags="-s -w" -o sync_smooth.exe .\cmd\sync_smooth
      
      - name: Upload Release
        uses: softprops/action-gh-release@v1
        with:
          files: |
            sync_simple.exe
            sync_smooth.exe
            bin/libportaudio64bit.dll
```

#### 本リポジトリでの利用方法

```cmd
# プリコンパイル版のダウンロード
curl -L -o sync_simple.exe https://github.com/cat2151/cat-oscillator-sync-go-binaries/releases/latest/download/sync_simple.exe
curl -L -o sync_smooth.exe https://github.com/cat2151/cat-oscillator-sync-go-binaries/releases/latest/download/sync_smooth.exe
curl -L -o libportaudio64bit.dll https://github.com/cat2151/cat-oscillator-sync-go-binaries/releases/latest/download/libportaudio64bit.dll

# 実行
.\sync_simple.exe
```

## 推奨アプローチ

### オプションA: プリコンパイル済みバイナリの配布（推奨）

**メリット**:
- ユーザーはGCC/MinGWをインストール不要
- シンプルで分かりやすい
- GitHub ActionsでCI/CDを自動化可能

**デメリット**:
- 別プロジェクトの管理が必要
- バイナリのメンテナンスコスト

**実装手順**:
1. 別リポジトリ `cat-oscillator-sync-go-binaries` を作成
2. GitHub Actionsで自動ビルド設定
3. リリースを作成してバイナリを配布
4. 本リポジトリの `build_and_run.py` でバイナリをダウンロード

### オプションB: 現状維持（GCC/MinGWが必要）

**メリット**:
- ローカルでビルド可能（開発者向け）
- ソースコードの透明性

**デメリット**:
- ユーザーにGCC/MinGWのインストールを要求
- セットアップが複雑

## まとめ

1. **CGOは技術的に必須**: PortAudioのC言語バインディングのため回避不可
2. **MSBuildは現実的でない**: pkg-config依存の問題があり、複雑化する
3. **最適解**: 別プロジェクトでプリコンパイルしたバイナリを配布
4. **実装が容易**: GitHub Actionsで自動化できる

次のステップとして、オプションAの実装をお勧めします。
