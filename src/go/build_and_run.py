#!/usr/bin/env python3
"""
build_and_run.py - Go版（Pure Go - Oto）
Go実装（Pure Go版）の環境構築・ビルド・実行を行うスクリプト

使用方法:
    python build_and_run.py [--clean] [--simple|--smooth]

    --clean: クリーンビルドを実行
    --simple: Simple版を実行
    --smooth: Smooth版を実行（デフォルト）
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

# 親ディレクトリをパスに追加してbuild_utilsをimport
sys.path.insert(0, str(Path(__file__).parent.parent))
from build_utils import (
    clean_directory,
    command_exists,
    ensure_directory,
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

    if not command_exists("go"):
        log_error("Goが見つかりません")
        log_error("Goをインストールしてください: https://go.dev/dl/")
        return False

    # Show Go version
    try:
        result = subprocess.run(
            ["go", "version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
        if result.returncode == 0:
            log_success(f"Go: {result.stdout.strip()}")
        else:
            log_warning("Goバージョンの取得に失敗しました")
    except Exception:
        log_warning("Goバージョンの取得に失敗しました")

    log_info("Pure Go版（Oto）: CGO不要")
    return True


def build_application(mode: str, force_rebuild: bool = False) -> bool:
    """アプリケーションをビルド"""
    log_step("2/3", f"{mode}版をビルド中...")

    script_dir = Path(__file__).parent.resolve()
    bin_dir = script_dir / "bin"
    ensure_directory(bin_dir)

    target_exe = bin_dir / f"sync_{mode}_oto.exe"

    # Check if rebuild is needed
    if not force_rebuild and target_exe.exists():
        # Check source files
        source_files = []
        source_files.extend(script_dir.glob("**/*.go"))
        source_files.append(script_dir / "go.mod")

        if not is_source_newer_than_target(source_files, target_exe):
            log_success(f"ビルド: {mode}版は最新です（スキップ）")
            return True

    # Clean if requested
    if force_rebuild:
        log_info("クリーンビルドを実行中...")
        clean_directory(bin_dir, "*.exe")

    # Build with CGO disabled (Pure Go)
    log_info(f"go build -o {target_exe} ./cmd/sync_{mode}_oto")
    log_info("CGO_ENABLED=0 (Pure Go版)")

    env = os.environ.copy()
    env["CGO_ENABLED"] = "0"

    try:
        result = subprocess.run(
            [
                "go",
                "build",
                "-o",
                str(target_exe),
                f"./cmd/sync_{mode}_oto",
            ],
            cwd=script_dir,
            env=env,
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
    exe_path = script_dir / "bin" / f"sync_{mode}_oto.exe"

    if not exe_path.exists():
        log_error(f"実行ファイルが見つかりません: {exe_path}")
        return 1

    log_info(f"実行: {exe_path}")
    print()
    print("=" * 60)
    print(f"  Go版（Pure Go - Oto）- {mode.capitalize()}モード")
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
    parser = argparse.ArgumentParser(description="Go版（Pure Go - Oto）cat-oscillator-sync のビルド＆実行スクリプト")
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
    print("  Go版（Pure Go - Oto）ビルド＆実行スクリプト")
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
