# マウス周波数更新問題 - 診断ツール実装完了報告

## 問題の概要

**報告された問題:** TypeScript CLI版で、マウス位置を変更したときの周波数への変更が、10秒に1回程度しか発生しない。

**目標:** せめて1秒に10回程度（≥10Hz）の周波数変更を実現する。

## 実装した内容

この問題を診断・解決するため、包括的な診断ツールセットを実装しました。

### 📊 4つの診断スクリプト

#### 1. マウスキャプチャテスト (`test-mouse-capture.ts`)
```powershell
npm run diag:mouse
```
- **目的:** マウス位置が125Hzで正しく取得できるかをテスト
- **テスト時間:** 5秒
- **確認項目:**
  - ポーリングレート（目標: 125Hz）
  - 位置変化検出回数
  - タイミング分析

#### 2. 周波数スイープテスト (`test-frequency-sweep.ts`)
```powershell
npm run diag:freq
```
- **目的:** オーディオシステムが125Hzで周波数変更できるかをテスト
- **テスト内容:** 1秒間で440Hz→1760Hzへスイープ（125ステップ）
- **確認項目:**
  - 周波数更新レート（目標: 125Hz）
  - タイミングジッタ
  - オーディオの連続性

#### 3. マウス制御オーディオテスト (`test-mouse-audio.ts`)
```powershell
npm run diag:audio
```
- **目的:** マウス入力とオーディオ出力の統合をテスト
- **テスト内容:** マウスX座標を周波数にマッピング（220Hz-1760Hz）
- **確認項目:**
  - 周波数変更検出率（目標: ≥10Hz）
  - マウス→周波数のレスポンス
  - 統合の安定性

#### 4. 診断版メインプログラム (`main-diagnostic.ts`)
```powershell
npm run diag:main
```
- **目的:** 通常版にエラーログと統計を追加
- **機能:**
  - リアルタイムで成功率表示
  - エラーメッセージの記録と表示
  - 終了時に詳細な診断情報を表示

### 📚 4つのドキュメント

1. **README.md** - TypeScript CLI のメインドキュメント
   - クイックスタートガイド
   - アーキテクチャ概要
   - トラブルシューティング
   - 技術詳細

2. **DIAGNOSTIC_GUIDE.md** - ユーザー向け診断ガイド
   - 各テストの実行手順
   - 診断フローチャート
   - 結果の解釈方法
   - 結果記録テンプレート

3. **INVESTIGATION_REPORT.md** - 技術調査レポート
   - 問題分析
   - 診断基準の閾値テーブル
   - 5つの問題パターンと対策
   - 技術的考察

4. **src/diagnostics/README.md** - 診断スクリプトの技術ドキュメント
   - 各スクリプトの技術仕様
   - 診断ポイント
   - 使用方法

## 診断基準の閾値

| メトリクス | 正常 | 警告 | 問題 |
|----------|------|------|------|
| マウスキャプチャ成功率 | ≥90% | 50-90% | <50% |
| マウス変化検出レート | ≥10Hz | 5-10Hz | <5Hz |
| 周波数更新レート（スイープ） | ≥100Hz | 10-100Hz | <10Hz |
| タイミングジッタ | <2ms | 2-5ms | >5ms |
| 周波数変更レート（統合） | ≥10Hz | 5-10Hz | <5Hz |
| main-diagnostic成功率 | ≥90% | 50-90% | <50% |
| main-diagnostic更新レート | ≥10Hz | 5-10Hz | <5Hz |

## 特定された潜在的な問題

### 現在のコードの問題点

`src/typescript/cli/src/main.ts` の90-115行目：

```typescript
const pollInterval = setInterval(() => {
    try {
        const pos = getMousePosition();
        // ... 周波数の更新処理 ...
    } catch (error) {
        // Ignore mouse position errors  ← ここが問題の可能性
    }
}, POLLING_INTERVAL_MS);
```

**問題:** エラーを完全に黙殺している
- `getMousePosition()`が頻繁に失敗している可能性
- ユーザーにはフィードバックが一切ない
- エラー率が高いと、10秒に1回の更新になる説明がつく

### 5つの問題パターン

#### パターンA: robotjsの問題
- **症状:** マウスキャプチャ失敗率が高い
- **原因:** 権限不足、セキュリティソフト、インストール問題
- **対策:** 管理者権限、robotjs再インストール、代替ライブラリ

#### パターンB: オーディオシステムの問題
- **症状:** 周波数更新レートが低い、音が途切れる
- **原因:** バッファリング、バックプレッシャー処理
- **対策:** バッファサイズ調整、別のオーディオライブラリ

#### パターンC: setIntervalの精度問題
- **症状:** ポーリングレートが一貫して低い（60-80Hz）
- **原因:** Windowsタイマー解像度の制限（10-16ms）
- **対策:** ポーリング間隔の調整、高精度タイマーの使用

#### パターンD: hard syncアルゴリズムの処理負荷
- **症状:** 診断スクリプトは成功するがメインのみ遅い
- **原因:** 2つのオシレータの計算負荷
- **対策:** アルゴリズムの最適化、Web Worker化

#### パターンE: 再現性の問題
- **症状:** すべてのテストが成功
- **原因:** 診断版と通常版の微妙な違い、環境依存
- **対策:** プロファイリング、環境詳細調査

## 次のステップ（ユーザーアクション）

### Step 1: 診断ツールの実行

Windows環境で以下を順番に実行してください：

```powershell
cd src/typescript/cli

# 1. マウスキャプチャテスト（5秒間マウスを動かす）
npm run diag:mouse

# 2. 周波数スイープテスト（音を聞く）
npm run diag:freq

# 3. マウス制御オーディオテスト（5秒間マウスを左右に動かす）
npm run diag:audio

# 4. 診断版メインプログラム（自由に使用、Ctrl+Cで終了）
npm run diag:main
```

### Step 2: 結果の記録

`DIAGNOSTIC_GUIDE.md` の「結果の記録」セクションのテンプレートを使用して、各テストの結果を記録してください。

特に重要な情報：
- 各テストのメトリクス（Hz、成功率、など）
- エラーメッセージ（あれば）
- 使用しているマウスの種類
- Windowsバージョン、Node.jsバージョン

### Step 3: 結果の報告

GitHub Issueに以下を報告：
1. 4つのテストすべての出力（テキストコピー）
2. 記録した結果テンプレート
3. 環境情報（Windows, Node.js, マウスのポーリングレート）

### Step 4: 問題の特定と修正

報告された結果に基づいて、以下を実施します：

1. **問題パターンの特定**
   - 診断結果をパターンA～Eと照合
   - 根本原因を絞り込む

2. **修正の実装**
   - 特定されたパターンに応じた修正を実装
   - 例: robotjsの問題 → エラーハンドリング改善、代替ライブラリ検討

3. **修正の検証**
   - 修正版で再度診断ツールを実行
   - 目標（≥10Hz）が達成されたことを確認

## セットアップ方法（初回のみ）

```powershell
# TypeScript CLIディレクトリに移動
cd src/typescript/cli

# 依存パッケージのインストール
npm install

# TypeScriptのビルド
npm run build

# 診断ツールが使用可能になります
```

## トラブルシューティング

### ビルドエラーが発生する場合

```powershell
# Visual Studio Build Toolsのインストール
winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"

# PowerShellを再起動後、再試行
npm install
npm run build
```

### 管理者権限が必要な場合

PowerShellを右クリック → 「管理者として実行」で開いてから実行してください。

## ファイル構成

```
src/typescript/cli/
├── README.md                      ← メインドキュメント
├── DIAGNOSTIC_GUIDE.md            ← ユーザー向けガイド
├── INVESTIGATION_REPORT.md        ← 技術調査レポート
├── package.json                   ← npm scripts追加済み
├── tsconfig.json
└── src/
    ├── main.ts                    ← オリジナル（変更なし）
    ├── mouse/
    │   └── position.ts
    ├── synth/
    │   ├── simple.ts
    │   └── smooth.ts
    ├── audio/
    │   └── output.ts
    └── diagnostics/               ← 新規追加
        ├── README.md              ← 技術ドキュメント
        ├── test-mouse-capture.ts  ← Test 1
        ├── test-frequency-sweep.ts← Test 2
        ├── test-mouse-audio.ts    ← Test 3
        └── main-diagnostic.ts     ← Test 4
```

## セキュリティ

✅ CodeQL セキュリティスキャン実施済み - アラート0件

## まとめ

この実装により：

✅ 問題を切り分けるための4つの独立したテストスクリプト
✅ 包括的なドキュメント（技術版とユーザー版）
✅ 簡単に実行できるnpm scripts
✅ 客観的な診断基準（閾値テーブル）
✅ 5つの問題パターンと対策案

が提供されました。

**次のアクション:** ユーザーによる診断実行と結果報告

診断結果に基づいて、適切な修正を実装し、問題を解決します。

---

## 参考リンク

- [TypeScript CLI README](./README.md)
- [診断ガイド](./DIAGNOSTIC_GUIDE.md)
- [調査レポート](./INVESTIGATION_REPORT.md)
- [診断スクリプト技術ドキュメント](./src/diagnostics/README.md)
