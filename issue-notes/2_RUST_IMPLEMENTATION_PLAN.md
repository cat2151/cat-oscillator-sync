# Rust版 実装計画書

## 概要
Python版のcat-oscillator-syncをRustで実装する計画書です。
Windows環境でのローカル実行を前提とし、PortAudio系のライブラリを使用します。

## 目標
- Python版と同等の機能（マウス制御によるハードシンク・オシレータ）を実装
- Windows環境で動作
- 低レイテンシな音声出力
- シンプルなインストールと実行手順

## ライブラリ選定

### 1. オーディオ出力ライブラリ
**選択肢: cpal (Cross-Platform Audio Library)**
- **メリット:**
  - Rustの純粋なクロスプラットフォームオーディオライブラリ
  - PortAudioと同様の低レイテンシ設計
  - Windowsでは WASAPI を使用（PortAudioも同様）
  - cargo経由で簡単にインストール可能
  - 外部DLLのインストール不要
  - 活発に開発されており、ドキュメントも充実
- **デメリット:**
  - PortAudioそのものではない（異なるAPIデザイン）
- **GitHub:** https://github.com/RustAudio/cpal
- **ドキュメント:** https://docs.rs/cpal/

**代替案: portaudio-rs**
- PortAudioのRustバインディング
- Windows環境ではPortAudio DLLが必要になる可能性
- 開発が比較的停滞気味
- **結論:** 複雑な環境構築が必要になるため優先度低

### 2. マウス位置取得ライブラリ
**選択: rdev**
- **メリット:**
  - クロスプラットフォーム対応
  - マウス位置の取得が簡単
  - 外部依存が少ない
  - Windowsで追加のDLL不要
- **GitHub:** https://github.com/Narsil/rdev
- **ドキュメント:** https://docs.rs/rdev/

**代替案: winapi / windows-rs**
- Windows APIを直接呼び出し
- Windows専用コードになる
- より低レベルな制御が可能
- **結論:** クロスプラットフォーム性を保つためrdevを優先

### 3. 数値計算
**選択: 標準ライブラリ + シンプルな配列操作**
- Rustの標準ライブラリで十分
- NumPy相当の機能が必要な場合はndarray crateを検討
- ただし、このプロジェクトではオーバースペック

## プロジェクト構成

```
src/rust/
├── Cargo.toml              # プロジェクト設定・依存関係
├── IMPLEMENTATION_PLAN.md  # 本ドキュメント
├── README.md              # 実装後のREADME
└── src/
    ├── main.rs            # エントリポイント
    ├── synth_simple.rs    # シンプル版実装
    └── synth_smooth.rs    # スムーズ版実装
```

## 依存関係 (Cargo.toml)

```toml
[package]
name = "cat-oscillator-sync"
version = "0.1.0"
edition = "2021"

[dependencies]
cpal = "0.15"           # オーディオ出力
rdev = "0.5"            # マウス位置取得
```

## 実装計画

### Phase 1: 基本構造の実装
1. Cargoプロジェクトの初期化
2. cpalとrdevの統合テスト
3. オーディオストリームの基本動作確認

### Phase 2: シンプル版の実装 (sync_simple.rs)
1. マウス位置取得の実装
2. 周波数マッピングの実装
3. ハードシンク・オシレータの実装
   - マスターオシレータ（位相管理）
   - スレーブオシレータ（位相リセット）
4. オーディオコールバックの実装
5. 動作確認とデバッグ

### Phase 3: スムーズ版の実装 (sync_smooth.rs)
1. 指数平滑化アルゴリズムの実装
2. サンプルごとの周波数補間
3. 時定数パラメータの調整機能
4. 動作確認とデバッグ

### Phase 4: ドキュメント整備
1. README.mdの更新
2. コードコメントの追加
3. ビルド・実行手順の文書化

## インストール手順（想定）

### 前提条件
- Rust (rustup経由で最新安定版)
  - https://rustup.rs/ からインストール
  - インストーラーが自動的に環境設定

### ビルドと実行
```bash
# リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/rust

# ビルド
cargo build --release

# 実行 - シンプル版
cargo run --release --bin sync_simple

# 実行 - スムーズ版
cargo run --release --bin sync_smooth
```

## 開発環境構築の複雑度評価

### ⭐ 非常に簡単 (優先度: 高)

**理由:**
1. **Rustのインストールのみ:** rustupによる一発インストール
2. **外部DLL不要:** cpalはWindowsの標準API (WASAPI) を直接使用
3. **cargoによる自動管理:** 依存関係は`cargo build`で自動取得
4. **手作業でのDLL配置不要:** すべてがRustのエコシステム内で完結

**必要な手順:**
1. Rustのインストール（rustup実行のみ）
2. `cargo build` の実行

**Python版との比較:**
- Python版: Python + pip + 3つのパッケージのインストール
- Rust版: Rust + cargo build（依存関係自動解決）
- **結論:** ほぼ同等かそれ以上に簡単

## 技術的課題と対策

### 1. リアルタイムオーディオ処理
**課題:** Rustでの低レイテンシ実装
**対策:**
- cpalのストリーム設定で適切なバッファサイズを指定
- コールバック内での処理を最適化（メモリアロケーション回避）

### 2. マウス位置のポーリング
**課題:** バックグラウンドでのマウス位置取得
**対策:**
- 別スレッドでマウス位置を定期的に取得
- Arc<Mutex<T>>またはAtomic型で安全に共有

### 3. エラーハンドリング
**課題:** Rustの厳格な型システムでのエラー処理
**対策:**
- Result型とOption型を適切に使用
- panicを避け、ユーザーフレンドリーなエラーメッセージ

## パフォーマンス期待値

### メリット
- **コンパイル済みネイティブコード:** Python版より高速実行
- **メモリ効率:** ガベージコレクションなし
- **低レイテンシ:** システムコールの直接利用

### Python版との比較
- 起動速度: Rust版がやや速い（インタープリタ起動不要）
- 実行速度: Rust版が大幅に速い（ただし、このアプリでは体感差は小さい）
- CPU使用率: Rust版が低い

## リスクと軽減策

### リスク1: cpalのバグや制限
**軽減策:** 
- 十分に安定したバージョンを使用
- 必要に応じてportaudio-rsに切り替え可能な設計

### リスク2: Rust学習コスト
**軽減策:**
- シンプルな設計を維持
- 既存のRust製オーディオアプリを参考にする

## 成功基準

1. ✅ Windows環境で動作すること
2. ✅ Python版と同等の音質・レスポンスを実現
3. ✅ インストール手順が3ステップ以内
4. ✅ 外部DLLの手動インストールが不要
5. ✅ ビルド時間が5分以内

## 参考資料

### 公式ドキュメント
- Rust公式サイト: https://www.rust-lang.org/
- cpalドキュメント: https://docs.rs/cpal/
- rdevドキュメント: https://docs.rs/rdev/

### 参考プロジェクト
- cpal examples: https://github.com/RustAudio/cpal/tree/master/examples
- Rustオーディオ関連: https://github.com/RustAudio

## タイムライン（想定）

- Phase 1: 1-2時間
- Phase 2: 3-4時間
- Phase 3: 2-3時間
- Phase 4: 1-2時間
- **合計:** 7-11時間（LLMエージェントによる実装を想定）

## まとめ

Rust版の実装は**技術的に実現可能**であり、**開発環境構築も非常にシンプル**です。
cpalライブラリを使用することで、PortAudioと同等の低レイテンシを実現しつつ、
外部DLLの手動インストールを完全に回避できます。

**優先度評価: ⭐⭐⭐⭐⭐ (最高)**

Python版と比較しても遜色なく、むしろビルド後のパフォーマンスとメモリ効率の面で優位性があります。
