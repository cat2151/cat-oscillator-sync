# クイックスタート - Deno版

最速で動かすための手順書です。

## 前提条件

- Linux環境 (X11を使用)
- オーディオデバイスが接続されていること

## 手順

### 1. Denoのインストール

```bash
curl -fsSL https://deno.land/install.sh | sh
```

インストール後、パスを通す：
```bash
# bashの場合
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# zshの場合
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 2. PortAudioのインストール

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install libportaudio2 portaudio19-dev
```

#### Fedora/RHEL
```bash
sudo dnf install portaudio portaudio-devel
```

### 3. 実行

```bash
cd src/typescript/deno
deno task start
```

または

```bash
deno run --unstable-ffi --allow-ffi --allow-env src/main.ts
```

## 操作方法

1. プログラムが起動したら、マウスを動かしてください
2. 音が出れば成功です！
   - **X軸**: マスター周波数 (40Hz - 600Hz)
   - **Y軸**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl+C` で終了

## トラブルシューティング

### エラー: "Failed to initialize X11 display"

**原因**: X11ディスプレイに接続できません

**解決方法**:
- X Window System が起動しているか確認
- SSHで接続している場合、X11フォワーディングを有効にする
  ```bash
  ssh -X user@hostname
  ```
- または、実際の物理ディスプレイで実行してください

### エラー: "Could not open library: libportaudio.so.2"

**原因**: PortAudioがインストールされていません

**解決方法**:
```bash
sudo apt-get install libportaudio2
```

### エラー: "Deno.dlopen is not a function"

**原因**: FFI機能が有効になっていません

**解決方法**: `--unstable-ffi` フラグを付けて実行してください
```bash
deno run --unstable-ffi --allow-ffi --allow-env src/main.ts
```

### エラー: "No default output device found"

**原因**: オーディオデバイスが見つかりません

**解決方法**:
1. オーディオデバイスが接続されているか確認
2. PulseAudioが実行されているか確認
   ```bash
   pulseaudio --check
   ```

## 動作確認環境

- Ubuntu 24.04 LTS
- Deno 1.45.5
- PortAudio 19.6.0
- X11

## 次のステップ

- [README.md](README.md) - 詳細なドキュメント
- [実装計画書](../IMPLEMENTATION_PLAN.md) - TypeScript全体の実装計画
- [メインREADME](../../../README.md) - プロジェクト全体の説明
