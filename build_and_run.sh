#!/bin/bash

# build_and_run.sh
# このscriptはすべてのcat-oscillator-syncアプリをビルドし、一つずつ実行できるようにします。
# 用途：物理スピーカーでの人力テストを効率化します。

set -e  # エラーが発生したら停止

# 色の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  Cat Oscillator Sync ビルド＆実行"
echo "=========================================="
echo ""

# ========================================
# ビルドフェーズ
# ========================================

log_info "ビルドを開始します..."
echo ""

# Python（ビルド不要だが依存関係チェック）
log_info "[1/5] Python版の依存関係チェック..."
if command -v python3 &> /dev/null; then
    if pip3 list | grep -q pyaudio; then
        log_success "Python版: 準備完了"
    else
        log_warning "Python版: pyaudioがインストールされていません"
        log_info "インストール中: pip3 install -r requirements.txt"
        pip3 install -r requirements.txt || log_error "Python依存関係のインストールに失敗しました"
    fi
else
    log_warning "Python3が見つかりません。Python版はスキップします。"
fi
echo ""

# Rust
log_info "[2/5] Rust版をビルド中..."
if command -v cargo &> /dev/null; then
    cd src/rust
    if cargo build --release; then
        log_success "Rust版: ビルド完了"
    else
        log_error "Rust版のビルドに失敗しました"
    fi
    cd "$SCRIPT_DIR"
else
    log_warning "cargoが見つかりません。Rust版はスキップします。"
fi
echo ""

# Go
log_info "[3/5] Go版をビルド中..."
if command -v go &> /dev/null; then
    cd src/go
    mkdir -p bin
    if go build -o bin/sync_simple ./cmd/sync_simple && \
       go build -o bin/sync_smooth ./cmd/sync_smooth; then
        log_success "Go版: ビルド完了"
    else
        log_error "Go版のビルドに失敗しました"
    fi
    cd "$SCRIPT_DIR"
else
    log_warning "goが見つかりません。Go版はスキップします。"
fi
echo ""

# TypeScript CLI
log_info "[4/5] TypeScript CLI版をビルド中..."
if command -v npm &> /dev/null; then
    cd src/typescript/cli
    if [ ! -d "node_modules" ]; then
        log_info "依存関係をインストール中..."
        npm install
    fi
    if npm run build; then
        log_success "TypeScript CLI版: ビルド完了"
    else
        log_error "TypeScript CLI版のビルドに失敗しました"
    fi
    cd "$SCRIPT_DIR"
else
    log_warning "npmが見つかりません。TypeScript CLI版はスキップします。"
fi
echo ""

# TypeScript Browser
log_info "[5/5] TypeScript Browser版をビルド中..."
if command -v npm &> /dev/null; then
    cd src/typescript/browser
    if [ ! -d "node_modules" ]; then
        log_info "依存関係をインストール中..."
        npm install
    fi
    if npm run build; then
        log_success "TypeScript Browser版: ビルド完了"
    else
        log_error "TypeScript Browser版のビルドに失敗しました"
    fi
    cd "$SCRIPT_DIR"
else
    log_warning "npmが見つかりません。TypeScript Browser版はスキップします。"
fi
echo ""

log_success "全てのビルドが完了しました！"
echo ""

# ========================================
# 実行フェーズ
# ========================================

while true; do
    echo "=========================================="
    echo "  実行するアプリを選択してください"
    echo "=========================================="
    echo ""
    echo "Python版:"
    echo "  1) sync_simple.py  - シンプル版（8msごとに階段状に周波数変化）"
    echo "  2) sync_smooth.py  - スムーズ版（指数平滑化で滑らかに周波数変化）"
    echo ""
    echo "Rust版:"
    echo "  3) sync_simple     - シンプル版"
    echo "  4) sync_smooth     - スムーズ版"
    echo ""
    echo "Go版:"
    echo "  5) sync_simple     - シンプル版"
    echo "  6) sync_smooth     - スムーズ版"
    echo ""
    echo "TypeScript版:"
    echo "  7) CLI Simple      - CLIシンプル版（Windows専用）"
    echo "  8) CLI Smooth      - CLIスムーズ版（Windows専用）"
    echo "  9) Browser         - ブラウザ版開発サーバー起動"
    echo ""
    echo "  0) 終了"
    echo ""
    read -p "選択してください [0-9]: " choice

    case $choice in
        1)
            log_info "Python sync_simple.py を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            python3 src/python/sync_simple.py
            ;;
        2)
            log_info "Python sync_smooth.py を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            python3 src/python/sync_smooth.py
            ;;
        3)
            log_info "Rust sync_simple を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            ./src/rust/target/release/sync_simple
            ;;
        4)
            log_info "Rust sync_smooth を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            ./src/rust/target/release/sync_smooth
            ;;
        5)
            log_info "Go sync_simple を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            ./src/go/bin/sync_simple
            ;;
        6)
            log_info "Go sync_smooth を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            ./src/go/bin/sync_smooth
            ;;
        7)
            log_info "TypeScript CLI Simple を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            cd src/typescript/cli && node dist/main.js simple && cd "$SCRIPT_DIR"
            ;;
        8)
            log_info "TypeScript CLI Smooth を起動します..."
            echo "マウスを動かして音を制御してください。Ctrl+Cで終了します。"
            cd src/typescript/cli && node dist/main.js smooth && cd "$SCRIPT_DIR"
            ;;
        9)
            log_info "TypeScript Browser版の開発サーバーを起動します..."
            log_info "ブラウザで http://localhost:5173 にアクセスしてください。"
            echo "Ctrl+Cで終了します。"
            cd src/typescript/browser && npm run dev
            cd "$SCRIPT_DIR"
            ;;
        0)
            log_info "終了します。"
            exit 0
            ;;
        *)
            log_error "無効な選択です。0-9の数字を入力してください。"
            ;;
    esac

    echo ""
    echo "アプリが終了しました。"
    echo ""
done
