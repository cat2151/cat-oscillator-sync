# cat-oscillator-sync

🎵 マウスで鳴らせるオシレータ・ハードシンク・シンセサイザー

## 概要

`cat-oscillator-sync` は、マウスの位置によってリアルタイムに音響合成パラメータを制御できるインタラクティブなシンセサイザーです。ハードシンク（オシレータ同期）技術を使用して、豊かで表現力のある音色を生成します。

### 主な特徴

- **リアルタイムマウス制御**: X軸でマスター周波数、Y軸でスレーブ周波数を制御
- **ハードシンク**: マスターオシレータがスレーブオシレータの位相をリセットし、独特の音色を生成
- **スムーズな遷移**: 指数平滑化による滑らかな周波数変化
- **低レイテンシ**: 8msのポーリング間隔で高い応答性を実現
- **マルチ言語対応**: Python、Rust、Go、TypeScriptでの実装を計画
  - 現在Pythonが実装済み

## デモ

マウスを動かすことで以下のように音響パラメータが変化します：

- **X軸 (横方向)**: マスター周波数 (40Hz - 600Hz)
- **Y軸 (縦方向)**: スレーブ周波数 (100Hz - 2000Hz)

## インストール

### 必要な環境

- Python 3.8+
- pip

### Pythonライブラリのインストール

```bash
pip install -r requirements.txt
```

## 使用方法

### シンプル版 (8msごとに階段状に周波数が変化)

```bash
python src/python/sync_simple.py
```

### スムーズ版 (1サンプルごとに滑らかに周波数が変化)

```bash
python src/python/sync_smooth.py
```

### 操作方法

1. プログラムを実行するとオーディオストリームが開始されます
2. マウスを画面上で動かして音を制御してください
3. `Ctrl + C` で終了

## 技術詳細

### ハードシンク（オシレータ同期）とは

ハードシンクは、一つのオシレータ（マスター）が別のオシレータ（スレーブ）の位相を強制的にリセットする音響合成技術です。これにより：

- 豊かな倍音を持つ音色が生成される
- マスター周波数とスレーブ周波数の比率によって音色が変化
- 古典的なアナログシンセサイザーで使われていた技法

### 実装の違い

#### sync_simple.py
- マウス位置の変化が8msごとに音に反映される
- 急激にマウスを動かすと、階段状に周波数が変化し、アナログシンセ特有の滑らかな音が再現できないことがある
- シンプルな実装のため、仕組みを学びやすい

#### sync_smooth.py
- 指数平滑化により1サンプルごとの滑らかな周波数変化を実現
- 時定数（デフォルト16ms）で滑らかさを調整可能
- より音楽的で実用的な動作

### パラメータ設定

```python
synth = MouseControlledSynth(
    samplerate=48000,        # サンプリングレート
    time_constant_ms=16,     # 時定数（応答速度）
    polling_interval_ms=8    # マウスポーリング間隔
)
```

## プロジェクト構造

```
cat-oscillator-sync/
├── LICENSE                 # MITライセンス
├── README.md              # このファイル
├── pytest.ini            # pytest設定
├── ruff.toml              # コード品質ツール設定
└── src/
    ├── python/
    │   ├── sync_simple.py  # シンプル版実装
    │   └── sync_smooth.py  # スムーズ版実装
    ├── go/                # Go実装（予定）
    ├── rust/              # Rust実装（完了）
    └── typescript/        # TypeScript実装
        ├── browser/       # ブラウザ版（完了）
        └── cli/           # CLI版（Node.js・Windows専用）
```

## 開発

### コード品質の維持

このプロジェクトでは [ruff](https://docs.astral.sh/ruff/) を使用してコード品質を維持しています。

```bash
# フォーマット
ruff format src/ tests/

# リントチェック
ruff check src/ tests/

# 自動修正可能な問題を修正
ruff check --fix src/ tests/
```

### 推奨VSCode拡張機能

- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Ruff (charliermarsh.ruff)
- EditorConfig for VS Code (editorconfig.editorconfig)

## 今後の予定

- [x] Rust実装 - [実装計画書](src/rust/IMPLEMENTATION_PLAN.md) | [README](src/rust/README.md) | [クイックスタート](src/rust/QUICKSTART.md)
- [x] Go実装 - [実装計画書](src/go/IMPLEMENTATION_PLAN.md) | [README](src/go/README.md) | [クイックスタート](src/go/QUICKSTART.md)
- [x] TypeScript実装（ブラウザ版） - [実装計画書](src/typescript/IMPLEMENTATION_PLAN.md) | [README](src/typescript/browser/README.md)
- [x] TypeScript実装（CLI版・Windows専用） - [実装計画書](src/typescript/IMPLEMENTATION_PLAN.md) | [README](src/typescript/cli/README.md) | [クイックスタート](src/typescript/cli/QUICKSTART.md)
- [ ] TypeScript実装（Obsidianプラグイン版） - [実装計画書](src/obsidian/IMPLEMENTATION_PLAN.md) | [README](src/obsidian/README.md)

**実装計画の詳細**: [実装計画書サマリー](src/IMPLEMENTATION_PLAN_SUMMARY.md)をご覧ください。

## projectのゴール
- [x] Python:
  - ローカルで起動1秒で音が鳴るシンプルなアプリを、
  - LLM chatbotでcode生成させ、手軽にinstallして、鳴らすこと
  - が実現できるか？を検証すること
  - 結果、実現できた
- [x] Rust:
  - pythonでLLM chatbotに実装させたこのシンプルなコードが、
  - Rustでもagentにより移植可能か？を検証すること
  - 結果、実現できた（minimal版とsimple版の両方を実装）
- [x] Go:
  - 同様にGoでもagentにより移植可能か？を検証すること
  - 結果、実現できた（simple版とsmooth版の両方を実装）
- [x] TypeScript:
  - 同様にTypeScriptでもagentにより移植可能か？を検証すること
  - 結果、実現できた（ブラウザ版として実装）

## スコープ外
- MIDI制御
- エフェクト追加
- オーディオプラグイン化

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。
