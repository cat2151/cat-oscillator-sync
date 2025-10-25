# node-speaker から naudiodon への移行

## 背景

TypeScript CLI版では、当初 `node-speaker` パッケージを使用していましたが、内部バッファが1000ms以上あり、マウス操作からの応答性に問題がありました。

## 移行の理由

### node-speaker の問題点

- **内部バッファが非常に大きい**: デフォルトで16384バイト（約170ms）のhighWaterMarkを持つが、実際の動作では1000ms以上の遅延が発生
- **バッファサイズの制御が困難**: highWaterMarkを設定しても、実際のレイテンシーを十分に下げることができない
- **マウス制御の応答性が悪い**: 周波数変化が遅れて反映される

### naudiodon の選択

`naudiodon` は PortAudio の Node.js バインディングで、以下の特徴があります：

- **PortAudioベース**: クロスプラットフォームの低レイテンシーオーディオライブラリ
- **内部バッファサイズ**: 約170ms
- **Node.jsで現在利用可能な最小バッファ**: 他のNode.jsオーディオライブラリと比較して最も小さい

## 制限事項

### naudiodon でも170msの制限がある

**重要**: naudiodon に移行しても、内部バッファは約170msから減らすことができません。

この170msは：
- PortAudio自体の内部バッファリング
- Node.jsのネイティブバインディングのオーバーヘッド
- OSのオーディオスタックの遅延

これらの要因により、現在のNode.js環境では170ms以下にすることは困難です。

### 他の選択肢との比較

| ライブラリ | 最小バッファ | 備考 |
|-----------|-------------|------|
| node-speaker | ~1000ms | 実測で1秒以上の遅延 |
| naudiodon | ~170ms | **現在最小** |
| Web Audio API (browser) | ~3ms | ブラウザ版で使用中 |

## 実装の変更点

### package.json

```json
// Before
"dependencies": {
  "robotjs": "^0.6.0",
  "speaker": "^0.5.4"
}

// After
"dependencies": {
  "naudiodon": "^2.3.6",
  "robotjs": "^0.6.0"
}
```

### audio/output.ts

主な変更点：

1. **インポートの変更**
   ```typescript
   // Before
   import Speaker from "speaker";
   
   // After
   import { AudioIO } from "naudiodon";
   ```

2. **AudioIOの初期化**
   ```typescript
   this.audioOutput = new AudioIO({
       outOptions: {
           channelCount: config.channels,
           sampleFormat: config.bitDepth,
           sampleRate: config.sampleRate,
           deviceId: -1,
           closeOnError: true,
           framesPerBuffer: framesPerBuffer,
       }
   });
   ```

3. **ストリームの開始と停止**
   ```typescript
   // Start
   this.audioOutput.start();
   
   // Stop
   this.audioOutput.quit();
   ```

### バッファサイズの設定

デフォルトのバッファサイズを8msから50msに変更：

```typescript
const BUFFER_DURATION_MS = 50; // バッファの長さ（ミリ秒）
                               // 注意: naudiodonの内部バッファは約170msで、これ以下には減らせません
```

理由：
- naudiodonの内部バッファが170msあるため、8msに設定しても実質的な効果はない
- 50msに設定することで、より安定したオーディオ生成が可能
- 実際のレイテンシーは170ms程度になる

## ユーザーへの影響

### 良い点

- node-speakerの1000ms以上の遅延から、170msまで改善
- Node.jsで現在利用可能な最小のバッファサイズを実現
- より応答性の高いマウス制御が可能

### 制限事項

- 170msの遅延は残る（Node.jsの限界）
- Pythonや他の言語版（8ms程度）と比較すると、まだ遅い
- リアルタイム楽器演奏には向かない（人間の知覚限界は約10-20ms）

## 今後の改善案

### 1. より低レイテンシーな実装が必要な場合

TypeScript/Node.jsでは限界があるため、以下の選択肢を推奨：

- **ブラウザ版を使用**: Web Audio APIで3ms程度のレイテンシーを実現
- **Python版を使用**: PyAudioで8ms程度のレイテンシーを実現
- **Rust版を使用**: cpalで8ms程度のレイテンシーを実現
- **Go版を使用**: Otoで8ms程度のレイテンシーを実現

### 2. Node.js環境での将来的な改善

- N-APIベースの新しいオーディオライブラリの登場を待つ
- PortAudioの設定をより細かく制御できるバインディングの開発
- WebAssemblyを使用した低レイテンシーオーディオの実装

## まとめ

- node-speakerからnaudiodonへの移行により、1000ms→170msへ大幅に改善
- しかし、170msは現在のNode.js環境での限界
- これはNode.jsで利用可能な最小のバッファサイズであることを示す価値がある
- より低レイテンシーが必要な場合は、ブラウザ版やPython版を推奨

## 参考リンク

- [naudiodon GitHub](https://github.com/Streampunk/naudiodon)
- [PortAudio公式サイト](http://www.portaudio.com/)
- [Node.js Stream API](https://nodejs.org/api/stream.html)
