#!/usr/bin/env python3
"""
build_and_run.py
このscriptはすべてのcat-oscillator-syncアプリをビルドし、一つずつ実行できるようにします。
用途：物理スピーカーでの人力テストを効率化します。
"""

import os
import shutil
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
    # Use shutil.which() which properly handles .cmd/.bat extensions on Windows
    return shutil.which(command) is not None


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

    # Build Pure Go (Oto) versions only
    simple_oto_exe = bin_dir / "sync_simple_oto.exe"
    smooth_oto_exe = bin_dir / "sync_smooth_oto.exe"

    if not simple_oto_exe.exists() or not smooth_oto_exe.exists():
        log_info("Pure Go版（Oto）をビルド中... (CGO不要)")

        # Build simple oto version
        result_simple = subprocess.run(
            ["go", "build", "-o", str(simple_oto_exe), "./cmd/sync_simple_oto"],
            cwd=go_dir,
            env={**os.environ, "CGO_ENABLED": "0"},
            check=False,
        )

        # Build smooth oto version
        result_smooth = subprocess.run(
            ["go", "build", "-o", str(smooth_oto_exe), "./cmd/sync_smooth_oto"],
            cwd=go_dir,
            env={**os.environ, "CGO_ENABLED": "0"},
            check=False,
        )

        if result_simple.returncode == 0 and result_smooth.returncode == 0:
            log_success("Go版（Oto - Pure Go）: ビルド完了")
        else:
            log_error("Go版（Oto）のビルドに失敗しました")
    else:
        log_success("Go版（Oto - Pure Go）: ビルド済みバイナリが見つかりました")

    # Build go-portaudio versions (separate directory, Zig cc required)
    go_portaudio_dir = script_dir / "src" / "go-portaudio"
    if go_portaudio_dir.exists():
        portaudio_bin_dir = go_portaudio_dir / "bin"
        portaudio_bin_dir.mkdir(exist_ok=True)
        simple_pa_exe = portaudio_bin_dir / "sync_simple.exe"
        smooth_pa_exe = portaudio_bin_dir / "sync_smooth.exe"

        if simple_pa_exe.exists() and smooth_pa_exe.exists():
            log_success("Go版（PortAudio + Zig cc）: ビルド済みバイナリが見つかりました")
        else:
            # Try to build go-portaudio versions
            if command_exists("zig"):
                log_info("Go版（PortAudio + Zig cc）をビルド中...")

                # First, check and setup PortAudio DLL
                dll_path = portaudio_bin_dir / "libportaudio64bit.dll"
                if not dll_path.exists():
                    log_info("PortAudio DLLをダウンロード中...")
                    download_script = go_portaudio_dir / "download_portaudio.py"
                    if download_script.exists():
                        subprocess.run(["python", str(download_script)], cwd=go_portaudio_dir, check=False)

                # Build simple version
                log_info("Building sync_simple.exe...")
                env = os.environ.copy()
                env["CC"] = "zig cc"
                env["CXX"] = "zig c++"
                env["CGO_ENABLED"] = "1"

                result_simple = subprocess.run(
                    ["go", "build", "-o", str(simple_pa_exe), "./cmd/sync_simple"],
                    cwd=go_portaudio_dir,
                    env=env,
                    check=False,
                )

                # Build smooth version
                log_info("Building sync_smooth.exe...")
                result_smooth = subprocess.run(
                    ["go", "build", "-o", str(smooth_pa_exe), "./cmd/sync_smooth"],
                    cwd=go_portaudio_dir,
                    env=env,
                    check=False,
                )

                if result_simple.returncode == 0 and result_smooth.returncode == 0:
                    log_success("Go版（PortAudio + Zig cc）: ビルド完了")
                else:
                    log_warning("Go版（PortAudio）のビルドに失敗しました")
            else:
                log_info("Go版（PortAudio）のビルドにはZig ccが必要です。")
                log_info("詳細は src/go-portaudio/README.md を参照してください。")


def build_typescript_cli(script_dir: Path) -> None:
    """Build TypeScript CLI version"""
    log_info("[4/5] TypeScript CLI版をビルド中...")

    if not command_exists("npm"):
        log_warning("npmが見つかりません。TypeScript CLI版はスキップします。")
        return

    ts_cli_dir = script_dir / "src" / "typescript" / "cli"
    node_modules = ts_cli_dir / "node_modules"
    naudiodon_path = ts_cli_dir / "node_modules" / "naudiodon"

    # Check if dependencies need to be installed or rebuilt
    needs_install = not node_modules.exists() or not naudiodon_path.exists()

    if needs_install:
        log_info("依存関係をインストール中...")
        result = subprocess.run("npm install", cwd=ts_cli_dir, shell=True, check=False)
        if result.returncode != 0:
            log_error("npm installに失敗しました")
            return

    # Always rebuild to ensure TypeScript is compiled
    log_info("TypeScriptをビルド中...")
    result = subprocess.run("npm run build", cwd=ts_cli_dir, shell=True, check=False)

    if result.returncode == 0:
        log_success("TypeScript CLI版: ビルド完了")
    else:
        log_error("TypeScript CLI版のビルドに失敗しました")


def build_typescript_browser(script_dir: Path) -> None:
    """Build TypeScript Browser version"""
    log_info("[5/5] TypeScript Browser版をビルド中...")

    if not command_exists("npm"):
        log_warning("npmが見つかりません。TypeScript Browser版はスキップします。")
        return

    ts_browser_dir = script_dir / "src" / "typescript" / "browser"
    node_modules = ts_browser_dir / "node_modules"

    if not node_modules.exists():
        log_info("依存関係をインストール中...")
        subprocess.run("npm install", cwd=ts_browser_dir, shell=True, check=False)

    result = subprocess.run("npm run build", cwd=ts_browser_dir, shell=True, check=False)

    if result.returncode == 0:
        log_success("TypeScript Browser版: ビルド完了")
    else:
        log_error("TypeScript Browser版のビルドに失敗しました")


def build_all(script_dir: Path, clean: bool = False) -> None:
    """Build all applications"""
    print("=" * 42)
    print("  Cat Oscillator Sync ビルド＆実行")
    print("=" * 42)
    print()

    if clean:
        log_info("クリーンビルドを開始します...")
    else:
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


def clean_build_all(script_dir: Path) -> None:
    """Clean build all applications using language-specific build scripts"""
    print("=" * 60)
    print("  Cat Oscillator Sync クリーンビルド")
    print("=" * 60)
    print()

    log_info("各言語版のクリーンビルドスクリプトを実行します...")
    print()

    # Python
    log_info("[1/6] Python版...")
    python_script = script_dir / "src" / "python" / "build_and_run.py"
    if python_script.exists():
        result = subprocess.run(
            ["python", str(python_script), "--clean", "--smooth"],
            check=False,
        )
        if result.returncode == 0:
            log_success("Python版: 完了")
        else:
            log_warning("Python版: 一部エラーがありました")
    else:
        log_warning(f"Python版ビルドスクリプトが見つかりません: {python_script}")
    print()

    # Rust
    log_info("[2/6] Rust版...")
    rust_script = script_dir / "src" / "rust" / "build_and_run.py"
    if rust_script.exists():
        result = subprocess.run(
            ["python", str(rust_script), "--clean", "--smooth"],
            check=False,
        )
        if result.returncode == 0:
            log_success("Rust版: 完了")
        else:
            log_warning("Rust版: 一部エラーがありました")
    else:
        log_warning(f"Rust版ビルドスクリプトが見つかりません: {rust_script}")
    print()

    # Go (Pure Go - Oto)
    log_info("[3/6] Go版（Pure Go - Oto）...")
    go_script = script_dir / "src" / "go" / "build_and_run.py"
    if go_script.exists():
        result = subprocess.run(
            ["python", str(go_script), "--clean", "--smooth"],
            check=False,
        )
        if result.returncode == 0:
            log_success("Go版（Oto）: 完了")
        else:
            log_warning("Go版（Oto）: 一部エラーがありました")
    else:
        log_warning(f"Go版ビルドスクリプトが見つかりません: {go_script}")
    print()

    # Go (PortAudio + Zig cc)
    log_info("[4/6] Go版（PortAudio + Zig cc）...")
    go_portaudio_script = script_dir / "src" / "go-portaudio" / "build_and_run.py"
    if go_portaudio_script.exists():
        result = subprocess.run(
            ["python", str(go_portaudio_script), "--clean", "--smooth"],
            check=False,
        )
        if result.returncode == 0:
            log_success("Go版（PortAudio）: 完了")
        else:
            log_warning("Go版（PortAudio）: 一部エラーがありました")
    else:
        log_warning(f"Go版（PortAudio）ビルドスクリプトが見つかりません: {go_portaudio_script}")
    print()

    # TypeScript CLI
    log_info("[5/6] TypeScript CLI版...")
    ts_cli_script = script_dir / "src" / "typescript" / "cli" / "build_and_run.py"
    if ts_cli_script.exists():
        result = subprocess.run(
            ["python", str(ts_cli_script), "--clean", "--smooth"],
            check=False,
        )
        if result.returncode == 0:
            log_success("TypeScript CLI版: 完了")
        else:
            log_warning("TypeScript CLI版: 一部エラーがありました")
    else:
        log_warning(f"TypeScript CLI版ビルドスクリプトが見つかりません: {ts_cli_script}")
    print()

    # TypeScript Browser
    log_info("[6/6] TypeScript Browser版...")
    ts_browser_script = script_dir / "src" / "typescript" / "browser" / "build_and_run.py"
    if ts_browser_script.exists():
        result = subprocess.run(
            ["python", str(ts_browser_script), "--clean", "--build"],
            check=False,
        )
        if result.returncode == 0:
            log_success("TypeScript Browser版: 完了")
        else:
            log_warning("TypeScript Browser版: 一部エラーがありました")
    else:
        log_warning(f"TypeScript Browser版ビルドスクリプトが見つかりません: {ts_browser_script}")
    print()

    log_success("全てのクリーンビルドが完了しました！")
    print()


def show_menu() -> None:
    """Display the application selection menu"""
    print("=" * 50)
    print("  実行するアプリを選択してください")
    print("=" * 50)
    print()
    print("ビルドオプション:")
    print("  99) クリーンビルド - 全言語版をクリーンビルド")
    print()
    print("Python版:")
    print("  1) sync_simple.py  - シンプル版（8msごとに階段状に周波数変化）")
    print("  2) sync_smooth.py  - スムーズ版（指数平滑化で滑らかに周波数変化）")
    print()
    print("Rust版:")
    print("  3) sync_simple     - シンプル版")
    print("  4) sync_smooth     - スムーズ版")
    print()
    print("Go版 (Pure Go - Oto):")
    print("  5) sync_simple_oto - シンプル版 ⭐推奨 (CGO不要)")
    print("  6) sync_smooth_oto - スムーズ版 ⭐推奨 (CGO不要)")
    print()
    print("Go版 (PortAudio + Zig cc):")
    print("  7) sync_simple     - シンプル版 (go-portaudioディレクトリ)")
    print("  8) sync_smooth     - スムーズ版 (go-portaudioディレクトリ)")
    print()
    print("TypeScript版:")
    print("  11) CLI Simple     - CLIシンプル版（Windows専用）")
    print("  12) CLI Smooth     - CLIスムーズ版（Windows専用）")
    print("  13) Browser        - ブラウザ版開発サーバー起動")
    print()
    print("  0) 終了")
    print()


def run_application(choice: str, script_dir: Path) -> bool:
    """Run the selected application. Returns False if should exit."""
    try:
        if choice == "99":
            log_info("クリーンビルドを実行します...")
            print()
            clean_build_all(script_dir)
            return True

        elif choice == "1":
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
            log_info("Go sync_simple_oto (Pure Go版) を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go/bin/sync_simple_oto.exe"], cwd=script_dir, check=False)

        elif choice == "6":
            log_info("Go sync_smooth_oto (Pure Go版) を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go/bin/sync_smooth_oto.exe"], cwd=script_dir, check=False)

        elif choice == "7":
            log_info("Go sync_simple (PortAudio + Zig cc版) を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go-portaudio/bin/sync_simple.exe"], cwd=script_dir, check=False)

        elif choice == "8":
            log_info("Go sync_smooth (PortAudio + Zig cc版) を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            subprocess.run(["src/go-portaudio/bin/sync_smooth.exe"], cwd=script_dir, check=False)

        elif choice == "11":
            log_info("TypeScript CLI Simple を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            ts_cli_dir = script_dir / "src" / "typescript" / "cli"
            subprocess.run(["node", "dist/main.js", "simple"], cwd=ts_cli_dir, check=False)

        elif choice == "12":
            log_info("TypeScript CLI Smooth を起動します...")
            print("マウスを動かして音を制御してください。Ctrl+Cで終了します。")
            ts_cli_dir = script_dir / "src" / "typescript" / "cli"
            subprocess.run(["node", "dist/main.js", "smooth"], cwd=ts_cli_dir, check=False)

        elif choice == "13":
            log_info("TypeScript Browser版の開発サーバーを起動します...")
            log_info("ブラウザで http://localhost:5173 にアクセスしてください。")
            print("Ctrl+Cで終了します。")
            ts_browser_dir = script_dir / "src" / "typescript" / "browser"
            subprocess.run("npm run dev", cwd=ts_browser_dir, shell=True, check=False)

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
