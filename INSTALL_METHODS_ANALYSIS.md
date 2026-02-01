# インストール方法の分析と改善提案

このドキュメントは、Issue #81 の調査結果をまとめたものです。

## 現在の実装状況

### ✅ Python版

**現状**: pipx対応済み

**ワンライナーインストール**:
```bash
pipx install git+https://github.com/cat2151/cat-oscillator-sync
```

**実装済みの内容**:
- `pyproject.toml`に`[project.scripts]`セクションが設定済み
- エントリーポイント: `cat-oscillator-sync-simple`, `cat-oscillator-sync-smooth`
- パッケージ名: `cat-oscillator-sync`

**改善の必要性**: ❌ なし（既に最適化済み）

---

### ✅ Rust版

**現状**: cargo install対応可能

**ワンライナーインストール**:
```bash
# Rustのサブディレクトリからインストール
cargo install --git https://github.com/cat2151/cat-oscillator-sync --root . cat-oscillator-sync
```

**注意点**:
- Cargo.tomlが`src/rust/`に配置されているため、通常のリポジトリルートからのインストールはできない
- `cargo install`は自動的にサブディレクトリを検索してCargo.tomlを見つける
- `--root .`オプションでカレントディレクトリに`./bin/`を作成してインストール

**代替案**:
```bash
# $HOME/.cargo/binにインストールする場合（PATHに追加されていれば直接実行可能）
cargo install --git https://github.com/cat2151/cat-oscillator-sync cat-oscillator-sync
```

**改善の必要性**: ❌ なし（現状の構成で問題なし）

---

### ✅ Go版（Pure Go - Oto）

**現状**: go install対応可能

**ワンライナーインストール**:
```bash
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_simple_oto@latest
go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_smooth_oto@latest
```

**実装済みの内容**:
- go.modのモジュールパス: `github.com/cat2151/cat-oscillator-sync/go`
- コマンドパス: `cmd/sync_simple_oto`, `cmd/sync_smooth_oto`
- `$GOPATH/bin`または`$HOME/go/bin`にインストールされる

**実行方法**:
```bash
# GOPATHがPATHに追加されていれば
sync_simple_oto
sync_smooth_oto
```

**改善の必要性**: ❌ なし（既に最適化済み）

---

### ⚠️ Go版（PortAudio + Zig cc）

**現状**: ワンライナーインストールは非推奨

**理由**:
- Zig ccのセットアップが必要
- PortAudio DLLのダウンロードが必要
- CGOを有効にする必要がある

**推奨インストール方法**:
```bash
# 1. Zigのインストール
scoop install zig

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

**改善の必要性**: ❌ なし（環境構築が必要な実装のため、ワンライナーは不適切）

**推奨**: 一般ユーザーには Pure Go版（Oto）を推奨

---

### ✅ TypeScript版（Browser）

**現状**: インストール不要

**使用方法**:
- GitHub Pagesで公開: https://cat2151.github.io/cat-oscillator-sync/
- ブラウザでアクセスするだけ

**改善の必要性**: ❌ なし（最も簡単な方法を既に実現）

---

### ⚠️ TypeScript版（CLI - Windows専用）

**現状**: ワンライナーインストールは非推奨

**理由**:
- Visual Studio Build Toolsが必要（ネイティブモジュールのビルド）
- Windows専用（robotjs、naudiodon依存）
- npmパッケージとして公開されていない

**推奨インストール方法**:
```bash
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/typescript/cli
npm install
npm run build
npm start
```

**npxでの実行の可能性**:
- npmパッケージとして公開すればnpxで実行可能
- ただし、ネイティブモジュールのビルドが必要なため、初回実行時にビルドツールが必要
- レイテンシが約170msと他の実装より高いため、積極的に推奨する理由が薄い

**改善の必要性**: ❌ なし（他の実装を推奨する方が適切）

---

## 実装の比較表

| 言語 | ワンライナー | 実装済み | 推奨度 | 備考 |
|------|-------------|---------|--------|------|
| TypeScript (Browser) | ✅ (URL) | ✅ | ⭐⭐⭐⭐⭐ | インストール不要 |
| Python | ✅ (pipx) | ✅ | ⭐⭐⭐⭐⭐ | 最もシンプル |
| Go (Oto) | ✅ (go install) | ✅ | ⭐⭐⭐⭐ | Pure Go |
| Rust | ✅ (cargo install) | ✅ | ⭐⭐⭐⭐ | 高性能 |
| Go (PortAudio) | ❌ | - | ⭐⭐⭐ | 環境構築が必要 |
| TypeScript (CLI) | ❌ | - | ⭐⭐ | レイテンシ高い |

---

## 結論

### 実装済みのワンライナーインストール

1. **Python**: `pipx install git+https://github.com/cat2151/cat-oscillator-sync`
2. **Rust**: `cargo install --git https://github.com/cat2151/cat-oscillator-sync cat-oscillator-sync`
3. **Go (Oto)**: `go install github.com/cat2151/cat-oscillator-sync/go/cmd/sync_*_oto@latest`
4. **TypeScript (Browser)**: URLアクセスのみ（インストール不要）

### ワンライナーを推奨しない実装

1. **Go (PortAudio)**: 環境構築が必要（Zig cc、PortAudio DLL）
2. **TypeScript (CLI)**: ビルドツールが必要、レイテンシが高い

### 追加で必要な作業

- ✅ README.ja.mdの作成（完了）
- ✅ README.mdの更新（完了）
- ✅ 各言語版のインストール方法の明確化（完了）
- ✅ 実装の比較表の作成（完了）

### 改善の余地がある項目

**なし** - すべての実装で、その特性に応じた最適なインストール方法が既に実現されています。

---

## 推奨事項

1. **初心者・お手軽**: TypeScript (Browser版) または Python (pipx)
2. **パフォーマンス重視**: Rust または Go (Oto)
3. **開発者・学習用**: すべての実装を`build_and_run.py`で試す

---

## 参考資料

- [README.ja.md](README.ja.md) - 日本語版詳細ドキュメント
- [README.md](README.md) - 英語版ドキュメント
- [BUILD_SCRIPTS.md](BUILD_SCRIPTS.md) - ビルドスクリプトの詳細

---

**作成日**: 2026-02-01
**Issue**: #81
