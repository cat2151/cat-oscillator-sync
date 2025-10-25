@echo off
REM Build script for Go PortAudio version using Zig cc
REM Windows専用ビルドスクリプト

echo ========================================
echo   Go PortAudio版 ビルドスクリプト
echo   (Zig cc使用)
echo ========================================
echo.

REM Check if Zig is installed
where zig >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Zigが見つかりません。
    echo Zigをインストールしてください: https://ziglang.org/download/
    exit /b 1
)

echo [INFO] Zigバージョン:
zig version
echo.

REM Check if Go is installed
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Goが見つかりません。
    echo Goをインストールしてください: https://go.dev/dl/
    exit /b 1
)

echo [INFO] Goバージョン:
go version
echo.

REM Create bin directory
if not exist bin mkdir bin

REM Check if PortAudio DLL exists
if not exist bin\libportaudio64bit.dll (
    echo [WARNING] PortAudio DLLが見つかりません。
    echo [INFO] download_portaudio.pyを実行してDLLをダウンロードしてください:
    echo   python download_portaudio.py
    echo.
)

REM Set environment variables for Zig cc
echo [INFO] Zig ccをコンパイラとして設定...
set CC=zig cc
set CXX=zig c++
set CGO_ENABLED=1

REM Build Simple version
echo [INFO] Simple版をビルド中...
go build -o bin\sync_simple.exe .\cmd\sync_simple
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Simple版のビルドに失敗しました。
    exit /b 1
)
echo [SUCCESS] Simple版のビルドが完了しました: bin\sync_simple.exe
echo.

REM Build Smooth version
echo [INFO] Smooth版をビルド中...
go build -o bin\sync_smooth.exe .\cmd\sync_smooth
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Smooth版のビルドに失敗しました。
    exit /b 1
)
echo [SUCCESS] Smooth版のビルドが完了しました: bin\sync_smooth.exe
echo.

echo ========================================
echo   ビルド完了！
echo ========================================
echo.
echo 実行方法:
echo   cd bin
echo   sync_simple.exe  または  sync_smooth.exe
echo.
