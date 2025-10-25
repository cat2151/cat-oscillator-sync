#!/usr/bin/env python3
"""
build_and_run.py - Python版
Python実装の環境構築・ビルド・実行を行うスクリプト

使用方法:
    python build_and_run.py [--clean] [--simple|--smooth]

    --clean: 依存関係を再インストール
    --simple: Simple版を実行
    --smooth: Smooth版を実行（デフォルト）
"""

import argparse
import subprocess
import sys
from pathlib import Path

# 親ディレクトリをパスに追加してbuild_utilsをimport
sys.path.insert(0, str(Path(__file__).parent.parent))
from build_utils import (
    command_exists,
    log_error,
    log_info,
    log_step,
    log_success,
)


def check_dependencies() -> bool:
    """依存関係をチェック"""
    log_step("1/3", "依存関係をチェック中...")

    if not command_exists("python"):
        log_error("Pythonが見つかりません")
        return False

    log_success("Python: OK")
    return True


def install_dependencies(force: bool = False) -> bool:
    """依存関係をインストール"""
    log_step("2/3", "依存関係をインストール中...")

    script_dir = Path(__file__).parent.resolve()
    requirements_file = script_dir.parent.parent / "requirements.txt"

    if not requirements_file.exists():
        log_error(f"requirements.txtが見つかりません: {requirements_file}")
        return False

    # Check if sounddevice is installed
    if not force:
        try:
            result = subprocess.run(
                ["pip", "list"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                check=False,
            )
            if "sounddevice" in result.stdout:
                log_success("依存関係: すでにインストール済み")
                return True
        except Exception:
            pass

    # Install dependencies
    log_info(f"pip install -r {requirements_file}")
    try:
        result = subprocess.run(
            ["pip", "install", "-r", str(requirements_file)],
            check=False,
        )
        if result.returncode == 0:
            log_success("依存関係のインストール: 完了")
            return True
        else:
            log_error("依存関係のインストールに失敗しました")
            return False
    except Exception as e:
        log_error(f"依存関係のインストール中にエラーが発生しました: {e}")
        return False


def run_application(mode: str) -> int:
    """アプリケーションを実行"""
    log_step("3/3", f"{mode}版を実行中...")

    script_dir = Path(__file__).parent.resolve()
    script_name = f"sync_{mode}.py"
    script_path = script_dir / script_name

    if not script_path.exists():
        log_error(f"スクリプトが見つかりません: {script_path}")
        return 1

    log_info(f"実行: python {script_name}")
    print()
    print("=" * 60)
    print(f"  Python版 - {mode.capitalize()}モード")
    print("=" * 60)
    print("マウスを動かして音を制御してください")
    print("Ctrl+Cで終了します")
    print("=" * 60)
    print()

    try:
        result = subprocess.run(["python", str(script_path)])
        return result.returncode
    except KeyboardInterrupt:
        print()
        log_info("終了しました")
        return 0


def main() -> int:
    """メイン処理"""
    parser = argparse.ArgumentParser(description="Python版 cat-oscillator-sync のビルド＆実行スクリプト")
    parser.add_argument(
        "--clean",
        action="store_true",
        help="依存関係を再インストール",
    )
    parser.add_argument(
        "--simple",
        action="store_true",
        help="Simple版を実行",
    )
    parser.add_argument(
        "--smooth",
        action="store_true",
        help="Smooth版を実行（デフォルト）",
    )

    args = parser.parse_args()

    # Determine mode
    if args.simple:
        mode = "simple"
    else:
        mode = "smooth"  # Default

    print("=" * 60)
    print("  Python版 ビルド＆実行スクリプト")
    print("=" * 60)
    print()

    # Step 1: Check dependencies
    if not check_dependencies():
        return 1

    print()

    # Step 2: Install dependencies
    if not install_dependencies(force=args.clean):
        return 1

    print()

    # Step 3: Run application
    return run_application(mode)


if __name__ == "__main__":
    sys.exit(main())
