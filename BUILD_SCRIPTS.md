# ビルドスクリプト

各言語版の実装について、環境構築・ビルド・実行を1つのコマンドで行えるPythonスクリプトを用意しています。

## 概要

各言語のディレクトリに `build_and_run.py` スクリプトがあります：

- `src/python/build_and_run.py` - Python版
- `src/rust/build_and_run.py` - Rust版
- `src/go/build_and_run.py` - Go版（Pure Go - Oto）
- `src/go-portaudio/build_and_run.py` - Go版（PortAudio + Zig cc）
- `src/typescript/cli/build_and_run.py` - TypeScript CLI版
- `src/typescript/browser/build_and_run.py` - TypeScript Browser版

これらのスクリプトは以下の機能を提供します：

1. **依存関係のチェック**: 必要なツール（Python、Go、Rust、npm等）が利用可能かチェック
2. **環境構築**: 必要なライブラリや依存関係を自動的にインストール
3. **ビルド**: ソースコードをビルド（タイムスタンプチェックにより必要な場合のみ）
4. **実行**: ビルドしたアプリケーションを実行

## 基本的な使い方

各言語のディレクトリで以下のコマンドを実行：

```bash
# デフォルト（Smooth版）を実行
python build_and_run.py

# Simple版を実行
python build_and_run.py --simple

# Smooth版を実行（明示的）
python build_and_run.py --smooth

# クリーンビルドを実行
python build_and_run.py --clean
```

### オプション

| オプション | 説明 |
|----------|------|
| `--clean` | 依存関係の再インストールとクリーンビルドを実行 |
| `--simple` | Simple版（8msごとに階段状に周波数変化）を実行 |
| `--smooth` | Smooth版（指数平滑化で滑らかに周波数変化）を実行（デフォルト） |

※ TypeScript Browser版は `--build` オプションで本番用ビルド、`--dev` オプションで開発サーバー起動（デフォルト）

## 各言語版の実行例

### Python版

```bash
cd src/python
python build_and_run.py --smooth
```

依存関係：
- Python 3.8+
- pip
- sounddevice, numpy（自動インストール）

### Rust版

```bash
cd src/rust
python build_and_run.py --smooth
```

依存関係：
- Rust (rustc, cargo)
- Visual Studio Build Tools（Windows）

### Go版（Pure Go - Oto）⭐推奨

```bash
cd src/go
python build_and_run.py --smooth
```

依存関係：
- Go 1.24+
- CGO不要！

### Go版（PortAudio + Zig cc）

```bash
cd src/go-portaudio
python build_and_run.py --smooth
```

依存関係：
- Go 1.24+
- Zig cc
- PortAudio DLL（自動ダウンロード）

### TypeScript CLI版

```bash
cd src/typescript/cli
python build_and_run.py --smooth
```

依存関係：
- Node.js
- npm
- Windows専用

### TypeScript Browser版

```bash
# 開発サーバー起動（デフォルト）
cd src/typescript/browser
python build_and_run.py

# 本番用ビルド
python build_and_run.py --build
```

依存関係：
- Node.js
- npm

## タイムスタンプベースのビルド

各スクリプトは、ソースファイルのタイムスタンプをチェックし、変更があった場合のみビルドを実行します。
これにより、無駄なビルド時間を削減できます。

ビルドをスキップする条件：
- ターゲットファイル（実行ファイル）が存在する
- すべてのソースファイルがターゲットファイルより古い

クリーンビルドを強制する場合は `--clean` オプションを使用してください。

## プロジェクトルートからの一括実行

プロジェクトルートの `build_and_run.py` を使用すると、全言語版をまとめて管理できます：

```bash
# すべての言語版をビルドして、メニューから選んで実行
python build_and_run.py
```

メニューオプション：
- `99` - 全言語版のクリーンビルドを実行

このオプションは、各言語版の `build_and_run.py --clean` を順番に実行します。

## トラブルシューティング

### Python版

**エラー**: `sounddevice`が見つかりません

**解決策**: 
```bash
pip install -r requirements.txt
```
または
```bash
python build_and_run.py --clean
```

### Rust版

**エラー**: `cargo: command not found`

**解決策**: Rustをインストールしてください
- https://www.rust-lang.org/tools/install

### Go版（Pure Go - Oto）

**エラー**: `go: command not found`

**解決策**: Goをインストールしてください
- https://go.dev/dl/

### Go版（PortAudio + Zig cc）

**エラー**: `zig: command not found`

**解決策**: 
1. Zigをインストールしてください（https://ziglang.org/download/）
2. Zigを環境変数PATHに追加してください
3. または、Pure Go版（src/go）の使用を推奨します

### TypeScript版

**エラー**: `npm: command not found`

**解決策**: Node.jsをインストールしてください
- https://nodejs.org/

## 共通ユーティリティ

`src/build_utils.py` には、各ビルドスクリプトで使用される共通関数が含まれています：

- `log_info()`, `log_success()`, `log_error()`, `log_warning()` - ログ出力
- `command_exists()` - コマンドの存在チェック
- `is_source_newer_than_target()` - タイムスタンプ比較
- `clean_directory()` - ディレクトリのクリーンアップ
- `run_command()` - コマンド実行

## 設計思想

これらのビルドスクリプトは、以下の原則に基づいて設計されています：

1. **シンプルさ**: 1つのコマンドで環境構築からビルド、実行まで完了
2. **効率性**: タイムスタンプベースのビルドで無駄なビルドを回避
3. **一貫性**: すべての言語版で同じインターフェース
4. **自己完結性**: 必要な依存関係を自動的にセットアップ
5. **クロスプラットフォーム**: Python 3で動作（ただしWindows専用）

## 参考情報

- [プロジェクトルートのREADME](../../README.md)
- [GitHub Copilot Instructions](../../.github/copilot-instructions.md)
