# ビルド＆実行スクリプト（Windows専用）

すべてのcat-oscillator-syncアプリケーションを一括でビルドし、個別に実行できるPythonスクリプトです。

## 目的

物理スピーカーでの人力テストを効率化するために作成されました。これまでは各言語版のinstall/build手順書を読んで、それぞれビルドと実行をする必要がありましたが、このスクリプトを使用することで：

- ✅ すべてのアプリを一度にビルド
- ✅ メニューから実行したいアプリを選択
- ✅ コンテキストスイッチの削減

## 使い方

```bash
python build_and_run.py
```

または

```bash
python3 build_and_run.py
```

## 動作

### ビルドフェーズ

スクリプトは以下の順序で各アプリケーションをビルドします：

1. **Python版** - 依存関係をチェック（pyaudioなど）
2. **Rust版** - `cargo build --release` でビルド
3. **Go版** - `go build` でビルド
4. **TypeScript CLI版** - `npm install` と `npm run build` でビルド
5. **TypeScript Browser版** - `npm install` と `npm run build` でビルド

各ステップで、必要なツール（cargo、go、npmなど）が存在しない場合は警告を表示してスキップします。

### 実行フェーズ

ビルド完了後、インタラクティブなメニューが表示されます：

```
==========================================
  実行するアプリを選択してください
==========================================

Python版:
  1) sync_simple.py  - シンプル版（8msごとに階段状に周波数変化）
  2) sync_smooth.py  - スムーズ版（指数平滑化で滑らかに周波数変化）

Rust版:
  3) sync_simple     - シンプル版
  4) sync_smooth     - スムーズ版

Go版:
  5) sync_simple     - シンプル版
  6) sync_smooth     - スムーズ版

TypeScript版:
  7) CLI Simple      - CLIシンプル版（Windows専用）
  8) CLI Smooth      - CLIスムーズ版（Windows専用）
  9) Browser         - ブラウザ版開発サーバー起動

  0) 終了
```

数字を入力してアプリを選択し、実行します。アプリが終了すると、再度メニューが表示されます。

## 必要な環境

各言語版を実行するには、以下のツールが必要です：

### Python版
- Python 3.8+
- pip
- pyaudioなどの依存関係（`requirements.txt`参照）

### Rust版
- Rust（rustc、cargo）
- 詳細は [4_RUST_QUICKSTART.md](4_RUST_QUICKSTART.md) を参照

### Go版
- Go 1.21+
- Windows: MinGW-w64またはTDM-GCC、PortAudio DLL
- 詳細は [22_GO_QUICKSTART.md](22_GO_QUICKSTART.md) を参照

### TypeScript CLI版（Windows専用）
- Node.js 18+
- npm
- Windows 10以降
- Visual Studio Build Tools（ネイティブモジュールのビルド用）
- 詳細は [32_TYPESCRIPT_CLI_QUICKSTART.md](32_TYPESCRIPT_CLI_QUICKSTART.md) を参照

### TypeScript Browser版
- Node.js 18+
- npm
- モダンなWebブラウザ
- 詳細は [6_TYPESCRIPT_BROWSER_README.md](6_TYPESCRIPT_BROWSER_README.md) を参照

## トラブルシューティング

### ビルドエラーが発生する

各言語版の個別のREADMEやQUICKSTARTドキュメントを参照してください：

- Python: [README.md](README.md) の「インストール」セクション
- Rust: [4_RUST_QUICKSTART.md](4_RUST_QUICKSTART.md)
- Go: [22_GO_QUICKSTART.md](22_GO_QUICKSTART.md)
- TypeScript CLI: [32_TYPESCRIPT_CLI_QUICKSTART.md](32_TYPESCRIPT_CLI_QUICKSTART.md)
- TypeScript Browser: [6_TYPESCRIPT_BROWSER_README.md](6_TYPESCRIPT_BROWSER_README.md)

### 特定の言語版がスキップされる

必要なツール（cargo、go、npmなど）がインストールされていない可能性があります。上記の「必要な環境」セクションを確認してください。

### 実行時にエラーが発生する

- **Python版**: pyaudioのインストール確認
- **Rust版**: オーディオデバイスの設定確認
- **Go版**: PortAudio DLLとマウスライブラリの確認
- **TypeScript CLI版**: ネイティブモジュールのビルド確認
- **TypeScript Browser版**: ブラウザが http://localhost:5173 にアクセスできるか確認

## 使用例

### すべてをビルドして、Python版とRust版を比較したい場合

```bash
python build_and_run.py

# メニューで1を選択してPython sync_simple.pyを実行
# Ctrl+Cで終了
# メニューで3を選択してRust sync_simpleを実行
# Ctrl+Cで終了
# メニューで0を選択して終了
```

### ブラウザ版の開発サーバーを起動したい場合

```bash
python build_and_run.py

# メニューで9を選択
# ブラウザで http://localhost:5173 にアクセス
# Ctrl+Cで終了
```

## 注意事項

- スクリプトはリポジトリのルートディレクトリから実行する必要があります
- ビルドには時間がかかることがあります（特に初回）
- 各アプリは `Ctrl+C` で終了できます
- Windows 10以降で動作確認済み

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
