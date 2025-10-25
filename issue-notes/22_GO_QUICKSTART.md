# Go版 クイックスタートガイド (Windows)

## ⚠️ このドキュメントは古くなっています

**このドキュメントはMinGW/GCCを使用する古い手順を含んでいます。**

**最新のクイックスタートガイドはこちら:**
- **Pure Go版（推奨）**: [src/go/README.md](../src/go/README.md)
- **PortAudio版（Zig cc使用）**: [src/go-portaudio/QUICKSTART.md](../src/go-portaudio/QUICKSTART.md)

---

このガイドでは、Windows環境でGo版cat-oscillator-syncを動かす方法を説明します。

## ⚠️ 以下は古い情報です（MinGW/GCC使用）

**このセクション以降の内容は古くなっています。MinGW/GCCの代わりにZig ccを使用してください。**

## ⚠️ 重要: プリコンパイル版の利用を推奨（古い情報）

現在、Go版のビルドにはC言語コンパイラ（GCC/MinGW）のインストールが必要です。
プリコンパイル済みバイナリの配布を検討中です。実装され次第、こちらのドキュメントを更新します。

## 開発者向け: ローカルビルド手順

### 前提条件

- Windows 10/11
- Go 1.21以上がインストールされていること
- Python（PortAudio DLLのダウンロードに使用）

### ステップ1: GCCのインストール（必須）

#### TDM-GCC（推奨・簡単）

1. [TDM-GCC ダウンロードページ](https://jmeubank.github.io/tdm-gcc/) を開く
2. 最新の64bit版（例: tdm64-gcc-10.3.0-2.exe）をダウンロード
3. インストーラーを実行し、デフォルト設定でインストール
4. コマンドプロンプトを**新しく開いて**確認:
   ```cmd
   gcc --version
   ```
   以下のように表示されればOK:
   ```
   gcc.exe (tdm64-1) 10.3.0
   Copyright (C) 2020 Free Software Foundation, Inc.
   ```

#### MSYS2（より高度）

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

```cmd
# CGOを有効化（通常は自動だが念のため）
set CGO_ENABLED=1

# Simple版のビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple

# Smooth版のビルド
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

### ステップ4: 実行

```cmd
# bin ディレクトリに移動
cd bin

# Simple版
.\sync_simple.exe

# Smooth版
.\sync_smooth.exe
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

### ビルドエラー: "build constraints exclude all Go files"

このエラーはGCCが見つからない場合に発生します。

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

**確認方法**:
```cmd
go env CGO_ENABLED
```

**解決方法**:
- `0` と表示される場合は有効化:
  ```cmd
  set CGO_ENABLED=1
  ```

### それでも解決しない場合

詳細なエラーメッセージを確認:
```cmd
go build -v -x -o bin\sync_simple.exe .\cmd\sync_simple
```

このコマンドは詳細なビルドログを出力し、問題の特定に役立ちます。

## より詳しい情報

- [README.md](22_GO_README.md): 詳細なドキュメント
- [INVESTIGATION_CGO_ALTERNATIVES.md](22_GO_INVESTIGATION_CGO_ALTERNATIVES.md): CGO要件の調査報告
- [IMPLEMENTATION_PLAN.md](2_GO_IMPLEMENTATION_PLAN.md): 実装計画書

## ライセンス

MIT License - 詳細は [LICENSE](../../LICENSE) を参照
