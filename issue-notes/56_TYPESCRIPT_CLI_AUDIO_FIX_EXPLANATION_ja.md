# TypeScript CLI版 音声ギャップ修正 - 技術解説

## 問題の説明

TypeScript CLI版で断続的な音声再生が発生していました：
- 約0.3秒間音が鳴る
- その後約1.7秒間の無音
- このパターンが繰り返される

## 原因分析

### 元の実装の問題点

元の `audio/output.ts` は `setInterval` を使用して固定間隔で音声データをスピーカーに送信していました：

```typescript
const intervalMs = (framesPerBuffer / this.config.sampleRate) * 1000;

this.intervalId = setInterval(() => {
    const samples = new Int16Array(framesPerBuffer * this.config.channels);
    this.callback(samples, framesPerBuffer);
    const buffer = Buffer.from(samples.buffer);
    this.speaker.write(buffer);  // ← 問題: バックプレッシャー処理なし
}, intervalMs);
```

**問題点:**
- `setInterval` はスピーカーがデータを受け入れる準備ができているかどうかに関係なく、固定レートで実行されます
- `speaker` パッケージは内部バッファを持つNode.js書き込み可能ストリームです
- スピーカーが消費できるよりも速く書き込むと、バッファがいっぱいになります
- Node.jsストリームはバックプレッシャーを使用してバッファがいっぱいであることを通知します（`write()` が `false` を返す）
- この信号を無視していたため、バッファオーバーフローと音声ギャップが発生していました

### なぜギャップが発生したか

1. タイマーベースのアプローチは8msごとに音声データを書き込んでいました（48kHzで384フレーム）
2. スピーカーの内部バッファがいっぱいの場合、書き込みはキューに入れられますが、すぐには処理されません
3. 最終的にバッファがオーバーフローするか、同期が外れます
4. これにより、システムが回復しようとする間、音声がバースト（0.3秒）で再生され、その後長いギャップ（1.7秒）が発生していました

## 解決策

### 適切なバックプレッシャー処理

修正では、適切なNode.jsストリームバックプレッシャー処理を実装しました：

```typescript
private writeNextBuffer(): void {
    if (!this.running || !this.callback) return;

    // 音声サンプルを生成
    const samples = new Int16Array(this.framesPerBuffer * this.config.channels);
    this.callback(samples, this.framesPerBuffer);

    // スピーカーに書き込み、続行可能かチェック
    const buffer = Buffer.from(samples.buffer);
    const canContinue = this.speaker.write(buffer);

    // 書き込みバッファがいっぱいの場合、drainイベントを待つ
    if (!canContinue) {
        this.speaker.once("drain", () => {
            this.writeNextBuffer();
        });
    } else {
        // バッファに空きがある場合はすぐに続行
        setImmediate(() => this.writeNextBuffer());
    }
}
```

### 動作原理

1. **戻り値のチェック**: `speaker.write()` の戻り値:
   - `true`: バッファに空きがある（書き込み続行可能）
   - `false`: バッファがいっぱい（書き込み前に待機すべき）

2. **'drain' イベントを待つ**: バッファがいっぱいの場合（`canContinue === false`）:
   - `'drain'` イベントの一時リスナーを登録
   - このイベントはバッファが消費され、新しいデータの準備ができたときに発火
   - その時だけ次のバッファを書き込みます

3. **即座に続行**: バッファに空きがある場合（`canContinue === true`）:
   - `setImmediate()` を使用して次のイベントループで次の書き込みをスケジュール
   - 他の操作の実行を許可しながら、連続的な音声生成を維持

### Python実装との比較

Python版は `sounddevice.OutputStream` をコールバックで使用しています：

```python
def synth_callback(outdata, frames, time_info, status):
    # 音声サンプルを生成
    # ...
    outdata[:] = out.reshape(-1, 1)

with sd.OutputStream(channels=1, callback=synth_callback, ...):
    # 音声システムはデータが必要なときにコールバックを呼び出す
```

私たちの修正は同様の動作を実現しています：
- **Python**: 音声システムが準備ができたときにコールバックを呼び出してデータをプル
- **TypeScript（修正版）**: データをプッシュしますが、バックプレッシャー信号を尊重（同様の効果）

## 修正の利点

1. **連続的な音声**: 再生にギャップなし
2. **効率的**: スピーカーが消費する準備ができているときだけ音声を生成
3. **CPU無駄なし**: キューに溜まるだけのデータを生成しない
4. **適切なストリーム処理**: Node.jsストリームのベストプラクティスに従う
5. **最小限の変更**: 音声出力メカニズムのみを変更、合成コードは変更なし

## 技術詳細

### バッファサイズの計算

バッファサイズはポーリング間隔に基づいて計算されます：
```typescript
const POLLING_INTERVAL_MS = 8;
const FRAMES_PER_BUFFER = Math.floor((SAMPLE_RATE * POLLING_INTERVAL_MS) / 1000);
// 48kHzの場合: 48000 * 8 / 1000 = バッファあたり384フレーム
```

これは、各音声バッファに384サンプル（48kHzで8msの音声）が含まれることを意味します。

### イベントループの統合

再帰や `setTimeout(0)` の代わりに `setImmediate()` を使用：
- 音声書き込みの間に他のI/O操作を実行できるようにする
- 再帰呼び出しによるスタックオーバーフローを防ぐ
- 即座のスケジューリングには `setTimeout(0)` より効率的

### メモリ管理

各バッファは新規作成されます：
```typescript
const samples = new Int16Array(this.framesPerBuffer * this.config.channels);
```

これは問題ありません。理由：
- バッファは小さい（384 * 2バイト = バッファあたり768バイト）
- JavaScriptガベージコレクションがクリーンアップを効率的に処理
- 新しいバッファを作成することで、バッファ再利用による潜在的な問題を回避

## テスト

これはWindows専用のネイティブモジュールアプリケーションであるため、修正は以下で検証されました：
1. TypeScriptコンパイル（成功 - 構文エラーなし）
2. CodeQLセキュリティスキャン（脆弱性なし）
3. Node.jsストリームベストプラクティスに対するコードレビュー

実際の音声再生はWindowsマシンで以下でテストする必要があります：
```powershell
cd src/typescript/cli
npm install
npm run build
npm start
```

期待される動作：
- ギャップのない連続的な音声再生
- マウス移動時の滑らかな周波数変化
- スタッタリングやバッファアンダーランなし

## 参考資料

- [Node.js Stream Backpressure Guide](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)
- [speaker package on npm](https://www.npmjs.com/package/speaker)
- [Node.js Writable Stream API](https://nodejs.org/api/stream.html#writable-streams)
