#!/usr/bin/env python3
"""
build_and_run.py
このscriptはすべてのcat-oscillator-syncアプリをビルドし、一つずつ実行できるようにします。
用途：物理スピーカーでの人力テストを効率化します。
"""

import os
import subprocess
from pathlib import Path


class Colors:
    """ANSI color codes for terminal output"""

    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    YELLOW = "\033[1;33m"
    BLUE = "\033[0;34m"
    NC = "\033[0m"  # No Color


def log_info(message: str) -> None:
    """Print info message"""
    print(f"{Colors.BLUE}[INFO]{Colors.NC} {message}")


def log_success(message: str) -> None:
    """Print success message"""
    print(f"{Colors.GREEN}[SUCCESS]{Colors.NC} {message}")


def log_warning(message: str) -> None:
    """Print warning message"""
    print(f"{Colors.YELLOW}[WARNING]{Colors.NC} {message}")


def log_error(message: str) -> None:
    """Print error message"""
    print(f"{Colors.RED}[ERROR]{Colors.NC} {message}")


def command_exists(command: str) -> bool:
    """Check if a command exists in PATH"""
    try:
        subprocess.run(
            [command, "--version"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
            text=True,
        )
        # Command found if it executed (even if exit code is non-zero)
        return True
    except FileNotFoundError:
        return False
    except Exception as e:
        # Log unexpected errors for debugging
        log_warning(f"{command}のチェック中に予期しないエラー: {e}")
        return False


def debug_show_npm_detection_info() -> None:
    """
    デバッグ用: npm検出失敗時の診断情報を表示
    この関数は診断目的で使用され、不要になれば削除可能です
    """
    path_env = os.environ.get("PATH", "")
    log_info(f"診断情報: PATH環境変数の長さ = {len(path_env)} 文字")
    log_info(f"診断情報: PATHに含まれるディレクトリ数 = {len(path_env.split(os.pathsep))}")
    # Try to find npm/npm.cmd/npm.exe in PATH
    for path_dir in path_env.split(os.pathsep):
        if path_dir and os.path.isdir(path_dir):
            npm_variants = ["npm", "npm.cmd", "npm.exe"]
            for variant in npm_variants:
                npm_path = Path(path_dir) / variant
                if npm_path.exists():
                    log_info(f"診断情報: npm発見 - {npm_path}")
                    try:
                        test_result = subprocess.run(
                            [str(npm_path), "--version"],
                            stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            text=True,
                            check=False,
                        )
                        log_info(
                            f"診断情報: npm実行テスト - 終了コード={test_result.returncode}, "
                            f"出力={test_result.stdout.strip()[:50]}"
                        )
                    except Exception as e:
                        log_info(f"診断情報: npm実行エラー - {e}")


def build_python(script_dir: Path) -> None:
    """Build/check Python dependencies"""
    log_info("[1/5] Python版の依存関係チェック...")

    if not command_exists("python"):
        log_warning("Pythonが見つかりません。Python版はスキップします。")
        return

    try:
        # Check if required packages are installed
        result = subprocess.run(
            ["pip", "list"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )

        if "sounddevice" not in result.stdout:
            log_warning("Python版: sounddeviceがインストールされていません")
            log_info("インストール中: pip install -r requirements.txt")
            subprocess.run(
                ["pip", "install", "-r", "requirements.txt"],
                cwd=script_dir,
                check=False,
            )
        else:
            log_success("Python版: 準備完了")
    except Exception as e:
        log_error(f"Python版の依存関係チェックに失敗しました: {e}")


def build_rust(script_dir: Path) -> None:
    """Build Rust version"""
    log_info("[2/5] Rust版をビルド中...")

    if not command_exists("cargo"):
        log_warning("cargoが見つかりません。Rust版はスキップします。")
        return

    rust_dir = script_dir / "src" / "rust"
    result = subprocess.run(["cargo", "build", "--release"], cwd=rust_dir, check=False)

    if result.returncode == 0:
        log_success("Rust版: ビルド完了")
    else:
        log_error("Rust版のビルドに失敗しました")


def build_go(script_dir: Path) -> None:
    """Build Go version"""
    log_info("[3/5] Go版をビルド中...")

    if not command_exists("go"):
        log_warning("goが見つかりません。Go版はスキップします。")
        return

    go_dir = script_dir / "src" / "go"
    bin_dir = go_dir / "bin"
    bin_dir.mkdir(exist_ok=True)

    # Build sync_simple
    result1 = subprocess.run(
        ["go", "build", "-o", "bin/sync_simple.exe", "./cmd/sync_simple"],
        cwd=go_dir,
        check=False,
    )

    # Build sync_smooth
    result2 = subprocess.run(
        ["go", "build", "-o", "bin/sync_smooth.exe", "./cmd/sync_smooth"],
        cwd=go_dir,
        check=False,
    )

    if result1.returncode == 0 and result2.returncode == 0:
        log_success("Go版: ビルド完了")
    else:
        log_error("Go版のビルドに失敗しました")


def build_typescript_cli(script_dir: Path) -> None:
    """Build TypeScript CLI version"""
    log_info("[4/5] TypeScript CLI版をビルド中...")

    if not command_exists("npm"):
        log_warning("npmが見つかりません。TypeScript CLI版はスキップします。")
        debug_show_npm_detection_info()
        return

    ts_cli_dir = script_dir / "src" / "typescript" / "cli"
    node_modules = ts_cli_dir / "node_modules"

    if not node_modules.exists():
        log_info("依存関係をインストール中...")
        subprocess.run(["npm", "install"], cwd=ts_cli_dir, check=False)

    result = subprocess.run(["npm", "run", "build"], cwd=ts_cli_dir, check=False)

    if result.returncode == 0:
        log_success("TypeScript CLI版: ビルド完了")
    else:
        log_error("TypeScript CLI版のビルドに失敗しました")


def build_typescript_browser(script_dir: Path) -> None:
    """Build TypeScript Browser version"""
    log_info("[5/5] TypeScript Browser版をビルド中...")

    if not command_exists("npm"):
        log_warning("npmが見つかりません。TypeScript Browser版はスキップします。")
        debug_show_npm_detection_info()
        return

    ts_browser_dir = script_dir / "src" / "typescript" / "browser"
    node_modules = ts_browser_dir / "node_modules"

    if not node_modules.exists():
        log_info("依存関係をインストール中...")
        subprocess.run(["npm", "install"], cwd=ts_browser_dir, check=False)

    result = subprocess.run(["npm", "run", "build"], cwd=ts_browser_dir, check=False)

    if result.returncode == 0:
        log_success("TypeScript Browser版: ビルド完了")
    else:
        log_error("TypeScript Browser版のビルドに失敗しました")


def build_all(script_dir: Path) -> None:
    """Build all applications"""
    print("=" * 42)
    print("  Cat Oscillator Sync ビルド＆実行")
    print("=" * 42)
    print()

    log_info("ビルドを開始します...")
    print()

    build_python(script_dir)
    print()

    build_rust(script_dir)
    print()

    build_go(script_dir)
    print()

    build_typescript_cli(script_dir)
    print()

    build_typescript_browser(script_dir)
    print()

    log_success("全てのビルドが完了しました！")
    print()


def show_menu() -> None:
    """Display the application selection menu"""
    print("=" * 42)
    print("  実行するアプリを選択してください")
    print("=" * 42)
    print()
    print("Python版:")
    print("  1) sync_simple.py  - シンプル版（8msごとに階段状に周波数変化）")
    print("  2) sync_smooth.py  - スムーズ版（指数平滑化で滑らかに周波数変化）")
    print()
    print("Rust版:")
    print("  3) sync_simple     - シンプル版")
    print("  4) sync_smooth     - スムーズ版")
    print()
    print("Go版:")
    print("  5) sync_simple     - シンプル版")
    print("  6) sync_smooth     - スムーズ版")
    print()
    print("TypeScript版:")
    print("  7) CLI Simple      - CLIシンプル版（Windows専用）")
    print("  8) CLI Smooth      - CLIスムーズ版（Windows専用）")
    print("  9) Browser         - ブラウザ版開発サーバー起動")
    print()
    print("  0) 終了")
    print()


def run_application(choice: str, script_dir: Path) -> bool:
    """Run the selected application. Returns False if should exit."""
    try:
        if choice == "1":
            log_info("Python sync_simple.py を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["python", "src/python/sync_simple.py"], cwd=script_dir, check=False)

        elif choice == "2":
            log_info("Python sync_smooth.py を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["python", "src/python/sync_smooth.py"], cwd=script_dir, check=False)

        elif choice == "3":
            log_info("Rust sync_simple を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(
                ["src/rust/target/release/sync_simple.exe"],
                cwd=script_dir,
                check=False,
            )

        elif choice == "4":
            log_info("Rust sync_smooth を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(
                ["src/rust/target/release/sync_smooth.exe"],
                cwd=script_dir,
                check=False,
            )

        elif choice == "5":
            log_info("Go sync_simple を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go/bin/sync_simple.exe"], cwd=script_dir, check=False)

        elif choice == "6":
            log_info("Go sync_smooth を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go/bin/sync_smooth.exe"], cwd=script_dir, check=False)

        elif choice == "7":
            log_info("TypeScript CLI Simple を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            ts_cli_dir = script_dir / "src" / "typescript" / "cli"
            subprocess.run(["node", "dist/main.js", "simple"], cwd=ts_cli_dir, check=False)

        elif choice == "8":
            log_info("TypeScript CLI Smooth を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            ts_cli_dir = script_dir / "src" / "typescript" / "cli"
            subprocess.run(["node", "dist/main.js", "smooth"], cwd=ts_cli_dir, check=False)

        elif choice == "9":
            log_info("TypeScript Browser版の開発サーバーを起動します...")
            log_info("ブラウザで http://localhost:5173 にアクセスしてください。")
            print("Ctrl+Cで終了します。")
            ts_browser_dir = script_dir / "src" / "typescript" / "browser"
            subprocess.run(["npm", "run", "dev"], cwd=ts_browser_dir, check=False)

        elif choice == "0":
            log_info("終了します。")
            return False

        else:
            log_error("無効な選択です。0-9の数字を入力してください。")
            return True

        print()
        print("アプリが終了しました。")
        print()
        return True

    except KeyboardInterrupt:
        print()
        print("アプリが終了しました。")
        print()
        return True
    except Exception as e:
        log_error(f"実行中にエラーが発生しました: {e}")
        print()
        return True


def main() -> None:
    """Main function"""
    # Get script directory
    script_dir = Path(__file__).parent.resolve()
    os.chdir(script_dir)

    # Build all applications
    build_all(script_dir)

    # Interactive menu loop
    while True:
        show_menu()
        try:
            choice = input("選択してください [0-9]: ").strip()
            if not run_application(choice, script_dir):
                break
        except KeyboardInterrupt:
            print()
            log_info("終了します。")
            break
        except EOFError:
            print()
            log_info("終了します。")
            break


if __name__ == "__main__":
    main()
