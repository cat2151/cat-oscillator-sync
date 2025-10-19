# クイックスタート - TypeScript/Node.js CLI版（Windows専用）

最速で動かすための手順書です。

## 前提条件

- Windows 10 または Windows 11
- オーディオデバイスが接続されていること

## 手順

### 1. Node.jsのインストール

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. LTS版（推奨版）のWindowsインストーラーをダウンロード
3. ダウンロードしたインストーラー（`.msi`ファイル）を実行
4. インストールウィザードに従ってインストール
   - すべてデフォルト設定でOK

### 2. インストールの確認

コマンドプロンプトまたはPowerShellを開いて、以下のコマンドを実行：

```powershell
node --version
npm --version
```

バージョン番号が表示されればOKです。

### 3. ビルドツールのインストール（必要な場合）

ネイティブモジュールのビルドに必要です。PowerShellを**管理者権限**で開き、以下を実行：

```powershell
npm install --global windows-build-tools
```

**注意**: このステップには10-15分程度かかることがあります。

または、[Visual Studio Build Tools](https://visualstudio.microsoft.com/ja/downloads/)をインストールすることもできます。

### 4. リポジトリのクローンと移動

```powershell
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync\src\typescript\cli
```

### 5. 依存パッケージのインストール

```powershell
npm install
```

**注意**: 初回インストール時、ネイティブモジュールのコンパイルが行われます。
数分かかることがあります。

### 6. ビルド

```powershell
npm run build
```

### 7. 実行

#### シンプル版

```powershell
npm start
```

#### スムーズ版

```powershell
node dist/main.js smooth
```

## 操作方法

1. プログラムが起動したら、マウスを動かしてください
2. 音が出れば成功です！
   - **X軸**: マスター周波数 (40Hz - 600Hz)
   - **Y軸**: スレーブ周波数 (100Hz - 2000Hz)
3. `Ctrl+C` で終了

## トラブルシューティング

### エラー: "node-gyp のビルドに失敗しました"

**原因**: C++ビルドツールがインストールされていません

**解決方法**:
1. PowerShellを**管理者権限**で開く
2. 以下を実行:
   ```powershell
   npm install --global windows-build-tools
   ```
3. 完了後、再度 `npm install` を実行

### エラー: "Cannot find module"

**原因**: 依存パッケージがインストールされていないか、ビルドされていません

**解決方法**:
```powershell
npm install
npm run build
```

### 音が出ない

**解決方法**:
1. Windowsの音量設定を確認
2. 既定のオーディオデバイスが正しく設定されているか確認
3. 他のアプリケーションでオーディオが正常に動作するか確認
4. PCを再起動してみる

### マウスが認識されない

**解決方法**:
1. コマンドプロンプトまたはPowerShellを管理者権限で実行してみる
2. `robotjs` を再インストール:
   ```powershell
   npm uninstall robotjs
   npm install robotjs
   ```

## 次のステップ

- [README.md](README.md) - 詳細なドキュメント
- [実装計画書](../IMPLEMENTATION_PLAN.md) - TypeScript全体の実装計画
- [メインREADME](../../../README.md) - プロジェクト全体の説明

## よくある質問

### Q: インストールに時間がかかるのはなぜですか？

A: `speaker` と `robotjs` はネイティブモジュールであり、初回インストール時にC++コードのコンパイルが必要です。
通常、5-10分程度かかります。

### Q: 管理者権限が必要ですか？

A: ビルドツールのインストール時は必要ですが、プログラムの実行自体には通常必要ありません。
ただし、マウス位置の取得で問題が発生した場合は、管理者権限で実行してみてください。

### Q: 他のOSでも動作しますか？

A: このバージョンはWindows専用に最適化されています。
他のOSでも動作する可能性はありますが、動作保証はありません。
- Linux: Python版またはRust版を推奨
- macOS: Python版を推奨
- Webブラウザ: Browser版を使用

### Q: Python版と比べてどうですか？

A: 
- **Python版の利点**: インストールが簡単、クロスプラットフォーム
- **Node.js CLI版の利点**: TypeScriptの型安全性、npmエコシステム、Windows最適化

用途に応じて選択してください。
