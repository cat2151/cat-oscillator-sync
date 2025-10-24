# 実装計画書 概要・比較

このドキュメントは、Rust版、Go版、TypeScript版の実装計画書の比較サマリーです。

## 各言語の実装計画書

1. **[Rust版実装計画書](2_RUST_IMPLEMENTATION_PLAN.md)**
2. **[Go版実装計画書](2_GO_IMPLEMENTATION_PLAN.md)**
3. **[TypeScript版実装計画書](2_TYPESCRIPT_IMPLEMENTATION_PLAN.md)**
   - **[TypeScript ブラウザ版](6_TYPESCRIPT_BROWSER_README.md)** - 実装完了
   - **[TypeScript Obsidianプラグイン版](20_OBSIDIAN_IMPLEMENTATION_PLAN.md)** - 計画書完成

## 要件

- **対象OS**: Windows
- **オーディオライブラリ**: PortAudio系
- **開発環境構築**: 複雑な手作業（DLL手動インストール等）を避ける

## 総合比較表

| 項目 | Rust版 | Go版 | TypeScript版 |
|-----|--------|------|-------------|
| **推奨度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ (ブラウザ版) |
| **環境構築の複雑度** | ⭐⭐⭐⭐⭐ (簡単) | ⭐⭐⭐ (中程度) | ⭐⭐⭐⭐⭐ (簡単) |
| **オーディオライブラリ** | cpal | portaudio | Web Audio API (ブラウザ版) |
| **PortAudio使用** | ❌ (cpal使用) | ✅ | ❌ (ブラウザ版) / ✅ (Deno版) |
| **外部DLL必要** | ❌ 不要 | ✅ 必要 | ❌ 不要 (ブラウザ版) / ✅ 必要 (Deno版) |
| **ビルドツール** | Rust (rustup) | Go + GCC | Node.js / Deno |
| **インストール手順** | 2-3ステップ | 4-5ステップ | 1ステップ (ブラウザ版) / 3ステップ (Deno版) |
| **想定実装時間** | 7-11時間 | 8-12時間 | 10-15時間 (ブラウザ版) |
| **パフォーマンス** | 最高 | 高 | 高 (Web Audio) |

## 詳細評価

### 1. Rust版 ⭐⭐⭐⭐⭐ (最推奨)

#### ✅ メリット
- **環境構築が非常にシンプル**: Rustインストールのみ（rustup一発）
- **外部DLL不要**: cpalはWASAPI（Windows標準）を直接使用
- **cargo で依存関係自動解決**: 追加の手作業なし
- **最高のパフォーマンス**: ネイティブコード、低レイテンシ
- **メモリ安全性**: Rustの強力な型システム

#### ⚠️ 注意点
- PortAudioそのものではない（cpalを使用）
- ただし、同等以上の低レイテンシを実現可能

#### 📝 インストール手順
```bash
# 1. Rustのインストール
# https://rustup.rs/ から実行

# 2. ビルドと実行
cargo build --release
cargo run --release
```

---

### 2. Go版 ⭐⭐⭐ (中程度の推奨)

#### ✅ メリット
- **PortAudio使用可能**: 要件を満たす
- **並行処理が得意**: ゴルーチンによる効率的な処理
- **シンプルな言語仕様**: 学習コストが低い

#### ❌ デメリット
- **PortAudio DLLの手動インストールが必要**:
  - DLLをダウンロード
  - 適切な場所に配置
- **CGO依存**: GCC（MinGW-w64）のインストールが必要
- **環境構築が複雑**: 4-5ステップ

#### 📝 インストール手順
```bash
# 1. Goのインストール
# 2. GCC (MinGW-w64) のインストール
# 3. PortAudio DLLのダウンロードと配置
# 4. ビルド
go build
```

#### 💡 推奨アプローチ
- **PortAudio + Windows API (syscall)**: マウス位置取得を標準APIで
- robotgoの代わりにWindows APIを直接呼び出すことで依存を削減

---

### 3. TypeScript版

#### 3-A. ブラウザ版 ⭐⭐⭐⭐⭐ (最推奨 - ユーザー体験) ✅ 実装完了

##### ✅ メリット
- **環境構築が最もシンプル**: ブラウザだけ
- **インストール不要**: URLアクセスのみ
- **クロスプラットフォーム**: Windows, macOS, Linux対応
- **Web Audio API**: 低レイテンシ（AudioWorklet使用時）
- **即座に体験可能**: 開発環境不要

##### ⚠️ 注意点
- PortAudioではない（Web Audio API使用）
- ブラウザ依存

##### 📝 インストール手順（エンドユーザー）
```
1. ブラウザでURLにアクセス
```

##### 📝 開発手順
```bash
# 1. Node.jsのインストール
# 2. 依存関係インストール
npm install

# 3. 開発サーバー起動
npm run dev
```

#### 3-B. Deno版 ⭐⭐⭐ (補助的選択肢 - PortAudio要件重視)

##### ✅ メリット
- **PortAudio使用可能**: FFI経由で直接呼び出し
- **モダンなTypeScript環境**: ビルド不要
- **依存関係管理がシンプル**: Denoの標準機能

##### ❌ デメリット
- **PortAudio DLLの手動配置が必要**
- **FFI APIの学習コストが高い**: 低レベルAPIの理解が必要
- **まだ発展途上**: 安定性に懸念

##### 📝 インストール手順
```bash
# 1. Denoのインストール
irm https://deno.land/install.ps1 | iex

# 2. PortAudio DLLのダウンロードと配置
# 3. 実行
deno task start
```

#### 3-C. Node.js版 ⭐ (非推奨)

##### ❌ デメリット（推奨しない理由）
- **ネイティブモジュールのビルドが非常に複雑**:
  - Python 2.7のインストール
  - Visual Studio Build Toolsのインストール
  - node-gypの設定
- **PortAudioバインディングがメンテナンスされていない**
- **ビルド失敗のリスクが高い**

#### 3-D. Obsidianプラグイン版 ⭐⭐⭐⭐ (計画中 - Obsidian統合)

##### ✅ メリット
- **Obsidian環境で音声合成**: ノートテイキングアプリ内で動作
- **ブラウザ版のコード再利用**: Web Audio APIとAudioWorkletを流用
- **コマンドベースの制御**: Obsidianのコマンドパレットから操作
- **デスクトップ統合**: Obsidianの一部として動作

##### ⚠️ 注意点
- デスクトップ版Obsidianのみ対応（Web Audio API制限）
- Obsidian Plugin APIの学習が必要
- AudioWorkletモジュールのバンドル対応が必要

##### 📝 実装計画
- **[実装計画書](20_OBSIDIAN_IMPLEMENTATION_PLAN.md)** - 完成
- コマンド方式（Toggle/Enable/Disable）を採用
- ブラウザ版からSynthクラスとAudioWorkletを移植
- obsidian-plugin-abcjsを参考に実装

##### 📝 インストール手順（計画）
```bash
# 開発環境
npm install
npm run dev

# Obsidianのプラグインフォルダにコピー
# - Windows: %APPDATA%\Obsidian\plugins\
# - macOS: ~/Library/Application Support/obsidian/plugins/
# - Linux: ~/.config/obsidian/plugins/
```

---

## 推奨実装戦略

### 最優先: Rust版 + TypeScript（ブラウザ版）

#### なぜこの組み合わせか？

1. **Rust版（ローカルアプリ）**:
   - Windowsローカル環境で最高のパフォーマンス
   - 環境構築が非常にシンプル
   - PortAudioと同等の低レイテンシ（cpal使用）

2. **TypeScript ブラウザ版（Web版）**:
   - 最も広くアクセス可能
   - インストール不要で即座に体験可能
   - クロスプラットフォーム対応

#### この組み合わせのメリット
- ✅ **2つの異なるユースケースをカバー**:
  - ローカルで高性能に使いたいユーザー → Rust版
  - 手軽にブラウザで試したいユーザー → ブラウザ版
- ✅ **どちらも環境構築が簡単**
- ✅ **どちらも低レイテンシを実現**

### 補助的選択肢: Go版 または Deno版

#### Go版を選ぶ場合
- PortAudio要件を厳密に満たしたい
- Goの学習・検証を優先したい
- ただし、DLL手動配置の手間を受け入れる

#### Deno版を選ぶ場合
- TypeScriptでPortAudioを使いたい
- モダンなランタイムを試したい
- FFI APIの学習コストを受け入れる

---

## PortAudio要件についての考察

### 要件の解釈

元の要件: **"ライブラリはPortAudio系（Python版と同様）を前提とする"**

### 2つの解釈

1. **厳密な解釈**: PortAudioライブラリを使用すること
   - **該当**: Go版、Deno版
   - **非該当**: Rust版（cpal）、ブラウザ版（Web Audio API）

2. **意図の解釈**: Python版と同等の低レイテンシオーディオ処理を実現すること
   - **該当**: すべてのバージョン
   - Rust版（cpal）もWeb Audio APIも低レイテンシを実現可能

### 推奨する考え方

**目的重視のアプローチ**:
- PortAudioの使用は「手段」であり、「目的」は低レイテンシな音声合成
- cpalやWeb Audio APIも同等の低レイテンシを実現可能
- **シンプルさとパフォーマンスを優先**することを推奨

ただし、以下のような選択肢も提供:
- **厳密な要件重視**: Go版またはDeno版を選択
- **シンプルさ重視**: Rust版またはブラウザ版を選択

---

## まとめ

### 推奨実装の優先順位

#### 第1優先: Rust版 ⭐⭐⭐⭐⭐
- **理由**: 最高のパフォーマンス + 最もシンプルな環境構築
- **メリット**: 外部DLL不要、cargo自動解決
- **用途**: ローカルアプリケーションとして

#### 第2優先: TypeScript ブラウザ版 ⭐⭐⭐⭐⭐
- **理由**: 最も広くアクセス可能 + インストール不要
- **メリット**: クロスプラットフォーム、即座に体験可能
- **用途**: Webアプリケーションとして

#### 第3優先: Go版 ⭐⭐⭐
- **理由**: PortAudio要件を満たす
- **デメリット**: DLL手動配置が必要
- **用途**: PortAudioの厳密な使用が必要な場合

#### 第4優先: TypeScript Deno版 ⭐⭐⭐
- **理由**: TypeScriptでPortAudioを使用
- **デメリット**: FFI学習コスト、DLL必要
- **用途**: モダンなTypeScript環境での実験

#### 第5優先: TypeScript Obsidianプラグイン版 ⭐⭐⭐⭐
- **理由**: Obsidian環境での音声合成を検証
- **メリット**: ブラウザ版コード再利用、デスクトップ統合
- **用途**: Obsidianノートテイキングアプリでの音声合成検証

#### 非推奨: Node.js版 ⭐
- **理由**: 環境構築が非常に複雑、メンテナンスされていない

---

## 各言語の詳細は個別の計画書を参照

- [Rust版実装計画書](2_RUST_IMPLEMENTATION_PLAN.md)
- [Go版実装計画書](2_GO_IMPLEMENTATION_PLAN.md)
- [TypeScript版実装計画書](2_TYPESCRIPT_IMPLEMENTATION_PLAN.md)
  - [TypeScript ブラウザ版 README](6_TYPESCRIPT_BROWSER_README.md) - 実装完了
  - [TypeScript Obsidianプラグイン版 実装計画書](20_OBSIDIAN_IMPLEMENTATION_PLAN.md) - 計画書完成
