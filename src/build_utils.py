#!/usr/bin/env python3
"""
build_utils.py
共通のビルドユーティリティ関数を提供するモジュール
各言語版のbuild_and_run.pyスクリプトから使用される
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Optional


class Colors:
    """ANSI color codes for terminal output"""

    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    YELLOW = "\033[1;33m"
    BLUE = "\033[0;34m"
    CYAN = "\033[0;36m"
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


def log_step(step: str, message: str) -> None:
    """Print step message"""
    print(f"{Colors.CYAN}[{step}]{Colors.NC} {message}")


def command_exists(command: str) -> bool:
    """Check if a command exists in PATH"""
    return shutil.which(command) is not None


def run_command(
    command: list[str],
    cwd: Optional[Path] = None,
    env: Optional[dict] = None,
    check: bool = True,
) -> subprocess.CompletedProcess:
    """
    Run a command and return the result

    Args:
        command: Command and arguments as list
        cwd: Working directory
        env: Environment variables
        check: Whether to raise exception on non-zero exit code

    Returns:
        CompletedProcess object
    """
    if env is None:
        env = os.environ.copy()

    try:
        result = subprocess.run(
            command,
            cwd=cwd,
            env=env,
            check=check,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return result
    except subprocess.CalledProcessError as e:
        log_error(f"Command failed: {' '.join(command)}")
        if e.stdout:
            print(e.stdout)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        raise


def is_source_newer_than_target(source_files: list[Path], target_file: Path) -> bool:
    """
    Check if any source file is newer than the target file

    Args:
        source_files: List of source file paths
        target_file: Target file path

    Returns:
        True if any source file is newer than target or target doesn't exist
    """
    if not target_file.exists():
        return True

    target_mtime = target_file.stat().st_mtime

    for source_file in source_files:
        if source_file.exists() and source_file.stat().st_mtime > target_mtime:
            return True

    return False


def clean_directory(directory: Path, pattern: str = "*") -> None:
    """
    Clean a directory by removing files matching pattern

    Args:
        directory: Directory to clean
        pattern: Glob pattern for files to remove
    """
    if not directory.exists():
        return

    log_info(f"Cleaning {directory}...")
    for item in directory.glob(pattern):
        if item.is_file():
            item.unlink()
            log_info(f"Removed: {item}")
        elif item.is_dir():
            shutil.rmtree(item)
            log_info(f"Removed directory: {item}")


def ensure_directory(directory: Path) -> None:
    """
    Ensure a directory exists, creating it if necessary

    Args:
        directory: Directory path
    """
    directory.mkdir(parents=True, exist_ok=True)
