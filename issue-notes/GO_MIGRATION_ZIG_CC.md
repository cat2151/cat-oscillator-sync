# Go版の構成変更について

## 概要

Go版の実装を2つのディレクトリに分離し、PortAudio版のビルドにはZig ccを使用するように変更しました。

## 変更内容

### 新しいディレクトリ構成

```
src/
├── go/                    # Pure Go版（Oto）- 推奨
│   ├── cmd/
│   │   ├── sync_simple_oto/
│   │   └── sync_smooth_oto/
│   └── ...
└── go-portaudio/         # PortAudio版（Zig cc使用）
    ├── cmd/
    │   ├── sync_simple/
    │   └── sync_smooth/
    ├── build.bat         # Zig ccを使用したビルドスクリプト
    └── ...
```

### 主な変更点

1. **ディレクトリの分離**
   - Pure Go版（Oto）: `src/go/`
   - PortAudio版: `src/go-portaudio/`（新規作成）

2. **ビルド方法の変更**
   - Pure Go版: 変更なし（`go build`のみ）
   - PortAudio版: **MinGW/GCCの代わりにZig ccを使用**

3. **ドキュメントの更新**
   - 各ディレクトリに独立したREADMEを配置
   - 古いドキュメントに廃止/移動通知を追加

## なぜZig ccを使用するのか？

### MinGW/GCCの問題点
- インストールが複雑（数GBのサイズ）
- 環境を汚染する
- クロスコンパイルに追加ツールが必要

### Zig ccの利点
- 軽量（約60MB）
- シンプルなインストール（ZIPを解凍するだけ）
- クロスコンパイル標準対応
- 最新のLLVM/Clangベース

## 移行ガイド

### 従来の方法（MinGW/GCC）を使っていた場合

**新しい推奨方法:**
1. Pure Go版（Oto）を使用する → `src/go/README.md` を参照
2. または、Zig ccをインストールしてPortAudio版を使用 → `src/go-portaudio/README.md` を参照

### クイックスタート

#### Pure Go版（推奨）
```bash
cd src/go
go build -o bin/sync_simple_oto.exe ./cmd/sync_simple_oto
bin/sync_simple_oto.exe
```

#### PortAudio版（Zig cc使用）
```bash
cd src/go-portaudio
python download_portaudio.py  # PortAudio DLLをダウンロード
build.bat                      # Zig ccを使用してビルド
bin/sync_simple.exe
```

## ドキュメント

### 最新のドキュメント
- **Pure Go版**: [src/go/README.md](../src/go/README.md)
- **PortAudio版**: [src/go-portaudio/README.md](../src/go-portaudio/README.md)
- **PortAudio版クイックスタート**: [src/go-portaudio/QUICKSTART.md](../src/go-portaudio/QUICKSTART.md)

### 古いドキュメント（MinGW/GCC使用）
以下のドキュメントは廃止されました。上記の最新ドキュメントを参照してください。
- issue-notes/22_GO_README.md
- issue-notes/22_GO_QUICKSTART.md
- issue-notes/44_GO_README_OTO.md（→ src/go/README.mdに移動）
- issue-notes/44_GO_QUICKSTART_OTO.md（→ src/go/README.mdに移動）

## よくある質問

### Q: Pure Go版とPortAudio版のどちらを使うべきですか？

**A: 一般ユーザーにはPure Go版（Oto）を推奨します。**

理由:
- ビルドが簡単（`go build`だけ）
- 追加のツール不要
- モノフォニックシンセには十分な性能

PortAudio版が必要なのは:
- 最高のレイテンシが必要な場合
- プロフェッショナル向けオーディオアプリケーション

### Q: MinGW/GCCは完全に削除されましたか？

**A: はい、このプロジェクトではMinGW/GCCの使用を推奨しません。**

代わりにZig ccを使用してください。より軽量で、インストールも簡単です。

### Q: 既存のビルドを移行する必要がありますか？

**A: いいえ、既存のバイナリは引き続き使用できます。**

ただし、新しくビルドする場合は上記の手順に従ってください。

## サポート

問題が発生した場合は、以下を確認してください:
1. 最新のドキュメントを確認（上記リンク）
2. Goのバージョンが1.24以上であることを確認
3. Pure Go版（Oto）から試してみる

## ライセンス

MIT License - 詳細は [LICENSE](../../LICENSE) を参照
