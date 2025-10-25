#!/usr/bin/env python3
"""
download_portaudio.py
PortAudio DLLをGitHubからダウンロードするスクリプト

このスクリプトは、spatialaudio/portaudio-binaries リポジトリから
PortAudio DLLを自動的にダウンロードします。

python-sounddeviceもここから入手しており、比較的safeかつ可用性が高いと判断します。
"""

import sys
import urllib.request
from pathlib import Path

# PortAudio バイナリのダウンロードURL
PORTAUDIO_BINARIES_BASE_URL = "https://raw.githubusercontent.com/spatialaudio/portaudio-binaries/master/"

# ダウンロードする DLL ファイルのリスト
# 64-bit DLL (ASIO対応版を使用)
DLL_FILES = {
    "libportaudio64bit.dll": "libportaudio64bit.dll",
}


def download_file(url: str, dest_path: Path) -> bool:
    """
    URLからファイルをダウンロードする

    Args:
        url: ダウンロード元URL
        dest_path: 保存先のパス

    Returns:
        成功したらTrue、失敗したらFalse
    """
    try:
        print(f"ダウンロード中: {url}")
        print(f"保存先: {dest_path}")

        # ファイルをダウンロード
        with urllib.request.urlopen(url) as response:
            data = response.read()
            dest_path.write_bytes(data)

        print(f"✓ ダウンロード完了: {dest_path.name}")
        return True

    except Exception as e:
        print(f"✗ ダウンロード失敗: {e}", file=sys.stderr)
        return False


def main() -> int:
    """
    メイン処理

    Returns:
        終了コード (0: 成功, 1: 失敗)
    """
    # スクリプトのディレクトリ（src/go）を取得
    script_dir = Path(__file__).parent.resolve()

    # binディレクトリを作成
    bin_dir = script_dir / "bin"
    bin_dir.mkdir(exist_ok=True)

    print("=" * 60)
    print("PortAudio DLL ダウンロードツール")
    print("=" * 60)
    print()
    print(f"ダウンロード元: {PORTAUDIO_BINARIES_BASE_URL}")
    print(f"保存先ディレクトリ: {bin_dir}")
    print()

    # 各DLLファイルをダウンロード
    all_success = True
    for dll_name, url_name in DLL_FILES.items():
        dest_path = bin_dir / dll_name
        url = PORTAUDIO_BINARIES_BASE_URL + url_name

        # 既に存在する場合はスキップ
        if dest_path.exists():
            print(f"✓ 既に存在: {dll_name}")
            continue

        # ダウンロード実行
        if not download_file(url, dest_path):
            all_success = False

    print()
    if all_success:
        print("✓ すべてのDLLのダウンロードが完了しました")
        print()
        print("注意: Goアプリケーションを実行する際は、")
        print(f"      {bin_dir} ディレクトリ内でビルドした実行ファイルを実行するか、")
        print("      DLLを実行ファイルと同じディレクトリに配置してください。")
        return 0
    else:
        print("✗ 一部のDLLのダウンロードに失敗しました", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
