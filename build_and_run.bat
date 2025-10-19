@echo off
REM build_and_run.bat
REM このscriptはすべてのcat-oscillator-syncアプリをビルドし、一つずつ実行できるようにします。
REM 用途：物理スピーカーでの人力テストを効率化します。

setlocal enabledelayedexpansion

echo ==========================================
echo   Cat Oscillator Sync ビルド＆実行
echo ==========================================
echo.

REM スクリプトのディレクトリを取得
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM ========================================
REM ビルドフェーズ
REM ========================================

echo [INFO] ビルドを開始します...
echo.

REM Python（ビルド不要だが依存関係チェック）
echo [INFO] [1/5] Python版の依存関係チェック...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    pip list | findstr pyaudio >nul 2>&1
    if %errorlevel% equ 0 (
        echo [SUCCESS] Python版: 準備完了
    ) else (
        echo [WARNING] Python版: pyaudioがインストールされていません
        echo [INFO] インストール中: pip install -r requirements.txt
        pip install -r requirements.txt
    )
) else (
    echo [WARNING] Pythonが見つかりません。Python版はスキップします。
)
echo.

REM Rust
echo [INFO] [2/5] Rust版をビルド中...
cargo --version >nul 2>&1
if %errorlevel% equ 0 (
    cd src\rust
    cargo build --release
    if %errorlevel% equ 0 (
        echo [SUCCESS] Rust版: ビルド完了
    ) else (
        echo [ERROR] Rust版のビルドに失敗しました
    )
    cd "%SCRIPT_DIR%"
) else (
    echo [WARNING] cargoが見つかりません。Rust版はスキップします。
)
echo.

REM Go
echo [INFO] [3/5] Go版をビルド中...
go version >nul 2>&1
if %errorlevel% equ 0 (
    cd src\go
    if not exist bin mkdir bin
    go build -o bin\sync_simple.exe .\cmd\sync_simple
    go build -o bin\sync_smooth.exe .\cmd\sync_smooth
    if %errorlevel% equ 0 (
        echo [SUCCESS] Go版: ビルド完了
    ) else (
        echo [ERROR] Go版のビルドに失敗しました
    )
    cd "%SCRIPT_DIR%"
) else (
    echo [WARNING] goが見つかりません。Go版はスキップします。
)
echo.

REM TypeScript CLI
echo [INFO] [4/5] TypeScript CLI版をビルド中...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    cd src\typescript\cli
    if not exist node_modules (
        echo [INFO] 依存関係をインストール中...
        call npm install
    )
    call npm run build
    if %errorlevel% equ 0 (
        echo [SUCCESS] TypeScript CLI版: ビルド完了
    ) else (
        echo [ERROR] TypeScript CLI版のビルドに失敗しました
    )
    cd "%SCRIPT_DIR%"
) else (
    echo [WARNING] npmが見つかりません。TypeScript CLI版はスキップします。
)
echo.

REM TypeScript Browser
echo [INFO] [5/5] TypeScript Browser版をビルド中...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    cd src\typescript\browser
    if not exist node_modules (
        echo [INFO] 依存関係をインストール中...
        call npm install
    )
    call npm run build
    if %errorlevel% equ 0 (
        echo [SUCCESS] TypeScript Browser版: ビルド完了
    ) else (
        echo [ERROR] TypeScript Browser版のビルドに失敗しました
    )
    cd "%SCRIPT_DIR%"
) else (
    echo [WARNING] npmが見つかりません。TypeScript Browser版はスキップします。
)
echo.

echo [SUCCESS] 全てのビルドが完了しました！
echo.

REM ========================================
REM 実行フェーズ
REM ========================================

:menu
echo ==========================================
echo   実行するアプリを選択してください
echo ==========================================
echo.
echo Python版:
echo   1) sync_simple.py  - シンプル版（8msごとに階段状に周波数変化）
echo   2) sync_smooth.py  - スムーズ版（指数平滑化で滑らかに周波数変化）
echo.
echo Rust版:
echo   3) sync_simple     - シンプル版
echo   4) sync_smooth     - スムーズ版
echo.
echo Go版:
echo   5) sync_simple     - シンプル版
echo   6) sync_smooth     - スムーズ版
echo.
echo TypeScript版:
echo   7) CLI Simple      - CLIシンプル版（Windows専用）
echo   8) CLI Smooth      - CLIスムーズ版（Windows専用）
echo   9) Browser         - ブラウザ版開発サーバー起動
echo.
echo   0) 終了
echo.

set /p choice="選択してください [0-9]: "

if "%choice%"=="1" (
    echo [INFO] Python sync_simple.py を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    python src\python\sync_simple.py
    goto :after_run
)
if "%choice%"=="2" (
    echo [INFO] Python sync_smooth.py を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    python src\python\sync_smooth.py
    goto :after_run
)
if "%choice%"=="3" (
    echo [INFO] Rust sync_simple を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    src\rust\target\release\sync_simple.exe
    goto :after_run
)
if "%choice%"=="4" (
    echo [INFO] Rust sync_smooth を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    src\rust\target\release\sync_smooth.exe
    goto :after_run
)
if "%choice%"=="5" (
    echo [INFO] Go sync_simple を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    src\go\bin\sync_simple.exe
    goto :after_run
)
if "%choice%"=="6" (
    echo [INFO] Go sync_smooth を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    src\go\bin\sync_smooth.exe
    goto :after_run
)
if "%choice%"=="7" (
    echo [INFO] TypeScript CLI Simple を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    cd src\typescript\cli
    node dist\main.js simple
    cd "%SCRIPT_DIR%"
    goto :after_run
)
if "%choice%"=="8" (
    echo [INFO] TypeScript CLI Smooth を起動します...
    echo マウスを動かして音を制御してください。Ctrl+Cで終了します。
    cd src\typescript\cli
    node dist\main.js smooth
    cd "%SCRIPT_DIR%"
    goto :after_run
)
if "%choice%"=="9" (
    echo [INFO] TypeScript Browser版の開発サーバーを起動します...
    echo [INFO] ブラウザで http://localhost:5173 にアクセスしてください。
    echo Ctrl+Cで終了します。
    cd src\typescript\browser
    call npm run dev
    cd "%SCRIPT_DIR%"
    goto :after_run
)
if "%choice%"=="0" (
    echo [INFO] 終了します。
    exit /b 0
)

echo [ERROR] 無効な選択です。0-9の数字を入力してください。
echo.
goto :menu

:after_run
echo.
echo アプリが終了しました。
echo.
goto :menu
