# TypeScript CLI Mouse Frequency Update Issue - Investigation Report

## 問題の概要

**Issue:** TypeScript CLI版で、マウス位置を変更したときの周波数への変更が、10秒に1回程度しか発生しない。

**目標:** せめて1秒に10回程度（≥10Hz）の周波数変更を実現する。

## 現状の実装分析

### ポーリング設定

`src/typescript/cli/src/main.ts`の設定：

```typescript
const POLLING_INTERVAL_MS = 8;  // 8ms間隔 = 125Hz
```

理論上は125Hzでマウス位置をポーリングしており、これは目標の10Hz（100ms間隔）を大きく上回っている。

### マウスポーリングループ

```typescript
const pollInterval = setInterval(() => {
    try {
        const pos = getMousePosition();  // robotjsを使用
        const freqMaster = mapRange(pos.x, 0, screen.width, MASTER_FREQ_MIN, MASTER_FREQ_MAX);
        const freqSlave = mapRange(screen.height - pos.y, 0, screen.height, SLAVE_FREQ_MIN, SLAVE_FREQ_MAX);
        synth.setMasterFrequency(freqMaster);
        synth.setSlaveFrequency(freqSlave);
    } catch (error) {
        // Ignore mouse position errors  ← 問題の可能性
    }
}, POLLING_INTERVAL_MS);
```

### 潜在的な問題点

1. **エラーの黙殺**
   - `catch`ブロックでエラーを完全に無視している
   - `getMousePosition()`が頻繁に失敗している可能性
   - ユーザーには一切のフィードバックがない

2. **robotjsの信頼性**
   - robotjsはネイティブモジュール（C++バインディング）
   - Windows環境での権限やセキュリティソフトの影響を受ける可能性
   - コンパイルやインストールの問題がある可能性

3. **setIntervalの精度**
   - JavaScriptのsetIntervalは正確ではない
   - Windowsのタイマー解像度は通常10-16ms程度
   - 8ms間隔の指定でも実際には16ms程度になる可能性

4. **hard syncアルゴリズムの処理負荷**
   - メインプログラムは2つのオシレータ（マスター/スレーブ）を使用
   - 位相リセットの処理が発生
   - オーディオ生成の負荷がポーリングに影響する可能性

## 診断アプローチ

### Phase 1: 独立コンポーネントのテスト

問題を切り分けるため、以下の4つの診断スクリプトを作成：

#### 1. test-mouse-capture.ts
- **目的:** マウス位置取得が125Hzで動作するかを確認
- **方法:** robotjsを使用して5秒間マウス位置をポーリング
- **メトリクス:** 
  - ポーリングレート
  - 位置変化検出回数
  - タイミング分析

#### 2. test-frequency-sweep.ts
- **目的:** オーディオシステムが125Hzで周波数変更できるかを確認
- **方法:** シンプルなサイン波で440Hz→1760Hzのスイープを1秒で実行
- **メトリクス:**
  - 実際の更新レート
  - タイミングジッタ
  - オーディオの連続性

#### 3. test-mouse-audio.ts
- **目的:** マウス入力とオーディオ出力の統合をテスト
- **方法:** マウスX座標を周波数にマッピング（サイン波使用）
- **メトリクス:**
  - 周波数変更検出率
  - マウス→周波数のレスポンス
  - 統合の安定性

#### 4. main-diagnostic.ts
- **目的:** メインプログラムのエラーを可視化
- **方法:** 通常版にエラーログと統計情報を追加
- **メトリクス:**
  - ポーリング成功率
  - エラー回数とメッセージ
  - 周波数更新レート

### Phase 2: 診断結果の分析パターン

#### パターンA: robotjsの問題

**症状:**
- test-mouse-capture でエラー率が高い（>50%）
- main-diagnostic で成功率が低い

**原因:**
- robotjsのインストールやコンパイルに問題
- Windowsの権限不足
- セキュリティソフトによるブロック

**対策:**
1. 管理者権限で実行
2. robotjsの再インストール
3. セキュリティソフトの設定確認
4. 代替ライブラリの検討（例: node-global-key-listener）

#### パターンB: オーディオシステムの問題

**症状:**
- test-frequency-sweep で更新レートが低い（<10Hz）
- 音が途切れる

**原因:**
- speakerパッケージのバッファリング問題
- バックプレッシャー処理の不具合
- システムのオーディオ設定

**対策:**
1. バッファサイズの調整
2. バックプレッシャー処理の改善
3. 異なるオーディオライブラリの検討

#### パターンC: setIntervalの精度問題

**症状:**
- 単体テストは成功するが、実際のポーリングレートが低い
- 一貫して16ms程度の間隔になっている

**原因:**
- Windowsのタイマー解像度の制限
- setIntervalの実装上の制約

**対策:**
1. ポーリング間隔を16msに調整（約60Hz）
2. より高精度なタイマー（setImmediate + ビジーウェイト）の使用
3. ネイティブモジュールによる高精度タイマーの実装

#### パターンD: hard syncアルゴリズムの処理負荷

**症状:**
- 診断スクリプト（サイン波）は成功
- メインプログラムのみ周波数更新レートが低い

**原因:**
- 2つのオシレータの計算負荷
- 位相リセットの頻繁な発生
- メモリアロケーション

**対策:**
1. オーディオ生成の最適化
2. バッファサイズの調整
3. Web Workerやネイティブモジュールへの移行検討

#### パターンE: すべてのテストが成功

**症状:**
- 診断スクリプトはすべて正常
- main-diagnostic も正常
- しかし通常版で問題が発生

**原因:**
- 診断版と通常版の微妙な違い
- エラーログの出力自体が問題を隠蔽
- 再現性の問題

**対策:**
1. 通常版のコードをさらに詳細に調査
2. プロファイリングツールの使用
3. ユーザー環境の詳細情報収集

## 実装した診断ツール

### ファイル構成

```
src/typescript/cli/
├── src/
│   └── diagnostics/
│       ├── test-mouse-capture.ts      # Test 1: マウスキャプチャ
│       ├── test-frequency-sweep.ts    # Test 2: 周波数スイープ
│       ├── test-mouse-audio.ts        # Test 3: マウス制御オーディオ
│       ├── main-diagnostic.ts         # Test 4: 診断版メイン
│       └── README.md                  # 技術ドキュメント
├── DIAGNOSTIC_GUIDE.md                # ユーザーガイド
└── package.json                       # npm scripts追加
```

### npm Scripts

```json
{
  "scripts": {
    "diag:mouse": "tsc && node dist/diagnostics/test-mouse-capture.js",
    "diag:freq": "tsc && node dist/diagnostics/test-frequency-sweep.js",
    "diag:audio": "tsc && node dist/diagnostics/test-mouse-audio.js",
    "diag:main": "tsc && node dist/diagnostics/main-diagnostic.js"
  }
}
```

## 使用方法

### クイックスタート

```powershell
cd src/typescript/cli
npm install
npm run build

# 順番に実行することを推奨
npm run diag:mouse   # Step 1
npm run diag:freq    # Step 2
npm run diag:audio   # Step 3
npm run diag:main    # Step 4
```

### 結果の解釈

各テストの結果を記録し、上記の「診断結果の分析パターン」と照合することで、問題の原因を特定できます。

詳細な手順は `DIAGNOSTIC_GUIDE.md` を参照してください。

## 次のステップ

1. **ユーザーによる診断実行**
   - Windows環境で4つのテストを実行
   - 結果を記録してフィードバック

2. **問題の特定**
   - 診断結果から問題のパターンを特定
   - 原因を絞り込む

3. **修正の実装**
   - 特定された問題に対する修正を実装
   - 修正版で再度テスト

4. **検証**
   - 修正が問題を解決したことを確認
   - パフォーマンスが目標（≥10Hz）を達成したことを確認

## 技術的な考察

### マウスポーリングレートについて

一般的なマウスのポーリングレートは125Hz（8ms間隔）です。ゲーミングマウスでは1000Hz以上のものもあります。

**重要:** マウスのハードウェアポーリングレートと、ソフトウェアのポーリングレートは別物です。
- マウス→OS: ハードウェアポーリングレート（125Hz, 1000Hzなど）
- ソフトウェア→マウス状態: setIntervalのポーリング（本実装では125Hzを目標）

### robotjsの制約

robotjsは便利ですが、以下の制約があります：
- ネイティブモジュールのためコンパイルが必要
- Windows, macOS, Linuxで動作が異なる
- セキュリティソフトに検出される可能性
- 管理者権限が必要な場合がある

将来的には、より安定した代替手段を検討すべきかもしれません。

### setIntervalの精度

JavaScriptのsetIntervalは以下の理由で正確ではありません：
- イベントループの他のタスクの影響
- OSのタイマー解像度の制限（Windowsは通常10-16ms）
- ガベージコレクションの影響

より高精度なタイマーが必要な場合：
1. setImmediateとビジーウェイトの組み合わせ
2. ネイティブモジュールの使用
3. Web Worker（ブラウザ版の場合）

## 参考資料

- [Node.js setInterval documentation](https://nodejs.org/api/timers.html#timers_setinterval_callback_delay_args)
- [robotjs documentation](http://robotjs.io/docs/)
- [speaker package](https://www.npmjs.com/package/speaker)
- [Windows Timer Resolution](https://docs.microsoft.com/en-us/windows/win32/api/timeapi/nf-timeapi-timebeginperiod)

## まとめ

この調査により、以下を実現しました：

1. ✅ 問題の切り分けを可能にする4つの診断スクリプト
2. ✅ 包括的なドキュメント（技術版とユーザー版）
3. ✅ 簡単に実行できるnpm scripts
4. ✅ 診断結果の解釈ガイド
5. ✅ 問題パターンごとの対策案

ユーザーが診断を実行し、結果をフィードバックすることで、問題の原因を特定し、適切な修正を実装できます。
