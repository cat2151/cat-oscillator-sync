# Go Implementation - Cat Oscillator Sync (Windows版)

🎵 Go版 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## 🎯 2つの実装方法

### ⭐ Oto版（推奨） - Pure Go実装

**C言語コンパイラ不要！簡単ビルド！**

- ✅ **Pure Go** - CGO不要、MinGW不要
- ✅ **簡単** - `go build`だけでビルド可能
- ✅ **環境を汚さない** - 追加のツールチェイン不要
- ✅ モノフォニックシンセには十分な性能

👉 **[README_OTO.md](44_GO_README_OTO.md) を参照してください**

### PortAudio版 - プロフェッショナル向け

**最高のパフォーマンスが必要な場合**

- ❌ **CGO必須** - C言語コンパイラ必須（MinGW/TDM-GCC等）
- ❌ **複雑** - 環境セットアップが必要
- ✅ 最高のレイテンシとパフォーマンス
- ✅ プロフェッショナル向け

---

## ⚠️ PortAudio版について

このPortAudio版はCGO（C言語バインディング）を使用しているため、ビルドには**C言語コンパイラが必要**です。

### なぜC言語コンパイラが必要なのか

PortAudio版は `gordonklaus/portaudio` パッケージを使用しており、このパッケージはC言語で書かれたPortAudioライブラリを呼び出すためにCGOを使用します。これは、以下の理由によるものです：

1. **PortAudioはC言語ライブラリ**: 低レベルなオーディオ制御のため、C言語で実装されている
2. **最高のパフォーマンスを実現**: プロフェッショナルなオーディオアプリケーションで使用される
3. **すべてのGo PortAudioバインディングがCGOを使用**: 技術的な制約により回避不可能

詳細は [INVESTIGATION_CGO_ALTERNATIVES.md](22_GO_INVESTIGATION_CGO_ALTERNATIVES.md) を参照してください。

## 推奨アプローチ

### オプション1: Oto版を使用（推奨）

**ほとんどのユーザーに推奨**

Pure Go実装のOto版を使用してください。詳細は [README_OTO.md](44_GO_README_OTO.md) を参照してください。

### オプション2: プリコンパイル済みバイナリを使用（計画中）

**状況**: 現在、別プロジェクトでのプリコンパイル済みバイナリ配布を検討中です。
実装されれば、PortAudio版もC言語コンパイラのインストールなしで使用できるようになります。

### オプション3: ローカルでビルド（開発者向け）

C言語コンパイラをインストールしてローカルでビルドすることも可能です。
ただし、以下の理由から一般ユーザーには推奨しません：

- セットアップが複雑
- MinGW等のツールチェインが必要
- 環境を汚す可能性がある

開発者向けの詳細な手順は、この後のセクションを参照してください。

## 開発者向け: ローカルビルド手順（Windows）

### 必要な環境

- Windows 10/11
- Go 1.21以上
- **C言語コンパイラ（以下のいずれか）**:
  - TDM-GCC（推奨・軽量）
  - MSYS2（より本格的な環境）
  - ⚠️ Visual Studio（MSVC）は現在サポート外（pkg-config依存のため）

### ステップ1: PortAudio DLLのダウンロード

```cmd
cd src\go
python download_portaudio.py
```

このスクリプトは `libportaudio64bit.dll` を `bin/` ディレクトリにダウンロードします。

### ステップ2: C言語コンパイラのインストール

#### TDM-GCC（推奨）

1. [TDM-GCC ダウンロードページ](https://jmeubank.github.io/tdm-gcc/) から最新の64bit版をダウンロード
2. インストーラーを実行（デフォルト設定でOK）
3. 確認:
   ```cmd
   gcc --version
   ```

#### MSYS2

1. [MSYS2](https://www.msys2.org/) をダウンロードしてインストール
2. MSYS2ターミナルで実行:
   ```bash
   pacman -S mingw-w64-x86_64-gcc
   ```
3. システムPATHに `C:\msys64\mingw64\bin` を追加
4. 確認:
   ```cmd
   gcc --version
   ```

### ステップ3: ビルド

```cmd
cd src\go

# CGOを有効化
set CGO_ENABLED=1

# ビルド
go build -o bin\sync_simple.exe .\cmd\sync_simple
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
```

### ステップ4: 実行

```cmd
# bin ディレクトリに移動（DLLが同じディレクトリにある必要がある）
cd bin

# 実行
.\sync_simple.exe
# または
.\sync_smooth.exe
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

## トラブルシューティング

### ビルドエラー: "build constraints exclude all Go files"

このエラーは、CGOが無効になっているか、C言語コンパイラが見つからない場合に発生します。

**解決方法**:
1. C言語コンパイラ（GCC）がインストールされているか確認:
   ```cmd
   gcc --version
   ```
2. CGOが有効になっているか確認:
   ```cmd
   go env CGO_ENABLED
   ```
   `0` の場合は有効化:
   ```cmd
   set CGO_ENABLED=1
   ```

### その他のエラー

詳細な調査レポートは [INVESTIGATION_CGO_ALTERNATIVES.md](22_GO_INVESTIGATION_CGO_ALTERNATIVES.md) を参照してください。

## プロジェクト構成

```
src/go/
├── go.mod                           # Go モジュール定義
├── go.sum                           # 依存関係のチェックサム
├── .gitignore                       # Git除外設定
├── README.md                        # このファイル
├── INVESTIGATION_CGO_ALTERNATIVES.md # CGO要件の調査報告
├── download_portaudio.py            # PortAudio DLLダウンロードスクリプト
├── cmd/
│   ├── sync_simple/
│   │   └── main.go                 # Simple版エントリポイント
│   └── sync_smooth/
│       └── main.go                 # Smooth版エントリポイント
├── internal/
│   ├── mouse/
│   │   ├── position.go             # マウス位置取得 (共通インターフェース)
│   │   ├── position_linux.go       # Linux実装
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

`gordonklaus/portaudio` パッケージは以下のようにCGOを使用してC言語のPortAudioライブラリを呼び出します:

```go
/*
#cgo pkg-config: portaudio-2.0
#include <portaudio.h>
extern PaStreamCallback* paStreamCallback;
*/
import "C"
```

これにより、低レベルなオーディオ制御が可能になりますが、ビルド時にC言語コンパイラが必要になります。

### オーディオライブラリ

- **PortAudio (gordonklaus/portaudio)**: Python版と同じPortAudioを使用
- サンプルレート: 48000 Hz
- ブロックサイズ: 8ms分のサンプル (384サンプル)

### マウス位置取得

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

## 関連ドキュメント

- [INVESTIGATION_CGO_ALTERNATIVES.md](22_GO_INVESTIGATION_CGO_ALTERNATIVES.md) - CGO要件の詳細な調査報告
- [IMPLEMENTATION_PLAN.md](2_GO_IMPLEMENTATION_PLAN.md) - 実装計画書
- [COMPLETION_REPORT.md](22_GO_COMPLETION_REPORT.md) - 実装完了報告

## ライセンス

このプロジェクトは [MIT License](../../LICENSE) の下で公開されています。
