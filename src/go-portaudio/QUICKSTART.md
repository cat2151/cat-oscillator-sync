# Go PortAudio版 クイックスタートガイド (Zig cc使用)

このガイドでは、Windows環境でGo PortAudio版をZig ccを使ってビルドする方法を説明します。

## ⚠️ 重要

**Zig ccを使用します。**

一般ユーザーにはPure Go版（Oto）の使用を推奨します。詳細は [src/go/README.md](../go/README.md) を参照してください。

## 前提条件

- Windows 10/11
- Go 1.24以上がインストールされていること
- Python（PortAudio DLLのダウンロードに使用）

## ステップ1: Zigのインストール

### 方法1: 公式バイナリ（推奨）

1. [Zig ダウンロードページ](https://ziglang.org/download/) を開く
2. 最新版のZIPファイルをダウンロード（例: zig-windows-x86_64-0.11.0.zip）
3. ZIPファイルを適当な場所に解凍（例: `C:\zig`）
4. システム環境変数のPATHに追加:
   - スタートメニュー → 「環境変数」で検索
   - 「システム環境変数の編集」を開く
   - 「環境変数」ボタンをクリック
   - 「Path」を選択して「編集」
   - 「新規」をクリックして `C:\zig` を追加（解凍した場所）
5. コマンドプロンプトを**新しく開いて**確認:
   ```cmd
   zig version
   ```
   以下のように表示されればOK:
   ```
   0.11.0
   ```

### 方法2: Scoop（Windowsパッケージマネージャ）

Scoopがインストールされている場合:

```cmd
scoop install zig
```

## ステップ2: PortAudio DLLのダウンロード

```cmd
cd src\go-portaudio
python download_portaudio.py
```

このスクリプトは `libportaudio64bit.dll` を `bin/` ディレクトリにダウンロードします。

## ステップ3: ビルド

### 方法1: ビルドスクリプトを使用（推奨）

```cmd
cd src\go-portaudio
build.bat
```

### 方法2: 手動ビルド

```cmd
cd src\go-portaudio

REM Zigをコンパイラとして設定
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1

REM Simple版のビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple

REM Smooth版のビルド
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

## ステップ4: 実行

```cmd
cd bin

REM Simple版
sync_simple.exe

REM Smooth版
sync_smooth.exe
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

### ビルドエラー: "zig: command not found"

Zigが正しくインストールされているか確認:
```cmd
zig version
```

表示されない場合:
1. Zigが正しくインストールされているか確認
2. システム環境変数のPATHにZigのディレクトリが含まれているか確認
3. コマンドプロンプトを**閉じて新しく開く**（環境変数の変更を反映）

### ビルドエラー: "go: cannot find module"

依存関係をダウンロード:
```cmd
go mod download
```

### 実行時エラー: "DLLが見つからない"

`bin/` ディレクトリに `libportaudio64bit.dll` が存在することを確認してください。
存在しない場合は、`download_portaudio.py` を実行してください。

### それでも解決しない場合

詳細なエラーメッセージを確認:
```cmd
go build -v -x -o bin\sync_simple.exe .\cmd\sync_simple
```

このコマンドは詳細なビルドログを出力し、問題の特定に役立ちます。

## なぜZig ccを使うのか？

### Zig ccの利点

- **軽量**: 約60MB
- **シンプル**: ZIPを解凍するだけ
- **クロスコンパイル対応**: 標準で対応
- **最新**: LLVM/Clangベース
- **クリーン**: 依存関係が少ない

## より詳しい情報

- [README.md](../go-portaudio/README.md): 詳細なドキュメント
- [src/go/README.md](../go/README.md): Pure Go版（Oto）のドキュメント

## ライセンス

MIT License - 詳細は [LICENSE](../../LICENSE) を参照
