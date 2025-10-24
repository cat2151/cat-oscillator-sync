# Go Linux版 マウスポーリング周波数の改善

## 問題

Go版で、マウス位置を変更したときの周波数への変更が、1秒に1回程度しか発生しないという問題がありました。

## 原因

Linux版の`getPositionLinux()`関数が、マウス位置を取得するために毎回`xdotool`コマンドを実行していました。
プロセスの起動は非常に遅く（100-1000ms程度）、コードでは8msごとにマウス位置をポーリングする設定になっていましたが、実際のマウス位置更新は1秒に1回程度しか発生していませんでした。

## 解決方法

X11ライブラリをCGO経由で直接呼び出すように変更しました。

### 実装の詳細

1. **X11の直接呼び出し**
   - `XQueryPointer()` C関数を使用してマウス位置を高速に取得
   - `WidthOfScreen()` / `HeightOfScreen()` を使用して画面サイズを取得
   - CGO binding により、プロセス起動のオーバーヘッドがゼロに

2. **フォールバック機能**
   - X11が利用できない環境では、従来のxdotoolを使用
   - ランタイムで自動的に切り替え
   - エラーメッセージも改善

### コード例

```go
/*
#cgo LDFLAGS: -lX11
#include <X11/Xlib.h>

MousePos get_mouse_position() {
    MousePos result = {0, 0, 0};
    Display *display = XOpenDisplay(NULL);
    if (display == NULL) {
        return result;
    }
    
    Window root = DefaultRootWindow(display);
    Window root_return, child_return;
    int root_x, root_y, win_x, win_y;
    unsigned int mask_return;
    
    if (XQueryPointer(display, root, &root_return, &child_return,
                      &root_x, &root_y, &win_x, &win_y, &mask_return)) {
        result.x = root_x;
        result.y = root_y;
        result.success = 1;
    }
    
    XCloseDisplay(display);
    return result;
}
*/
import "C"

func getPositionLinux() (Position, error) {
    // X11を優先的に使用（高速）
    result := C.get_mouse_position()
    if result.success == 1 {
        return Position{X: int(result.x), Y: int(result.y)}, nil
    }
    
    // フォールバック: xdotoolを使用（低速）
    return getPositionLinuxXdotool()
}
```

## パフォーマンス改善

- **変更前**: ~1 Hz（xdotoolのプロセス起動により制限）
- **変更後**: 125+ Hz（8msポーリング間隔により制限）
- **目標達成**: 10 Hz以上の更新レートを大幅に上回る性能を実現

## ビルド要件

### Linux

X11開発ライブラリが必要です：

```bash
# Ubuntu/Debian
sudo apt-get install libx11-dev

# Fedora/RHEL
sudo dnf install libX11-devel
```

CGOを有効にする必要があります：

```bash
CGO_ENABLED=1 go build ./cmd/sync_simple_oto
CGO_ENABLED=1 go build ./cmd/sync_smooth_oto
```

### Windows

Windows版は影響を受けません。Windows APIの`GetCursorPos`は元から高速です。

## テスト

パフォーマンステストを追加しました：

```bash
cd src/go/internal/mouse
CGO_ENABLED=1 go test -v -run TestGetPositionSpeed
```

このテストは、マウス位置取得が125 Hz以上のレートで動作することを検証します。
（X11が利用できない環境ではスキップされます）

## 影響範囲

この変更は以下のすべてのGoバージョンに適用されます：

- `cmd/sync_simple` (PortAudio版)
- `cmd/sync_smooth` (PortAudio版)
- `cmd/sync_simple_oto` (Pure Go版)
- `cmd/sync_smooth_oto` (Pure Go版)

すべてのバージョンが同じ`internal/mouse`パッケージを使用しているため、すべてのバージョンで自動的にパフォーマンスが改善されます。

## まとめ

Linux版のマウスポーリング周波数が1秒に1回程度から125+ Hzに改善され、要求された10 Hz以上の更新レートを大幅に上回りました。
この変更により、Linux版でもWindows版と同等の応答性を実現しました。
