# 検証手順 - Node.js CLI版

このドキュメントは、Windows環境でNode.js CLI版の動作を検証する手順を説明します。

## 前提条件

- Windows 10 または Windows 11
- Node.js v20.0.0 以降がインストール済み
- Visual Studio Build Toolsがインストール済み（ネイティブモジュールのビルドに必要）
- オーディオデバイスが接続されていること

## 検証手順

### 1. リポジトリのクローン

```powershell
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync\src\typescript\cli
```

### 2. 依存パッケージのインストール

```powershell
npm install
```

**期待される結果:**
- `speaker` と `robotjs` を含むすべての依存パッケージがインストールされる
- ネイティブモジュールのビルドが成功する
- エラーなく完了する

**トラブルシューティング:**
- ビルドエラーが発生した場合、PowerShellを管理者権限で開き、以下を実行:
  ```powershell
  winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
  ```
  インストール完了後、コマンドプロンプトまたはPowerShellを再起動し、再度 `npm install` を実行

### 3. TypeScriptのビルド

```powershell
npm run build
```

**期待される結果:**
- `dist/` ディレクトリが作成される
- TypeScriptのコンパイルエラーがない
- `dist/main.js` とその他のファイルが生成される

### 4. シンプル版の実行テスト

```powershell
npm start
```

または

```powershell
node dist/main.js
```

**期待される結果:**
- プログラムが起動する
- 以下のメッセージが表示される:
  ```
  🎵 Cat Oscillator Sync - TypeScript/Node.js CLI Version
  モード: シンプル版
  マウスを動かして音を制御してください
  ...
  ```
- マウスを動かすと音が出る
- コンソールに周波数情報が表示される（約500msごとに更新）
- `Ctrl+C` で正常に終了する

### 5. スムーズ版の実行テスト

```powershell
node dist/main.js smooth
```

**期待される結果:**
- プログラムが起動する
- "モード: スムーズ版" と表示される
- マウスを動かすと、シンプル版よりも滑らかに周波数が変化する音が出る
- `Ctrl+C` で正常に終了する

## 検証項目チェックリスト

### インストール
- [ ] Node.jsがインストールされている (`node --version`)
- [ ] npmがインストールされている (`npm --version`)
- [ ] リポジトリがクローンできる
- [ ] `npm install` が成功する
- [ ] ネイティブモジュールのビルドが成功する

### ビルド
- [ ] `npm run build` が成功する
- [ ] `dist/` ディレクトリが作成される
- [ ] TypeScriptコンパイルエラーがない

### 実行（シンプル版）
- [ ] プログラムが起動する
- [ ] マウスを動かすと音が出る
- [ ] X軸（横方向）でマスター周波数が変化する
- [ ] Y軸（縦方向）でスレーブ周波数が変化する
- [ ] コンソールに周波数が表示される
- [ ] `Ctrl+C` で終了できる

### 実行（スムーズ版）
- [ ] プログラムが起動する
- [ ] マウスを動かすと音が出る
- [ ] シンプル版より滑らかに周波数が変化する
- [ ] `Ctrl+C` で終了できる

### オーディオ品質
- [ ] 音が途切れない（連続的に再生される）
- [ ] ノイズやクラッキング音がない
- [ ] レイテンシが許容範囲内（～50ms以下）

### マウス制御
- [ ] マウスの動きにリアルタイムで反応する
- [ ] 画面の端でも正しく動作する
- [ ] 周波数範囲が正しい（マスター: 40-600Hz、スレーブ: 100-2000Hz）

## よくある問題と解決方法

### npm installでビルドエラー

**問題:** node-gypまたはネイティブモジュールのビルドに失敗

**解決方法:**

**方法1: winget を使用（推奨）**
PowerShellを管理者権限で開き、以下を実行:
```powershell
winget install --id Microsoft.VisualStudio.2022.BuildTools --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```
インストール完了後、コマンドプロンプトまたはPowerShellを再起動し、再度 `npm install` を実行

**方法2: 手動インストール**
1. [Visual Studio Downloads](https://visualstudio.microsoft.com/ja/downloads/) にアクセス
2. "Build Tools for Visual Studio 2022" をダウンロード
3. インストーラーを実行し、「C++ によるデスクトップ開発」ワークロードを選択
4. インストール完了後、コマンドプロンプトまたはPowerShellを再起動
5. 再度 `npm install` を実行

### 音が出ない

**問題:** プログラムは起動するが音が出ない

**解決方法:**
1. Windowsの音量設定を確認
2. 既定のオーディオデバイスが正しく設定されているか確認
3. 他のアプリケーションでオーディオが正常に動作するか確認
4. PCを再起動

### マウスが認識されない

**問題:** プログラムは起動するがマウスの動きに反応しない

**解決方法:**
1. コマンドプロンプトまたはPowerShellを管理者権限で実行
2. `robotjs` を再インストール:
   ```powershell
   npm uninstall robotjs
   npm install robotjs
   ```

### TypeScriptのコンパイルエラー

**問題:** `npm run build` でエラーが発生

**解決方法:**
1. node_modulesを削除して再インストール:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   npm run build
   ```

## パフォーマンス測定

### CPU使用率
- 実行中のCPU使用率を確認（タスクマネージャー）
- 期待値: 1-5% 程度

### メモリ使用量
- 実行中のメモリ使用量を確認
- 期待値: 50-100 MB 程度

### レイテンシ
- マウスを動かしてから音が変化するまでの遅延を体感
- 期待値: ほぼリアルタイム（～50ms以下）

## 比較検証（オプション）

Python版との比較を行う場合:

1. Python版をインストール: `pip install -r requirements.txt`
2. Python版を実行: `python src/python/sync_simple.py`
3. 以下の点を比較:
   - 音質
   - レイテンシ
   - CPU使用率
   - メモリ使用量
   - インストールの容易さ

## レポート

検証完了後、以下の情報を記録してください:

- Windows バージョン:
- Node.js バージョン:
- npm バージョン:
- CPU:
- メモリ:
- オーディオデバイス:
- 検証結果: (成功/失敗)
- 気づいた点:

## 連絡先

問題が発生した場合は、GitHubのIssueで報告してください。
