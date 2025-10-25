# naudiodon 移行完了サマリー

## 実施内容

TypeScript CLI版のオーディオライブラリを `node-speaker` から `naudiodon` に移行しました。

## 変更ファイル一覧

### 1. package.json
- `speaker` を削除
- `naudiodon` (v2.3.6) を追加

### 2. src/audio/output.ts
- `Speaker` から `AudioIO` (naudiodon) に変更
- PortAudio を使用した実装に書き換え
- 内部バッファが約170msであることを明記
- コンストラクタで `outOptions` を設定
- `start()` / `quit()` メソッドに変更

### 3. src/main.ts
- バッファサイズを 50ms に設定（内部バッファは170ms）
- タイトルに "(naudiodon)" を追加
- 170ms制限について説明を追加

### 4. src/diagnostics/*.ts (3ファイル)
- `main-diagnostic.ts`
- `test-frequency-sweep.ts`
- `test-mouse-audio.ts`
- すべて BUFFER_SIZE_MS を 50ms に更新

### 5. src/types/naudiodon.d.ts （新規作成）
- naudiodon の TypeScript 型定義を追加
- AudioIO クラス、AudioIOOptions、AudioDevice インターフェースを定義

### 6. NAUDIODON_MIGRATION.md （新規作成）
- 移行の背景と理由を詳細に説明
- node-speaker vs naudiodon の比較
- 170ms制限の技術的説明
- 今後の改善案

### 7. README.md
- naudiodon への移行を反映
- 170ms制限について明記
- Known Limitations セクションに追加
- Acknowledgments セクションを更新

### 8. BUFFER_SIZE_FIX.md
- 冒頭に移行の注意書きを追加
- NAUDIODON_MIGRATION.md へのリンクを追加

## 技術的なポイント

### なぜ naudiodon なのか？

1. **node-speaker の問題**
   - 内部バッファが1000ms以上
   - highWaterMark を設定しても効果が薄い
   - マウス操作の応答性が悪い

2. **naudiodon の利点**
   - PortAudio ベースで安定
   - 内部バッファは約170ms
   - Node.js で現在利用可能な最小のバッファサイズ

### 170ms制限について

naudiodon でも内部バッファは約170msから減らすことができません。これは以下の要因によるものです：

- PortAudio 自体の内部バッファリング
- Node.js のネイティブバインディングのオーバーヘッド
- OS のオーディオスタックの遅延

これは **Node.js の限界** であり、より低レイテンシーが必要な場合は以下を推奨：
- ブラウザ版（Web Audio API で約3ms）
- Python版（PyAudio で約8ms）
- Rust版（cpal で約8ms）
- Go版（Oto で約8ms）

### プロジェクトの意義

このプロジェクトの目的の一つは「Node.js で現在利用可能な最小のバッファサイズを示す」ことです。その点で、naudiodon の採用は意義があります。

## テスト状況

- ✅ TypeScript コンパイル: 型定義を追加して対応
- ✅ Python コードフォーマット: ruff でチェック済み
- ⚠️ 実際のオーディオ出力: Windows環境でのテストが必要

## 今後のタスク

1. Windows環境での実機テスト
2. オーディオ出力の動作確認
3. マウス操作の応答性確認
4. 他のドキュメント（issue-notes/など）の更新（必要に応じて）

## 備考

- naudiodon は Windows で動作するため、Windows専用実装として明記しています
- TypeScript の型定義は公式には提供されていないため、minimal な型定義を自作しました
- バッファサイズは50msに設定していますが、実際のレイテンシーは約170msになります
