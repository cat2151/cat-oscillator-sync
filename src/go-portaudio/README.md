# Go PortAudio版 - Cat Oscillator Sync (Zig cc使用)

🎵 Go + PortAudio版 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## ⚠️ 重要

このPortAudio版は、**Zig cc**を使用してビルドします。
MinGWやTDM-GCCは**使用しません**。

Pure Go版（Oto）を使用したい場合は、[../go/](../go/)ディレクトリを参照してください。

## 📋 必要な環境

- Windows 10/11
- Go 1.24以上
- **Zig 0.11以上** （C言語コンパイラの代わり）

## 🔧 Zigのインストール

### 方法1: 公式バイナリ（推奨）

1. [Zig ダウンロードページ](https://ziglang.org/download/) から最新版をダウンロード
2. ZIPファイルを解凍（例: `C:\zig`）
3. システム環境変数のPATHに追加（例: `C:\zig`）
4. 確認:
   ```cmd
   zig version
   ```

### 方法2: Scoop（Windows パッケージマネージャ）

```cmd
scoop install zig
```

## 🚀 ビルド方法

### ステップ1: PortAudio DLLのダウンロード

```cmd
cd src\go-portaudio
python download_portaudio.py
```

このスクリプトは `libportaudio64bit.dll` を `bin/` ディレクトリにダウンロードします。

### ステップ2: Zig ccを使用してビルド

```cmd
cd src\go-portaudio

REM Zigをコンパイラとして使用
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1

REM Simple版をビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple

REM Smooth版をビルド
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

または、提供されているビルドスクリプトを使用:

```cmd
build.bat
```

## 🎮 実行方法

```cmd
cd bin

REM Simple版を実行
sync_simple.exe

REM Smooth版を実行
sync_smooth.exe
```

## 使い方

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl+C` で終了

## バージョンの違い

### Simple版
- 8msごとに周波数が階段状に変化
- マウスを素早く動かすと、音が段階的に変化する
- シンプルな実装で理解しやすい

### Smooth版
- サンプルごとに滑らかに周波数が変化
- 指数平滑化により自然な音の遷移
- より音楽的で実用的

## なぜZig ccを使うのか？

### Zigの利点

- **シンプル**: 単一バイナリ、依存関係なし
- **クロスコンパイル対応**: 追加ツール不要でクロスコンパイル可能
- **軽量**: MinGW（数GB）に比べて非常に軽量（約60MB）
- **最新のツールチェイン**: 最新のLLVM/Clangベース
- **環境を汚さない**: インストールが簡単、アンインストールも簡単

### MinGWとの比較

| 項目 | Zig cc | MinGW/TDM-GCC |
|------|--------|---------------|
| サイズ | ~60MB | 数GB |
| インストール | ZIPを解凍するだけ | インストーラー実行 |
| クロスコンパイル | 標準対応 | 追加ツール必要 |
| 依存関係 | なし | 多数のライブラリ |
| PATH汚染 | 最小限 | 多数のバイナリ |

## トラブルシューティング

### ビルドエラー: "zig: command not found"

Zigが正しくインストールされているか、PATHに追加されているか確認してください。

```cmd
zig version
```

### ビルドエラー: "portaudio.h not found"

これは正常です。PortAudioのヘッダーファイルはDLLに含まれており、
`gordonklaus/portaudio`パッケージが自動的に処理します。

### 実行時エラー: "DLLが見つからない"

`bin/` ディレクトリに `libportaudio64bit.dll` が存在することを確認してください。
存在しない場合は、`download_portaudio.py` を実行してください。

## プロジェクト構成

```
src/go-portaudio/
├── go.mod                           # Go モジュール定義
├── .gitignore                       # Git除外設定
├── README.md                        # このファイル
├── download_portaudio.py            # PortAudio DLLダウンロードスクリプト
├── build.bat                        # Windowsビルドスクリプト
├── cmd/
│   ├── sync_simple/
│   │   └── main.go                 # Simple版エントリポイント
│   └── sync_smooth/
│       └── main.go                 # Smooth版エントリポイント
├── internal/
│   ├── mouse/
│   │   ├── position.go             # マウス位置取得 (共通インターフェース)
│   │   ├── position_stub.go        # スタブ実装
│   │   └── position_windows.go     # Windows実装
│   └── synth/
│       ├── simple.go               # Simple版シンセサイザー
│       └── smooth.go               # Smooth版シンセサイザー
└── bin/                            # ビルド出力 (gitignore)
    ├── sync_simple.exe             # Simple版実行ファイル
    ├── sync_smooth.exe             # Smooth版実行ファイル
    └── libportaudio64bit.dll       # PortAudio DLL
```

## 技術詳細

### CGO使用の理由

`gordonklaus/portaudio` パッケージはCGOを使用してC言語のPortAudioライブラリを呼び出します。
これにより、低レベルなオーディオ制御が可能になります。

### Zig ccとCGO

Zig ccは、Clang/LLVMベースの完全なC/C++コンパイラとして機能し、
GoのCGOが必要とするすべての機能を提供します。

### オーディオライブラリ

- **PortAudio (gordonklaus/portaudio)**: クロスプラットフォームオーディオI/Oライブラリ
- サンプルレート: 48000 Hz
- ブロックサイズ: 8ms分のサンプル (384サンプル)

### マウス位置取得

- **Windows**: user32.dllの`GetCursorPos` APIを直接呼び出し (syscall)
- ポーリング間隔: 8ms (125Hz)

## Pure Go版との比較

このプロジェクトには2つのGo実装があります：

### go-portaudio版（このディレクトリ）
- ✅ 最高のレイテンシとパフォーマンス
- ✅ プロフェッショナル向け
- ❌ Zigが必要（CGO使用）
- ⚠️ セットアップがやや複雑

### go版（Oto使用）
- ✅ Pure Go - コンパイラ不要
- ✅ 簡単ビルド - `go build`だけ
- ✅ 環境を汚さない
- ✅ モノフォニックシンセには十分な性能
- ⚠️ レイテンシは若干劣る可能性

**一般ユーザーにはgo版（Oto）を推奨します。**

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
