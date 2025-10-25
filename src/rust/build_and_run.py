#!/usr/bin/env python3
"""
build_and_run.py - Rust版
Rust実装の環境構築・ビルド・実行を行うスクリプト

使用方法:
    python build_and_run.py [--clean] [--simple|--smooth]

    --clean: クリーンビルドを実行
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
    is_source_newer_than_target,
    log_error,
    log_info,
    log_step,
    log_success,
    log_warning,
)


def check_dependencies() -> bool:
    """依存関係をチェック"""
    log_step("1/3", "依存関係をチェック中...")

    if not command_exists("cargo"):
        log_error("cargoが見つかりません")
        log_error("Rustをインストールしてください: https://www.rust-lang.org/tools/install")
        return False

    # Show Rust version
    try:
        result = subprocess.run(
            ["cargo", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
        if result.returncode == 0:
            log_success(f"Rust: {result.stdout.strip()}")
        else:
            log_warning("Rustバージョンの取得に失敗しました")
    except Exception:
        log_warning("Rustバージョンの取得に失敗しました")

    return True


def build_application(mode: str, force_rebuild: bool = False) -> bool:
    """アプリケーションをビルド"""
    log_step("2/3", f"{mode}版をビルド中...")

    script_dir = Path(__file__).parent.resolve()
    target_exe = script_dir / "target" / "release" / f"sync_{mode}.exe"

    # Check if rebuild is needed
    if not force_rebuild and target_exe.exists():
        # Check source files
        src_dir = script_dir / "src"
        source_files = list(src_dir.glob("**/*.rs"))
        source_files.append(script_dir / "Cargo.toml")

        if not is_source_newer_than_target(source_files, target_exe):
            log_success(f"ビルド: {mode}版は最新です（スキップ）")
            return True

    # Clean if requested
    if force_rebuild:
        log_info("クリーンビルドを実行中...")
        try:
            subprocess.run(
                ["cargo", "clean"],
                cwd=script_dir,
                check=False,
            )
        except Exception as e:
            log_warning(f"cargo cleanに失敗しました: {e}")

    # Build
    log_info(f"cargo build --release --bin sync_{mode}")
    try:
        result = subprocess.run(
            ["cargo", "build", "--release", "--bin", f"sync_{mode}"],
            cwd=script_dir,
            check=False,
        )
        if result.returncode == 0:
            log_success(f"ビルド完了: {target_exe}")
            return True
        else:
            log_error("ビルドに失敗しました")
            return False
    except Exception as e:
        log_error(f"ビルド中にエラーが発生しました: {e}")
        return False


def run_application(mode: str) -> int:
    """アプリケーションを実行"""
    log_step("3/3", f"{mode}版を実行中...")

    script_dir = Path(__file__).parent.resolve()
    exe_path = script_dir / "target" / "release" / f"sync_{mode}.exe"

    if not exe_path.exists():
        log_error(f"実行ファイルが見つかりません: {exe_path}")
        return 1

    log_info(f"実行: {exe_path}")
    print()
    print("=" * 60)
    print(f"  Rust版 - {mode.capitalize()}モード")
    print("=" * 60)
    print("マウスを動かして音を制御してください")
    print("Ctrl+Cで終了します")
    print("=" * 60)
    print()

    try:
        result = subprocess.run([str(exe_path)])
        return result.returncode
    except KeyboardInterrupt:
        print()
        log_info("終了しました")
        return 0


def main() -> int:
    """メイン処理"""
    parser = argparse.ArgumentParser(description="Rust版 cat-oscillator-sync のビルド＆実行スクリプト")
    parser.add_argument(
        "--clean",
        action="store_true",
        help="クリーンビルドを実行",
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
    print("  Rust版 ビルド＆実行スクリプト")
    print("=" * 60)
    print()

    # Step 1: Check dependencies
    if not check_dependencies():
        return 1

    print()

    # Step 2: Build application
    if not build_application(mode, force_rebuild=args.clean):
        return 1

    print()

    # Step 3: Run application
    return run_application(mode)


if __name__ == "__main__":
    sys.exit(main())
