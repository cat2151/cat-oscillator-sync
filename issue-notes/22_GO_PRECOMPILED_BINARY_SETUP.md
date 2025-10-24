# プリコンパイル済みバイナリ配布プロジェクトのセットアップ手順

このドキュメントは、別リポジトリでGo版バイナリをビルドして配布するためのガイドです。

## 概要

Go版cat-oscillator-syncはCGO（C言語バインディング）を使用するため、ビルドにはGCC/MinGWが必要です。
ユーザーの環境を汚さず、シンプルにバイナリを提供するため、別プロジェクトでビルドしたバイナリを配布します。

## 新規リポジトリの作成

### リポジトリ名
`cat-oscillator-sync-go-binaries`

### 推奨構成

```
cat-oscillator-sync-go-binaries/
├── .github/
│   └── workflows/
│       └── build-and-release.yml    # 自動ビルド設定
├── src/
│   └── (cat-oscillator-syncのsrc/goディレクトリをコピー)
├── scripts/
│   └── package-release.ps1          # リリースパッケージング用
├── README.md                         # 使用方法
└── LICENSE                           # MITライセンス
```

## GitHub Actions ビルド設定

`.github/workflows/build-and-release.yml`:

```yaml
name: Build and Release Go Binaries

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.21'
      
      - name: Setup MinGW
        uses: msys2/setup-msys2@v2
        with:
          update: true
          install: mingw-w64-x86_64-gcc
      
      - name: Add MinGW to PATH
        run: echo "C:\msys64\mingw64\bin" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
      
      - name: Verify GCC
        run: gcc --version
      
      - name: Download PortAudio DLL
        run: |
          cd src
          python download_portaudio.py
      
      - name: Enable CGO and Build
        run: |
          cd src
          $env:CGO_ENABLED = "1"
          go build -ldflags="-s -w" -o bin\sync_simple.exe .\cmd\sync_simple
          go build -ldflags="-s -w" -o bin\sync_smooth.exe .\cmd\sync_smooth
      
      - name: Create Release Package
        run: |
          mkdir release
          copy src\bin\sync_simple.exe release\
          copy src\bin\sync_smooth.exe release\
          copy src\bin\libportaudio64bit.dll release\
      
      - name: Upload Release Assets
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: |
            release/sync_simple.exe
            release/sync_smooth.exe
            release/libportaudio64bit.dll
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: windows-binaries
          path: release/
```

## ビルドされるファイル

| ファイル名 | サイズ | 説明 |
|-----------|--------|------|
| `sync_simple.exe` | 約2.8MB | Simple版実行ファイル |
| `sync_smooth.exe` | 約2.8MB | Smooth版実行ファイル |
| `libportaudio64bit.dll` | 約300KB | PortAudio DLL |

## 本リポジトリでの利用方法

### build_and_run.py の変更案

```python
def download_go_binaries(bin_dir: Path) -> bool:
    """Download precompiled Go binaries from GitHub releases"""
    import urllib.request
    
    base_url = "https://github.com/cat2151/cat-oscillator-sync-go-binaries/releases/latest/download"
    files = [
        "sync_simple.exe",
        "sync_smooth.exe",
        "libportaudio64bit.dll"
    ]
    
    log_info("プリコンパイル済みGoバイナリをダウンロード中...")
    
    for filename in files:
        url = f"{base_url}/{filename}"
        dest = bin_dir / filename
        
        try:
            urllib.request.urlretrieve(url, dest)
            log_success(f"ダウンロード完了: {filename}")
        except Exception as e:
            log_error(f"ダウンロード失敗: {filename} - {e}")
            return False
    
    return True

def build_go(script_dir: Path) -> None:
    """Build Go version"""
    log_info("[3/5] Go版をビルド中...")

    go_dir = script_dir / "src" / "go"
    bin_dir = go_dir / "bin"
    bin_dir.mkdir(exist_ok=True)

    # Check if binaries already exist
    simple_exe = bin_dir / "sync_simple.exe"
    smooth_exe = bin_dir / "sync_smooth.exe"
    
    if simple_exe.exists() and smooth_exe.exists():
        log_success("Go版: ビルド済みバイナリが見つかりました")
        return

    # Try to download precompiled binaries
    if download_go_binaries(bin_dir):
        log_success("Go版: プリコンパイル済みバイナリをダウンロードしました")
    else:
        log_warning("Go版のプリコンパイル済みバイナリのダウンロードに失敗しました。")
        log_warning("詳細は src/go/README.md を参照してください。")
```

## リリース手順

1. タグを作成してプッシュ:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. GitHub Actionsが自動的にビルドしてリリースを作成

3. リリースページで以下を確認:
   - sync_simple.exe
   - sync_smooth.exe
   - libportaudio64bit.dll

## ユーザー向けREADME例

別リポジトリの README.md:

```markdown
# Cat Oscillator Sync - Go版 プリコンパイル済みバイナリ

Windows向けのプリコンパイル済み実行ファイルです。

## ダウンロード

[最新リリース](https://github.com/cat2151/cat-oscillator-sync-go-binaries/releases/latest)から以下をダウンロード:

- `sync_simple.exe`
- `sync_smooth.exe`
- `libportaudio64bit.dll`

## 使い方

1. 3つのファイルを同じフォルダに配置
2. `sync_simple.exe` または `sync_smooth.exe` を実行
3. マウスを動かして音を制御
4. `Ctrl+C` で終了

## 注意事項

- すべてのファイルが同じディレクトリにある必要があります
- Windows 10/11 64bit版で動作します
- ウイルス対策ソフトが警告する場合がありますが、安全なプログラムです

## ソースコード

本体のリポジトリ: https://github.com/cat2151/cat-oscillator-sync

## ライセンス

MIT License
```

## 注意事項

### セキュリティ

- GitHub ActionsでビルドするためMinGWの使用は避けられない
- ただし、ユーザー環境にはインストール不要
- バイナリはGitHub Releasesから配布され、検証可能

### メンテナンス

- 本体リポジトリの変更に応じてバイナリを再ビルド
- バージョンタグで管理
- 自動化により手動ビルドの手間を削減

## まとめ

この方法により:
- ✅ ユーザーはGCC/MinGWのインストール不要
- ✅ シンプルで分かりやすい
- ✅ 環境を汚さない
- ✅ GitHub Actionsで自動化
- ✅ 本リポジトリがシンプルに保たれる
