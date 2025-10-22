# Go版 実装計画書

## 概要
Python版のcat-oscillator-syncをGoで実装する計画書です。
Windows環境でのローカル実行を前提とし、PortAudio系のライブラリを使用します。

## 目標
- Python版と同等の機能（マウス制御によるハードシンク・オシレータ）を実装
- Windows環境で動作
- 低レイテンシな音声出力
- シンプルなインストールと実行手順

## ライブラリ選定

### 1. オーディオ出力ライブラリ

**選択肢A: gordonklaus/portaudio (推奨)**
- **メリット:**
  - PortAudioの公式Goバインディング
  - Python版と同じPortAudioを使用（一貫性）
  - 活発に開発されている
  - 低レイテンシに対応
- **デメリット:**
  - Windows環境ではPortAudioのDLLが必要
  - **DLLインストール方法:**
    1. 自動ダウンロード（推奨）: `python download_portaudio.py`
    2. または手動で [GitHub spatialaudio/portaudio-binaries](https://github.com/spatialaudio/portaudio-binaries) から `libportaudio64bit.dll` をダウンロード
    3. DLLを `bin/` ディレクトリに配置
  - または、MSYS2/MinGWでビルド環境を整える必要がある
- **GitHub:** https://github.com/gordonklaus/portaudio
- **ドキュメント:** GoDoc参照

**選択肢B: hajimehoshi/oto**
- **メリット:**
  - Pure Goライブラリ（外部DLL不要）
  - クロスプラットフォーム対応
  - シンプルなAPI
  - Windows, macOS, Linux, ブラウザ対応
- **デメリット:**
  - PortAudioではない（要件から外れる）
  - レイテンシがPortAudioより若干高い可能性
- **GitHub:** https://github.com/hajimehoshi/oto
- **ドキュメント:** GoDoc参照

**選択肢C: ebitengine/oto (oto v3)**
- otoの最新版
- よりモダンなAPI設計
- Pure Go実装
- **GitHub:** https://github.com/ebitengine/oto

**結論:**
- **要件重視（PortAudio使用）:** gordonklaus/portaudio
- **シンプル重視（Pure Go）:** ebitengine/oto
- **推奨:** gordonklaus/portaudio（要件に従う）ただし、DLLインストールの複雑さに注意

### 2. マウス位置取得ライブラリ

**選択: go-vgo/robotgo**
- **メリット:**
  - クロスプラットフォーム対応
  - マウス位置取得が簡単
  - キーボード・マウス操作も可能
- **デメリット:**
  - C言語の依存関係がある（CGO使用）
  - Windows環境では追加のツール（GCC）が必要になる可能性
- **GitHub:** https://github.com/go-vgo/robotgo
- **ドキュメント:** https://pkg.go.dev/github.com/go-vgo/robotgo

**代替案: micmonay/keybd_event + システムコール**
- より軽量だが、マウス位置取得には別ライブラリが必要

**代替案: Windows API直接呼び出し (syscall)**
- `user32.dll`の`GetCursorPos`を直接呼び出し
- Windows専用になるが、外部依存なし
- **推奨:** シンプルさを重視する場合

### 3. 数値計算
**選択: 標準ライブラリ (math パッケージ)**
- Goの標準ライブラリで十分
- 追加のライブラリは不要

## プロジェクト構成

```
src/go/
├── go.mod                  # Go モジュール定義
├── go.sum                  # 依存関係のチェックサム
├── IMPLEMENTATION_PLAN.md  # 本ドキュメント
├── README.md              # 実装後のREADME
├── cmd/
│   ├── sync_simple/
│   │   └── main.go        # シンプル版エントリポイント
│   └── sync_smooth/
│       └── main.go        # スムーズ版エントリポイント
└── internal/
    ├── synth/
    │   ├── simple.go      # シンプル版実装
    │   └── smooth.go      # スムーズ版実装
    └── mouse/
        └── position.go    # マウス位置取得
```

## 依存関係 (go.mod)

### オプション1: PortAudio使用
```go
module github.com/cat2151/cat-oscillator-sync/go

go 1.21

require (
    github.com/gordonklaus/portaudio v0.0.0-20230709114228-aafa478834f5
    github.com/go-vgo/robotgo v0.100.10
)
```

### オプション2: Pure Go (oto使用)
```go
module github.com/cat2151/cat-oscillator-sync/go

go 1.21

require (
    github.com/ebitengine/oto/v3 v3.1.0
    github.com/go-vgo/robotgo v0.100.10
)
```

## 実装計画

### Phase 1: 基本構造の実装
1. Go modulesの初期化
2. ライブラリの選定と動作確認
3. オーディオ出力の基本動作確認

### Phase 2: シンプル版の実装
1. マウス位置取得モジュールの実装
2. 周波数マッピング関数の実装
3. ハードシンク・オシレータの実装
   - マスターオシレータ（位相管理）
   - スレーブオシレータ（位相リセット）
4. オーディオストリームコールバックの実装
5. メインループの実装
6. 動作確認とデバッグ

### Phase 3: スムーズ版の実装
1. 指数平滑化アルゴリズムの実装
2. サンプルごとの周波数補間
3. パラメータ設定構造体の実装
4. 動作確認とデバッグ

### Phase 4: ドキュメント整備
1. README.mdの更新
2. コードコメントの追加（GoDoc形式）
3. ビルド・実行手順の文書化

## インストール手順（想定）

### 前提条件

#### オプション1: PortAudio使用の場合
1. **Go 1.21以上**
   - https://golang.org/dl/ からインストール
   
2. **PortAudio DLL (Windows)**
   - **方法A: 自動ダウンロード（推奨）**
     ```bash
     cd src/go
     python download_portaudio.py
     ```
     このスクリプトは [GitHub spatialaudio/portaudio-binaries](https://github.com/spatialaudio/portaudio-binaries) から `libportaudio64bit.dll` を自動ダウンロードします。
     python-sounddeviceも同じソースから入手しており、安全性と可用性が高いと判断しています。
   
   - **方法B: MSYS2でビルド**
     1. MSYS2をインストール: https://www.msys2.org/
     2. MinGW-w64環境を構築
     3. PortAudioをソースからビルド
     ```bash
     pacman -S mingw-w64-x86_64-portaudio
     ```

3. **GCC (CGO用)**
   - MinGW-w64またはMSYS2のGCC
   - TDM-GCC: https://jmeubank.github.io/tdm-gcc/

#### オプション2: Pure Go (oto)の場合
1. **Go 1.21以上のみ**
   - 外部DLL不要
   - CGOも不要（ただしrobotgoはCGO使用）

### ビルドと実行

```bash
# リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go

# 依存関係のダウンロード
go mod download

# ビルド - シンプル版
go build -o bin/sync_simple.exe ./cmd/sync_simple

# ビルド - スムーズ版
go build -o bin/sync_smooth.exe ./cmd/sync_smooth

# 実行
.\bin\sync_simple.exe
.\bin\sync_smooth.exe
```

または直接実行:
```bash
go run ./cmd/sync_simple
go run ./cmd/sync_smooth
```

## 開発環境構築の複雑度評価

### オプション1: PortAudio使用 ⭐⭐⭐ (中程度)

**複雑な点:**
1. **PortAudio DLLのインストール:**
   - 手作業でDLLをダウンロード・配置
   - またはMSYS2環境の構築
2. **CGOのための GCC:**
   - MinGW-w64のインストールが必要
   - 環境変数の設定

**手順数:**
1. Goのインストール
2. GCCのインストール（MinGW-w64）
3. PortAudio DLLの配置
4. `go build`の実行

**Python版との比較:**
- Python版: Python + pip + 3パッケージ（シンプル）
- Go版（PortAudio）: Go + GCC + PortAudio DLL（やや複雑）
- **結論:** Python版より複雑

### オプション2: Pure Go (oto使用) ⭐⭐⭐⭐ (比較的簡単)

**理由:**
1. **外部DLL不要:** oto自体はPure Go
2. **ただしrobotgoはCGO使用:** GCCが依然として必要
3. **PortAudioではない:** 要件から外れる

**手順数:**
1. Goのインストール
2. GCCのインストール（robotgo用）
3. `go build`の実行

### オプション3: 完全Pure Go (マウス位置もsyscall) ⭐⭐⭐⭐⭐ (最もシンプル)

**変更点:**
- robotgoの代わりにWindows APIを直接呼び出し
- `user32.dll`の`GetCursorPos`を使用

**手順数:**
1. Goのインストール
2. `go build`の実行

**結論:** 最もシンプルだが、Windows専用コードになる

## 技術的課題と対策

### 1. PortAudio DLLの配布
**課題:** ユーザーがDLLを手動インストールする必要
**対策:**
- DLLを実行ファイルと同梱して配布
- インストーラーの作成
- または、otoを使用してDLL不要にする

### 2. CGO依存
**課題:** クロスコンパイルが困難
**対策:**
- Windows環境でのみビルド
- CI/CDでバイナリを自動ビルド

### 3. ゴルーチンとオーディオコールバック
**課題:** リアルタイム処理での同期
**対策:**
- channelまたはsync.Mutexで安全な共有
- atomic操作の使用

## パフォーマンス期待値

### メリット
- **コンパイル済みバイナリ:** Python版より高速
- **低いメモリ使用量:** ガベージコレクションが効率的
- **並行処理:** ゴルーチンによる効率的な並行実行

### Python版との比較
- 起動速度: Go版がやや速い
- 実行速度: Go版が速い（ただし、体感差は小さい）
- メモリ使用量: Go版が少ない

## リスクと軽減策

### リスク1: PortAudio DLLの配布・インストールの複雑さ
**軽減策:**
- オプションとしてoto版も提供
- DLL同梱版のリリース

### リスク2: CGO依存によるビルドの複雑さ
**軽減策:**
- ビルド済みバイナリの提供
- Pure Go版の検討

### リスク3: robotgoの安定性
**軽減策:**
- Windows API直接呼び出しへの切り替え可能な設計

## 成功基準

1. ✅ Windows環境で動作すること
2. ✅ Python版と同等の音質・レスポンスを実現
3. ⚠️ インストール手順が5ステップ以内
4. ❌ 外部DLLの手動インストールが必要（PortAudio使用時）
5. ✅ ビルド時間が3分以内

## 推奨実装アプローチ

### アプローチA: 要件準拠（PortAudio）
- gordonklaus/portaudio + robotgo
- **優先度:** ⭐⭐⭐
- **複雑度:** 中
- **Python版との一貫性:** 高

### アプローチB: シンプル重視（Pure Go寄り）
- ebitengine/oto + Windows API (syscall)
- **優先度:** ⭐⭐⭐⭐
- **複雑度:** 低
- **Python版との一貫性:** 低（PortAudioではない）

### アプローチC: ハイブリッド
- gordonklaus/portaudio + Windows API (syscall)
- **優先度:** ⭐⭐⭐⭐
- **複雑度:** 中
- **Python版との一貫性:** 高（オーディオのみ）

**推奨: アプローチC**
- PortAudioで要件を満たしつつ、マウス位置取得をシンプルに

## 参考資料

### 公式ドキュメント
- Go公式サイト: https://golang.org/
- gordonklaus/portaudio: https://github.com/gordonklaus/portaudio
- ebitengine/oto: https://github.com/ebitengine/oto
- robotgo: https://github.com/go-vgo/robotgo

### Windows API参照
- GetCursorPos: https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-getcursorpos

## タイムライン（想定）

- Phase 1: 2-3時間（環境構築含む）
- Phase 2: 3-4時間
- Phase 3: 2-3時間
- Phase 4: 1-2時間
- **合計:** 8-12時間（LLMエージェントによる実装を想定）

## まとめ

Go版の実装は**技術的に実現可能**ですが、**開発環境構築がやや複雑**です。

**課題:**
- PortAudio使用時、Windows環境でDLLの手動配置が必要
- CGO依存により、GCC（MinGW-w64）のインストールが必要

**推奨:**
- **要件重視:** PortAudio + Windows API (syscall) でマウス位置取得
- **シンプル重視:** Pure Goライブラリ（oto）の使用も検討価値あり

**優先度評価: ⭐⭐⭐ (中程度)**

Python版やRust版と比較すると、開発環境構築の複雑さが若干高くなります。
ただし、実装自体はGoの豊富な標準ライブラリにより、比較的スムーズに進むと予想されます。
