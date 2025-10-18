# TypeScript Obsidian プラグイン版 実装計画書

## 概要

TypeScript ブラウザ版（`src/typescript/browser/`）を参考に、Obsidianプラグインとして動作するバージョンを実装する計画書です。

## 目的

- **検証目的**: obsidian-plugin-abcjsのように、Obsidianで音を鳴らすことができるか？を検証する
- **基本機能**: マウス制御によるハードシンク・オシレータをObsidian環境で動作させる
- **音声制御**: プラグインが有効な場合に音を鳴らす仕組みを実装

## 参考実装

### TypeScript ブラウザ版の構造
```
src/typescript/browser/
├── package.json
├── tsconfig.json
├── index.html
├── src/
│   ├── main.ts              # UIとマウス制御
│   ├── synth/
│   │   ├── simple.ts        # シンプル版シンセサイザー
│   │   └── smooth.ts        # スムーズ版シンセサイザー
│   └── audio/
│       ├── simple-worklet.ts   # AudioWorklet Processor
│       └── smooth-worklet.ts
```

**主要な技術:**
- Web Audio API（AudioWorklet使用）
- マウス位置取得（DOM Events）
- リアルタイムオーディオ処理

## Obsidian プラグインの基本構造

### プロジェクト構成（提案）

```
src/obsidian/
├── manifest.json           # プラグイン情報（必須）
├── package.json            # npm設定
├── tsconfig.json           # TypeScript設定
├── esbuild.config.mjs      # ビルド設定
├── IMPLEMENTATION_PLAN.md  # 本ドキュメント
├── README.md              # プラグイン説明書
├── src/
│   ├── main.ts            # プラグインのエントリポイント
│   ├── settings.ts        # 設定画面
│   ├── synth/
│   │   ├── simple.ts      # シンプル版（ブラウザ版から移植）
│   │   └── smooth.ts      # スムーズ版（ブラウザ版から移植）
│   └── audio/
│       ├── simple-worklet.ts   # AudioWorklet（ブラウザ版から移植）
│       └── smooth-worklet.ts
└── styles.css             # プラグイン用スタイル（オプション）
```

### 必須ファイル

#### manifest.json
Obsidianプラグインの識別情報とメタデータ。

```json
{
  "id": "cat-oscillator-sync",
  "name": "Cat Oscillator Sync",
  "version": "0.1.0",
  "minAppVersion": "0.15.0",
  "description": "マウスで制御するハードシンク・オシレータ・シンセサイザー",
  "author": "cat2151",
  "authorUrl": "https://github.com/cat2151",
  "isDesktopOnly": true
}
```

**注意点:**
- `isDesktopOnly: true` - Web Audio APIを使用するため、デスクトップ版のみ対応
- `minAppVersion` - Obsidian APIのバージョン互換性

## Obsidian プラグイン API の統合

### 基本構造

```typescript
import { Plugin } from 'obsidian';

export default class CatOscillatorSyncPlugin extends Plugin {
  async onload() {
    console.log('Loading Cat Oscillator Sync plugin');
    
    // プラグイン起動時の処理
    // - 設定の読み込み
    // - コマンドの登録
    // - イベントリスナーの登録
  }

  onunload() {
    console.log('Unloading Cat Oscillator Sync plugin');
    
    // プラグイン終了時のクリーンアップ
    // - 音声の停止
    // - イベントリスナーの削除
  }
}
```

### 音声制御の実装アプローチ

#### アプローチ1: プラグイン有効時に自動再生（仮仕様）

**仕様:**
- プラグインが有効になったら音声を自動的に開始
- プラグインが無効になったら音声を停止

**実装:**
```typescript
export default class CatOscillatorSyncPlugin extends Plugin {
  private synth: SimpleSynth | SmoothSynth | null = null;
  private mouseHandler: MouseHandler | null = null;

  async onload() {
    // プラグイン有効時に音声開始
    await this.startSynth();
    this.startMouseTracking();
  }

  onunload() {
    // プラグイン無効時に音声停止
    this.stopSynth();
    this.stopMouseTracking();
  }

  private async startSynth() {
    this.synth = new SimpleSynth(); // または SmoothSynth
    await this.synth.start();
  }

  private stopSynth() {
    if (this.synth) {
      this.synth.stop();
      this.synth = null;
    }
  }

  private startMouseTracking() {
    this.mouseHandler = new MouseHandler(this.synth);
    this.mouseHandler.start();
  }

  private stopMouseTracking() {
    if (this.mouseHandler) {
      this.mouseHandler.stop();
      this.mouseHandler = null;
    }
  }
}
```

**メリット:**
- シンプルな実装
- ユーザー操作不要

**デメリット:**
- 常に音が鳴り続ける（うるさい可能性）
- バッテリー消費が大きい

#### アプローチ2: コマンドでON/OFFを切り替え（推奨）

**仕様:**
- コマンド「Enable Cat Oscillator Sync」で音声開始
- コマンド「Disable Cat Oscillator Sync」で音声停止
- またはトグルコマンド「Toggle Cat Oscillator Sync」で切り替え

**実装:**
```typescript
export default class CatOscillatorSyncPlugin extends Plugin {
  private synth: SimpleSynth | SmoothSynth | null = null;
  private mouseHandler: MouseHandler | null = null;
  private isEnabled: boolean = false;

  async onload() {
    // トグルコマンドの登録
    this.addCommand({
      id: 'toggle-oscillator',
      name: 'Toggle Oscillator Sync',
      callback: () => {
        if (this.isEnabled) {
          this.disableOscillator();
        } else {
          this.enableOscillator();
        }
      }
    });

    // 個別のEnable/Disableコマンド
    this.addCommand({
      id: 'enable-oscillator',
      name: 'Enable Oscillator Sync',
      callback: () => this.enableOscillator()
    });

    this.addCommand({
      id: 'disable-oscillator',
      name: 'Disable Oscillator Sync',
      callback: () => this.disableOscillator()
    });
  }

  onunload() {
    this.disableOscillator();
  }

  private async enableOscillator() {
    if (this.isEnabled) return;
    
    this.synth = new SimpleSynth();
    await this.synth.start();
    
    this.mouseHandler = new MouseHandler(this.synth);
    this.mouseHandler.start();
    
    this.isEnabled = true;
    console.log('Oscillator enabled');
  }

  private disableOscillator() {
    if (!this.isEnabled) return;
    
    if (this.mouseHandler) {
      this.mouseHandler.stop();
      this.mouseHandler = null;
    }
    
    if (this.synth) {
      this.synth.stop();
      this.synth = null;
    }
    
    this.isEnabled = false;
    console.log('Oscillator disabled');
  }
}
```

**メリット:**
- ユーザーが制御できる
- 必要な時だけ音を鳴らせる
- バッテリー節約

**デメリット:**
- コマンドを実行する手間がある

**推奨理由:**
- 実用性が高い
- obsidian-plugin-abcjsと同様のアプローチ
- ユーザーフレンドリー

#### アプローチ3: 設定画面でON/OFF（高度）

**仕様:**
- 設定画面にトグルスイッチを追加
- スイッチで音声のON/OFFを制御
- デフォルトはOFF

**実装:**
```typescript
interface CatOscillatorSettings {
  enabled: boolean;
  version: 'simple' | 'smooth';
}

const DEFAULT_SETTINGS: CatOscillatorSettings = {
  enabled: false,
  version: 'simple'
}

export default class CatOscillatorSyncPlugin extends Plugin {
  settings: CatOscillatorSettings;

  async onload() {
    await this.loadSettings();
    
    // 設定画面の追加
    this.addSettingTab(new CatOscillatorSettingTab(this.app, this));
    
    // 設定に応じて初期化
    if (this.settings.enabled) {
      await this.enableOscillator();
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class CatOscillatorSettingTab extends PluginSettingTab {
  plugin: CatOscillatorSyncPlugin;

  constructor(app: App, plugin: CatOscillatorSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl} = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Enable Oscillator')
      .setDesc('オシレータを有効にする')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
          
          if (value) {
            await this.plugin.enableOscillator();
          } else {
            this.plugin.disableOscillator();
          }
        }));

    new Setting(containerEl)
      .setName('Version')
      .setDesc('Simple版またはSmooth版を選択')
      .addDropdown(dropdown => dropdown
        .addOption('simple', 'Simple')
        .addOption('smooth', 'Smooth')
        .setValue(this.plugin.settings.version)
        .onChange(async (value) => {
          this.plugin.settings.version = value as 'simple' | 'smooth';
          await this.plugin.saveSettings();
          
          // 再起動が必要
          if (this.plugin.settings.enabled) {
            this.plugin.disableOscillator();
            await this.plugin.enableOscillator();
          }
        }));
  }
}
```

**メリット:**
- UI上で直感的に制御できる
- 設定が永続化される
- バージョン選択も可能

**デメリット:**
- 実装が複雑
- 設定画面を開く必要がある

## マウスイベントの取得

Obsidianでは、ブラウザ版と同様にDOM Eventsを使用してマウス位置を取得できます。

```typescript
class MouseHandler {
  private synth: SimpleSynth | SmoothSynth;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private pollingInterval: number | null = null;
  private mouseMoveHandler: (e: MouseEvent) => void;

  constructor(synth: SimpleSynth | SmoothSynth) {
    this.synth = synth;
    this.mouseMoveHandler = (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };
  }

  start() {
    // マウスイベントリスナーを登録
    document.addEventListener('mousemove', this.mouseMoveHandler);
    
    // 8msごとに周波数を更新
    this.pollingInterval = window.setInterval(() => {
      this.updateFrequencies();
    }, 8);
  }

  stop() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private updateFrequencies() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // マウスXをマスター周波数にマッピング (40-600 Hz)
    const freqMaster = this.mapRange(this.mouseX, 0, screenWidth, 40, 600);
    
    // マウスYをスレーブ周波数にマッピング (100-2000 Hz) - Y軸反転
    const freqSlave = this.mapRange(this.mouseY, 0, screenHeight, 2000, 100);
    
    this.synth.updateFrequencies(freqMaster, freqSlave);
  }

  private mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}
```

## Web Audio APIの統合

ブラウザ版の実装をそのまま使用できます。

### Synth クラス（ブラウザ版から移植）

```typescript
// src/obsidian/src/synth/simple.ts
export class SimpleSynth {
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private isRunning: boolean = false;

  async start(): Promise<void> {
    if (this.isRunning) return;

    this.audioContext = new AudioContext({ sampleRate: 48000 });
    
    // AudioWorkletモジュールの読み込み
    // Obsidianプラグインではパスの指定方法が異なる可能性がある
    await this.audioContext.audioWorklet.addModule('./simple-worklet.js');
    
    this.workletNode = new AudioWorkletNode(this.audioContext, 'simple-worklet-processor');
    this.workletNode.connect(this.audioContext.destination);
    
    this.isRunning = true;
  }

  stop(): void {
    if (!this.isRunning || !this.audioContext) return;

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    this.audioContext.close();
    this.audioContext = null;
    this.isRunning = false;
  }

  updateFrequencies(freqMaster: number, freqSlave: number): void {
    if (!this.workletNode) return;

    this.workletNode.port.postMessage({
      type: 'updateFrequencies',
      freqMaster,
      freqSlave,
    });
  }
}
```

### AudioWorklet（ブラウザ版から移植）

ブラウザ版の`simple-worklet.ts`と`smooth-worklet.ts`をそのまま使用できます。

## ビルドシステム

### esbuild 設定

Obsidianプラグインは通常esbuildを使用してビルドします。

```javascript
// esbuild.config.mjs
import esbuild from 'esbuild';
import process from 'process';
import builtins from 'builtin-modules';

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');

const context = await esbuild.context({
  banner: {
    js: banner,
  },
  entryPoints: ['src/main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/autocomplete',
    '@codemirror/collab',
    '@codemirror/commands',
    '@codemirror/language',
    '@codemirror/lint',
    '@codemirror/search',
    '@codemirror/state',
    '@codemirror/view',
    '@lezer/common',
    '@lezer/highlight',
    '@lezer/lr',
    ...builtins
  ],
  format: 'cjs',
  target: 'es2018',
  logLevel: "info",
  sourcemap: prod ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
});

if (prod) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
```

### package.json

```json
{
  "name": "cat-oscillator-sync-obsidian",
  "version": "0.1.0",
  "description": "マウスで制御するハードシンク・オシレータ・シンセサイザー（Obsidianプラグイン）",
  "main": "main.js",
  "scripts": {
    "dev": "node esbuild.config.mjs",
    "build": "tsc -noEmit -skipLibCheck && node esbuild.config.mjs production",
    "version": "node version-bump.mjs && git add manifest.json versions.json"
  },
  "keywords": [
    "obsidian",
    "plugin",
    "synthesizer",
    "audio"
  ],
  "author": "cat2151",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "builtin-modules": "^3.3.0",
    "esbuild": "^0.19.11",
    "obsidian": "latest",
    "tslib": "^2.6.2",
    "typescript": "^5.3.3"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "inlineSourceMap": true,
    "inlineSources": true,
    "module": "ESNext",
    "target": "ES6",
    "allowJs": true,
    "noImplicitAny": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "isolatedModules": true,
    "strictNullChecks": true,
    "lib": [
      "DOM",
      "ES5",
      "ES6",
      "ES7"
    ]
  },
  "include": [
    "**/*.ts"
  ]
}
```

## インストールと開発手順

### 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/cat2151/cat-oscillator-sync.git
cd cat-oscillator-sync/src/obsidian

# 依存関係のインストール
npm install

# 開発モード（ファイル変更を監視）
npm run dev
```

### Obsidianでのテスト

1. Obsidianの設定を開く
2. 「Community plugins」→「Turn on community plugins」
3. Obsidianのプラグインフォルダに移動:
   - Windows: `%APPDATA%\Obsidian\plugins\`
   - macOS: `~/Library/Application Support/obsidian/plugins/`
   - Linux: `~/.config/obsidian/plugins/`
4. `cat-oscillator-sync`フォルダを作成
5. 以下のファイルをコピー:
   - `main.js`
   - `manifest.json`
   - `styles.css`（存在する場合）
6. Obsidianを再起動またはプラグインをリロード
7. 設定から「Cat Oscillator Sync」を有効化

### プラグインの使用方法

**コマンド方式の場合:**
1. コマンドパレットを開く（Ctrl/Cmd + P）
2. 「Toggle Oscillator Sync」を実行
3. マウスを動かして音を確認
4. 再度コマンドを実行して停止

**設定方式の場合:**
1. 設定画面を開く
2. 「Cat Oscillator Sync」を探す
3. 「Enable Oscillator」をONにする
4. マウスを動かして音を確認

## 技術的課題と対策

### 課題1: AudioWorkletモジュールのパス解決

**問題:**
- ブラウザ版では相対パスで動作する
- Obsidianプラグインではビルドされたバンドルからの読み込みが必要

**対策:**
- esbuildでAudioWorkletコードも別ファイルとして出力
- または、AudioWorkletコードを文字列としてインライン化してBlobから読み込む

```typescript
// Blob URLを使用した読み込み
const workletCode = `
  // AudioWorkletのコード全体をここに
`;

const blob = new Blob([workletCode], { type: 'application/javascript' });
const workletUrl = URL.createObjectURL(blob);
await this.audioContext.audioWorklet.addModule(workletUrl);
```

### 課題2: Obsidian APIの学習コスト

**対策:**
- [Obsidian API ドキュメント](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)を参照
- [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)を参考にする
- obsidian-plugin-abcjsのソースコードを参考にする

### 課題3: デスクトップ版のみ対応

**理由:**
- Web Audio APIはデスクトップ版でのみ動作
- モバイル版では音声API制限がある

**対策:**
- `manifest.json`で`isDesktopOnly: true`を設定
- モバイル版では無効化される

## 参考: obsidian-plugin-abcjs

obsidian-plugin-abcjsは、ABC記譜法で書かれた楽譜を表示・再生するObsidianプラグインです。

**参考になる点:**
1. **コマンドでの制御**: プレイ/ストップのコマンドを提供
2. **設定画面**: 音量などのパラメータを設定可能
3. **Web Audio API使用**: 音声再生にWeb Audio APIを使用
4. **コードブロック統合**: マークダウンのコードブロックから楽譜を認識

**GitHub:** https://github.com/abcjs-music/obsidian-plugin-abcjs

**本プロジェクトとの違い:**
- obsidian-plugin-abcjs: 楽譜データから音を再生
- cat-oscillator-sync: マウス位置から音をリアルタイム生成

## 実装の優先順位

### Phase 1: 基本構造の実装（必須）
1. プロジェクトのセットアップ
   - `manifest.json`作成
   - `package.json`設定
   - `tsconfig.json`設定
   - `esbuild.config.mjs`設定
2. 基本的なプラグインクラスの実装
3. ビルドとObsidianでの動作確認

### Phase 2: 音声機能の実装（必須）
1. ブラウザ版からSynthクラスをコピー・移植
2. ブラウザ版からAudioWorkletをコピー・移植
3. AudioWorkletのパス解決問題を解決
4. 基本的な音声再生の動作確認

### Phase 3: マウス制御の実装（必須）
1. MouseHandlerクラスの実装
2. マウスイベントリスナーの登録
3. 周波数マッピング機能の実装
4. 動作確認

### Phase 4: コマンドの実装（推奨）
1. トグルコマンドの実装
2. Enable/Disableコマンドの実装
3. コマンドの動作確認

### Phase 5: 設定画面の実装（オプション）
1. 設定タブの追加
2. Enable/Disableトグルの実装
3. バージョン選択（Simple/Smooth）の実装
4. 設定の永続化

### Phase 6: ドキュメント整備（必須）
1. README.mdの作成
2. 使用方法の説明
3. トラブルシューティング

## タイムライン（想定）

- Phase 1: 2-3時間
- Phase 2: 3-4時間
- Phase 3: 2-3時間
- Phase 4: 1-2時間
- Phase 5: 2-3時間（オプション）
- Phase 6: 1-2時間

**合計:** 11-17時間（Phase 5を含む場合）

## 推奨実装戦略

### 最優先: コマンド方式

**理由:**
1. **実装がシンプル**: 設定画面不要
2. **obsidian-plugin-abcjsと同様**: 実績のあるアプローチ
3. **ユーザーフレンドリー**: コマンドパレットから簡単に制御

**最小限の実装:**
- Phase 1-4のみ実装
- 設定画面は後回し
- まずは動作する最小限のプロトタイプを作成

### 将来の拡張性

**可能な拡張:**
1. 設定画面の追加（パラメータ調整）
2. 周波数範囲のカスタマイズ
3. 複数のプリセット
4. ビジュアライザーの追加（サイドバー）
5. ホットキーの設定

## まとめ

### 実装方針

1. **ブラウザ版を最大限活用**:
   - Synthクラス、AudioWorkletをそのまま移植
   - マウス制御ロジックも流用

2. **コマンド方式を採用**:
   - Toggle/Enable/Disableコマンドを実装
   - ユーザーが音声のON/OFFを制御

3. **段階的な実装**:
   - Phase 1-4で最小限の動作するプロトタイプ
   - Phase 5-6で機能拡張とドキュメント整備

4. **obsidian-plugin-abcjsを参考**:
   - プラグイン構造
   - コマンドの実装方法
   - Web Audio APIの使用方法

### 期待される成果

- ✅ Obsidianで音を鳴らすことができるか？→ **検証可能**
- ✅ マウスで制御するシンセサイザーが動作
- ✅ コマンドで音声のON/OFF制御
- ✅ デスクトップ版Obsidianで動作

### 次のステップ

1. プロジェクトのセットアップ（Phase 1）
2. ブラウザ版コードの移植（Phase 2-3）
3. コマンドの実装（Phase 4）
4. Obsidianでのテストと調整
5. ドキュメント整備（Phase 6）

この実装計画書に従って、TypeScript Obsidianプラグイン版を段階的に実装します。
