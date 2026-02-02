# cat-oscillator-sync

🎵 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

## ⚠️ ブラウザ版について（削除済み）

**ブラウザ版は削除されました**

Coding agentが生成したブラウザ版のコードにハルシネーション（幻覚）があり、正常に動作しませんでした。
具体的には、TypeScript（.ts）ファイルをAudioWorkletモジュールとして直接ロードしようとしており、
ブラウザはJavaScript（.js）ファイルしか実行できないため、初手でエラーが発生していました。

修正するには適切なビルドプロセスの構築が必要ですが、他の優先すべきタスクに時間を使うため、
ブラウザ版は削除しました。

**代替案**: より低レイテンシで安定した動作を求める場合は、以下の実装をご利用ください：
- **Python版** - pipxで1行インストール、レイテンシ約8ms
- **Rust版** - 高速で低レイテンシ（約8ms）
- **Go版（Pure Go - Oto）** - CGO不要、セットアップが簡単

---

## 📦 実装状況とインストール方法

このプロジェクトは、同じオシレータシンクアルゴリズムを複数の言語で実装しています。
各実装には**Simple版**（8msごとに階段状の周波数変化）と**Smooth版**（1サンプルごとの滑らかな周波数変化）があります。

### 🐍 Python版

**状態**: ✅ 完全動作

**ワンライナーインストール（推奨）**:
```bash
pipx install git+https://github.com/cat2151/cat-oscillator-sync
```

**実行**:
```bash
cat-oscillator-sync-simple  # Simple版
cat-oscillator-sync-smooth  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync
pip install -r requirements.txt
python src/python/sync_simple.py
```

**詳細**: [Pythonでシンセサイザーのオシレータシンクのサウンドを50行で鳴らして楽しむ](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)

---

### 🦀 Rust版

**状態**: ✅ 完全動作

**ワンライナーインストール**:
```bash
cargo install --git https://github.com/cat2151/cat-oscillator-sync --root . cat-oscillator-sync
```

インストール後、バイナリは `./bin/` ディレクトリに配置されます。

**実行**:
```bash
./bin/sync_simple  # Simple版
./bin/sync_smooth  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/rust
cargo build --release
cargo run --release --bin sync_simple
```

**特徴**:
- ✅ 高速でメモリ安全な実装
- ✅ 低レイテンシ（約8ms）
- ✅ ワンライナーでインストール可能

---

### 🐹 Go版（Pure Go - Oto）⭐推奨

**状態**: ✅ 完全動作・C言語コンパイラ不要

**ワンライナーインストール**:
```bash
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple_oto@latest
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_smooth_oto@latest
```

**実行**:
```bash
sync_simple_oto  # Simple版
sync_smooth_oto  # Smooth版
```

**従来の方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go
go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto
go build -o bin/sync_smooth_oto.exe ./cmd/sync_smooth_oto
./bin/sync_simple_oto.exe
```

**特徴**:
- ✅ Pure Go実装 - CGO不要、C言語コンパイラ不要
- ✅ 簡単ビルド - `go build`だけでビルド可能
- ✅ クロスコンパイル対応

**詳細**: [src/go/README.md](src/go/README.md)

---

### 🐹 Go版（PortAudio + Zig cc）

**状態**: ✅ 完全動作・Zig ccが必要

**インストール方法**:

この版はZig ccを使用するため、ワンライナーインストールは推奨しません。
環境構築が必要なため、以下の手順に従ってください：

```bash
# 1. Zigのインストール（まだの場合）
scoop install zig  # または公式サイトからダウンロード

# 2. リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/go-portaudio

# 3. PortAudio DLLのダウンロード
python download_portaudio.py

# 4. ビルド
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1
go build -o bin/sync_simple.exe ./cmd/sync_simple
go build -o bin/sync_smooth.exe ./cmd/sync_smooth
```

**実行**:
```bash
cd bin
sync_simple.exe  # Simple版
sync_smooth.exe  # Smooth版
```

**特徴**:
- ✅ 最高のレイテンシとパフォーマンス
- ❌ Zig ccが必要（CGO使用）
- ⚠️ セットアップがやや複雑

**一般ユーザーにはPure Go版（Oto）を推奨します。**

**詳細**: [src/go-portaudio/README.md](src/go-portaudio/README.md)

---

### 💻 TypeScript版（CLI - Windows専用）

**状態**: ✅ 動作中・バッファ遅延あり（約170ms）

**インストール方法**:

```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/cli
npm install
npm run build
```

**実行**:
```bash
npm start              # Simple版
node dist/main.js smooth  # Smooth版
```

**注意事項**:
- ⚠️ Windows専用（robotjs、naudiodonのネイティブモジュール依存）
- ⚠️ バッファ遅延約170ms（naudiodonの制限）
- ⚠️ Visual Studio Build Toolsが必要

**特徴**:
- ✅ Node.jsベースのCLI実装
- ⚠️ レイテンシは他の実装より高い（約170ms）

**より低レイテンシが必要な場合は、Python版、Rust版、Go版を推奨します。**

**詳細**: [src/typescript/cli/README.md](src/typescript/cli/README.md)

---

## 📊 実装の比較

| 言語 | 状態 | インストール難易度 | レイテンシ | 推奨度 |
|------|------|-------------------|----------|--------|
| Python | ✅ | ⭐⭐⭐⭐⭐（pipx 1行） | 約8ms | ⭐⭐⭐⭐⭐ |
| Go (Pure Go - Oto) | ✅ | ⭐⭐⭐⭐（go install） | 約16ms | ⭐⭐⭐⭐ |
| Rust | ✅ | ⭐⭐⭐（cargo install） | 約8ms | ⭐⭐⭐⭐ |
| Go (PortAudio) | ✅ | ⭐⭐（Zig cc必要） | 約8ms | ⭐⭐⭐ |
| TypeScript (CLI) | ✅ | ⭐⭐（ビルドツール必要） | 約170ms | ⭐⭐ |

---

## 🎮 使い方

すべての実装で共通の操作方法：

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
   - **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
   - **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl + C` で終了

---

## 🔧 全アプリケーションの一括ビルド＆実行（Windows専用）

すべての言語版を一度にビルドし、メニューから選んで実行できます：

```bash
python build_and_run.py
```

このスクリプトは、各言語のビルドスクリプトを順番に実行し、メニューから選んで実行できるようにします。

---

## 📝 技術詳細

### ハードシンク（オシレータ同期）とは

ハードシンクは、一つのオシレータ（マスター）が別のオシレータ（スレーブ）の位相を強制的にリセットする音響合成技術です。

- 豊かな倍音を持つ音色が生成される
- マスター周波数とスレーブ周波数の比率によって音色が変化
- 古典的なアナログシンセサイザーで使われていた技法

### Simple版とSmooth版の違い

#### Simple版
- マウス位置の変化が8msごとに音に反映される
- 急激にマウスを動かすと、階段状に周波数が変化
- シンプルな実装のため、仕組みを学びやすい

#### Smooth版
- 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
- 時定数（デフォルト16ms）で滑らかさを調整可能
- より音楽的で実用的な動作

---

## 📚 プロジェクトのゴール

- [x] Python: LLM chatbotでcode生成し、手軽にinstallして、起動1秒で音が鳴るシンプルなアプリを実現
- [x] Rust: Pythonの実装をagentによりRustに移植可能かを検証
- [x] Go: 同様にGoでもagentにより移植可能かを検証
- [x] TypeScript: 同様にTypeScriptでもagentにより移植可能かを検証

**結果**: すべての言語で実現できました！

---

## 🎯 完了した実装

- [x] Python実装
- [x] Rust実装
- [x] Go実装（Pure Go - Oto）
- [x] Go実装（PortAudio + Zig cc）
- [x] TypeScript実装（ブラウザ版）
- [x] TypeScript実装（CLI版・Windows専用）

---

## ⚖️ ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

---

## 🔗 関連リンク

- [メイン README](README.md)
- [Zenn scraps記事（Python版解説）](https://zenn.dev/cat2151/scraps/bc9dca9b75a901)

---

※英語版README.mdは、README.ja.mdを元にGeminiの翻訳でGitHub Actionsにより自動生成しています
