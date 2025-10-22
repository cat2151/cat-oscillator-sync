# Windows ビルドエラーの修正方法

## エラー内容

Go版のビルド時に以下のエラーが発生する:

```
package github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple
        imports github.com/gordonklaus/portaudio: build constraints exclude all Go files in C:\app\go\pkg\mod\github.com\gordonklaus\portaudio@v0.0.0-20250206071425-98a94950218b
```

## 原因

このエラーは、Go版がCGO（C言語バインディング）を使用しているため、以下のいずれかが原因で発生します:

1. **GCCがインストールされていない** （最も一般的）
2. **GCCのパスが通っていない**
3. **CGOが無効になっている**

portaudioパッケージはC言語で書かれたPortAudioライブラリのGoバインディングであり、コンパイル時にGCCが必要です。

## 解決方法

### ステップ1: GCCのインストール

#### オプションA: TDM-GCC（推奨・簡単）

1. [TDM-GCC ダウンロードページ](https://jmeubank.github.io/tdm-gcc/) を開く
2. 最新の64bit版（例: tdm64-gcc-10.3.0-2.exe）をダウンロード
3. インストーラーを実行し、デフォルト設定でインストール
4. インストール後、コマンドプロンプトを**新しく開いて**確認:
   ```cmd
   gcc --version
   ```
   以下のように表示されればOK:
   ```
   gcc.exe (tdm64-1) 10.3.0
   Copyright (C) 2020 Free Software Foundation, Inc.
   ```

#### オプションB: MSYS2（より高度）

1. [MSYS2](https://www.msys2.org/) をダウンロードしてインストール
2. MSYS2ターミナルで以下を実行:
   ```bash
   pacman -S mingw-w64-x86_64-gcc
   ```
3. システム環境変数のPATHに `C:\msys64\mingw64\bin` を追加
4. コマンドプロンプトを**新しく開いて**確認:
   ```cmd
   gcc --version
   ```

### ステップ2: PortAudio DLLのダウンロード

```cmd
cd src\go
python download_portaudio.py
```

### ステップ3: ビルド

#### 方法A: build_and_run.pyを使用（推奨）

```cmd
python build_and_run.py
```

このスクリプトは自動的に:
- GCCの存在を確認
- CGO_ENABLED=1を設定
- ビルドを実行

#### 方法B: 手動ビルド

```cmd
cd src\go

# CGOを明示的に有効化
set CGO_ENABLED=1

# ビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

### ステップ4: 実行

```cmd
.\bin\sync_simple.exe
# または
.\bin\sync_smooth.exe
```

## トラブルシューティング

### GCCが見つからない

**症状**: `gcc --version` で「'gcc' は、内部コマンドまたは外部コマンド...」と表示される

**解決方法**:
1. GCCが正しくインストールされているか確認
2. システム環境変数のPATHにGCCのbinディレクトリが含まれているか確認:
   - スタートメニュー → 「環境変数」で検索
   - 「システム環境変数の編集」を開く
   - 「環境変数」ボタンをクリック
   - 「Path」を選択して「編集」
   - TDM-GCCの場合: `C:\TDM-GCC-64\bin` が含まれているか確認
   - MSYS2の場合: `C:\msys64\mingw64\bin` が含まれているか確認
3. コマンドプロンプトを**閉じて新しく開く**（環境変数の変更を反映）

### CGOが無効になっている

**症状**: ビルドエラーが続く

**確認方法**:
```cmd
go env CGO_ENABLED
```

**解決方法**:
- `0` と表示される場合は有効化:
  ```cmd
  set CGO_ENABLED=1
  ```
- または、システム環境変数として設定（永続的）

### それでも解決しない場合

詳細なエラーメッセージを確認:
```cmd
go build -v -x -o bin\sync_simple.exe .\cmd\sync_simple
```

このコマンドは詳細なビルドログを出力し、問題の特定に役立ちます。

## 参考リンク

- [README.md](README.md) - 完全なドキュメント
- [QUICKSTART.md](QUICKSTART.md) - クイックスタートガイド
- [TDM-GCC](https://jmeubank.github.io/tdm-gcc/) - Windows用GCCコンパイラ
- [MSYS2](https://www.msys2.org/) - Windows用UNIX環境

## 更新履歴

- 2025-10-22: Windows ビルドエラーの修正方法を文書化
