#!/usr/bin/env python3
"""
build_and_run.py - TypeScript CLI版
TypeScript CLI実装の環境構築・ビルド・実行を行うスクリプト

使用方法:
    python build_and_run.py [--clean] [--simple|--smooth]

    --clean: 依存関係を再インストールしてクリーンビルド
    --simple: Simple版を実行
    --smooth: Smooth版を実行（デフォルト）
"""

import argparse
import subprocess
import sys
from pathlib import Path

# 親ディレクトリをパスに追加してbuild_utilsをimport
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from build_utils import (
    clean_directory,
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

    if not command_exists("npm"):
        log_error("npmが見つかりません")
        log_error("Node.jsをインストールしてください: https://nodejs.org/")
        return False

    # Show npm version
    try:
        result = subprocess.run(
            ["npm", "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
        if result.returncode == 0:
            log_success(f"npm: {result.stdout.strip()}")
        else:
            log_warning("npmバージョンの取得に失敗しました")
    except Exception:
        log_warning("npmバージョンの取得に失敗しました")

    log_info("Windows専用実装です")
    return True


def install_and_build(force_rebuild: bool = False) -> bool:
    """依存関係をインストールしてビルド"""
    log_step("2/3", "依存関係とビルドを実行中...")

    script_dir = Path(__file__).parent.resolve()
    node_modules = script_dir / "node_modules"
    dist_dir = script_dir / "dist"

    # Clean if requested
    if force_rebuild:
        log_info("クリーンビルドを実行中...")
        if node_modules.exists():
            log_info("node_modulesを削除中...")
            clean_directory(node_modules)
            node_modules.rmdir()
        if dist_dir.exists():
            log_info("distを削除中...")
            clean_directory(dist_dir)
            dist_dir.rmdir()

    # Install dependencies
    if not node_modules.exists() or force_rebuild:
        log_info("npm install を実行中...")
        try:
            result = subprocess.run(
                ["npm", "install"],
                cwd=script_dir,
                check=False,
            )
            if result.returncode != 0:
                log_error("npm installに失敗しました")
                return False
        except Exception as e:
            log_error(f"npm install中にエラーが発生しました: {e}")
            return False
        log_success("依存関係のインストール: 完了")
    else:
        log_success("依存関係: すでにインストール済み")

    # Check if rebuild is needed
    if not force_rebuild and dist_dir.exists():
        src_dir = script_dir / "src"
        source_files = list(src_dir.glob("**/*.ts"))
        source_files.append(script_dir / "tsconfig.json")
        source_files.append(script_dir / "package.json")

        dist_files = list(dist_dir.glob("**/*.js"))
        if dist_files:
            newest_dist = max(dist_files, key=lambda p: p.stat().st_mtime)
            if not is_source_newer_than_target(source_files, newest_dist):
                log_success("ビルド: 最新です（スキップ）")
                return True

    # Build
    log_info("npm run build を実行中...")
    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            cwd=script_dir,
            check=False,
        )
        if result.returncode == 0:
            log_success("ビルド: 完了")
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
    main_js = script_dir / "dist" / "main.js"

    if not main_js.exists():
        log_error(f"ビルド済みファイルが見つかりません: {main_js}")
        return 1

    log_info(f"実行: node {main_js} {mode}")
    print()
    print("=" * 60)
    print(f"  TypeScript CLI版 - {mode.capitalize()}モード")
    print("=" * 60)
    print("マウスを動かして音を制御してください")
    print("Ctrl+Cで終了します")
    print("=" * 60)
    print()

    try:
        result = subprocess.run(
            ["node", str(main_js), mode],
            cwd=script_dir,
        )
        return result.returncode
    except KeyboardInterrupt:
        print()
        log_info("終了しました")
        return 0


def main() -> int:
    """メイン処理"""
    parser = argparse.ArgumentParser(description="TypeScript CLI版 cat-oscillator-sync のビルド＆実行スクリプト")
    parser.add_argument(
        "--clean",
        action="store_true",
        help="依存関係を再インストールしてクリーンビルド",
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
    print("  TypeScript CLI版 ビルド＆実行スクリプト")
    print("=" * 60)
    print()

    # Step 1: Check dependencies
    if not check_dependencies():
        return 1

    print()

    # Step 2: Install and build
    if not install_and_build(force_rebuild=args.clean):
        return 1

    print()

    # Step 3: Run application
    return run_application(mode)


if __name__ == "__main__":
    sys.exit(main())
