Last updated: 2026-02-02

# 開発状況生成プロンプト（開発者向け）

## 生成するもの：
- 現在openされているissuesを3行で要約する
- 次の一手の候補を3つlistする
- 次の一手の候補3つそれぞれについて、極力小さく分解して、その最初の小さな一歩を書く

## 生成しないもの：
- 「今日のissue目標」などuserに提案するもの
  - ハルシネーションの温床なので生成しない
- ハルシネーションしそうなものは生成しない（例、無価値なtaskや新issueを勝手に妄想してそれをuserに提案する等）
- プロジェクト構造情報（来訪者向け情報のため、別ファイルで管理）

## 「Agent実行プロンプト」生成ガイドライン：
「Agent実行プロンプト」作成時は以下の要素を必ず含めてください：

### 必須要素
1. **対象ファイル**: 分析/編集する具体的なファイルパス
2. **実行内容**: 具体的な分析や変更内容（「分析してください」ではなく「XXXファイルのYYY機能を分析し、ZZZの観点でmarkdown形式で出力してください」）
3. **確認事項**: 変更前に確認すべき依存関係や制約
4. **期待する出力**: markdown形式での結果や、具体的なファイル変更

### Agent実行プロンプト例

**良い例（上記「必須要素」4項目を含む具体的なプロンプト形式）**:
```
対象ファイル: `.github/workflows/translate-readme.yml`と`.github/workflows/call-translate-readme.yml`

実行内容: 対象ファイルについて、外部プロジェクトから利用する際に必要な設定項目を洗い出し、以下の観点から分析してください：
1) 必須入力パラメータ（target-branch等）
2) 必須シークレット（GEMINI_API_KEY）
3) ファイル配置の前提条件（README.ja.mdの存在）
4) 外部プロジェクトでの利用時に必要な追加設定

確認事項: 作業前に既存のworkflowファイルとの依存関係、および他のREADME関連ファイルとの整合性を確認してください。

期待する出力: 外部プロジェクトがこの`call-translate-readme.yml`を導入する際の手順書をmarkdown形式で生成してください。具体的には：必須パラメータの設定方法、シークレットの登録手順、前提条件の確認項目を含めてください。
```

**避けるべき例**:
- callgraphについて調べてください
- ワークフローを分析してください
- issue-noteの処理フローを確認してください

## 出力フォーマット：
以下のMarkdown形式で出力してください：

```markdown
# Development Status

## 現在のIssues
[以下の形式で3行でオープン中のissuesを要約。issue番号を必ず書く]
- [1行目の説明]
- [2行目の説明]
- [3行目の説明]

## 次の一手候補
1. [候補1のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

2. [候補2のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```

3. [候補3のタイトル。issue番号を必ず書く]
   - 最初の小さな一歩: [具体的で実行可能な最初のアクション]
   - Agent実行プロンプト:
     ```
     対象ファイル: [分析/編集する具体的なファイルパス]

     実行内容: [具体的な分析や変更内容を記述]

     確認事項: [変更前に確認すべき依存関係や制約]

     期待する出力: [markdown形式での結果や、具体的なファイル変更の説明]
     ```
```


# 開発状況情報
- 以下の開発状況情報を参考にしてください。
- Issue番号を記載する際は、必ず [Issue #番号](../issue-notes/番号.md) の形式でMarkdownリンクとして記載してください。

## プロジェクトのファイル一覧
- .editorconfig
- .github/actions-tmp/.github/workflows/call-callgraph.yml
- .github/actions-tmp/.github/workflows/call-daily-project-summary.yml
- .github/actions-tmp/.github/workflows/call-issue-note.yml
- .github/actions-tmp/.github/workflows/call-rust-windows-check.yml
- .github/actions-tmp/.github/workflows/call-translate-readme.yml
- .github/actions-tmp/.github/workflows/callgraph.yml
- .github/actions-tmp/.github/workflows/check-recent-human-commit.yml
- .github/actions-tmp/.github/workflows/daily-project-summary.yml
- .github/actions-tmp/.github/workflows/issue-note.yml
- .github/actions-tmp/.github/workflows/rust-windows-check.yml
- .github/actions-tmp/.github/workflows/translate-readme.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/callgraph.ql
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/codeql-pack.lock.yml
- .github/actions-tmp/.github_automation/callgraph/codeql-queries/qlpack.yml
- .github/actions-tmp/.github_automation/callgraph/config/example.json
- .github/actions-tmp/.github_automation/callgraph/docs/callgraph.md
- .github/actions-tmp/.github_automation/callgraph/presets/callgraph.js
- .github/actions-tmp/.github_automation/callgraph/presets/style.css
- .github/actions-tmp/.github_automation/callgraph/scripts/analyze-codeql.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/callgraph-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-codeql-exists.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/check-node-version.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/common-utils.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/copy-commit-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/extract-sarif-info.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/find-process-results.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generate-html-graph.cjs
- .github/actions-tmp/.github_automation/callgraph/scripts/generateHTML.cjs
- .github/actions-tmp/.github_automation/check_recent_human_commit/scripts/check-recent-human-commit.cjs
- .github/actions-tmp/.github_automation/project_summary/docs/daily-summary-setup.md
- .github/actions-tmp/.github_automation/project_summary/prompts/development-status-prompt.md
- .github/actions-tmp/.github_automation/project_summary/prompts/project-overview-prompt.md
- .github/actions-tmp/.github_automation/project_summary/scripts/ProjectSummaryCoordinator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/DevelopmentStatusGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/GitUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/development/IssueTracker.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/generate-project-summary.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/CodeAnalyzer.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectAnalysisOrchestrator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataCollector.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectDataFormatter.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/overview/ProjectOverviewGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/BaseGenerator.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/FileSystemUtils.cjs
- .github/actions-tmp/.github_automation/project_summary/scripts/shared/ProjectFileUtils.cjs
- .github/actions-tmp/.github_automation/translate/docs/TRANSLATION_SETUP.md
- .github/actions-tmp/.github_automation/translate/scripts/translate-readme.cjs
- .github/actions-tmp/.gitignore
- .github/actions-tmp/.vscode/settings.json
- .github/actions-tmp/LICENSE
- .github/actions-tmp/README.ja.md
- .github/actions-tmp/README.md
- .github/actions-tmp/_config.yml
- .github/actions-tmp/generated-docs/callgraph.html
- .github/actions-tmp/generated-docs/callgraph.js
- .github/actions-tmp/generated-docs/development-status-generated-prompt.md
- .github/actions-tmp/generated-docs/development-status.md
- .github/actions-tmp/generated-docs/project-overview-generated-prompt.md
- .github/actions-tmp/generated-docs/project-overview.md
- .github/actions-tmp/generated-docs/style.css
- .github/actions-tmp/googled947dc864c270e07.html
- .github/actions-tmp/issue-notes/10.md
- .github/actions-tmp/issue-notes/11.md
- .github/actions-tmp/issue-notes/12.md
- .github/actions-tmp/issue-notes/13.md
- .github/actions-tmp/issue-notes/14.md
- .github/actions-tmp/issue-notes/15.md
- .github/actions-tmp/issue-notes/16.md
- .github/actions-tmp/issue-notes/17.md
- .github/actions-tmp/issue-notes/18.md
- .github/actions-tmp/issue-notes/19.md
- .github/actions-tmp/issue-notes/2.md
- .github/actions-tmp/issue-notes/20.md
- .github/actions-tmp/issue-notes/21.md
- .github/actions-tmp/issue-notes/22.md
- .github/actions-tmp/issue-notes/23.md
- .github/actions-tmp/issue-notes/24.md
- .github/actions-tmp/issue-notes/25.md
- .github/actions-tmp/issue-notes/26.md
- .github/actions-tmp/issue-notes/27.md
- .github/actions-tmp/issue-notes/28.md
- .github/actions-tmp/issue-notes/29.md
- .github/actions-tmp/issue-notes/3.md
- .github/actions-tmp/issue-notes/30.md
- .github/actions-tmp/issue-notes/4.md
- .github/actions-tmp/issue-notes/7.md
- .github/actions-tmp/issue-notes/8.md
- .github/actions-tmp/issue-notes/9.md
- .github/actions-tmp/package-lock.json
- .github/actions-tmp/package.json
- .github/actions-tmp/src/main.js
- .github/copilot-instructions.md
- .github/workflows/call-daily-project-summary.yml
- .github/workflows/call-issue-note.yml
- .github/workflows/call-translate-readme.yml
- .github/workflows/deploy-pages.yml
- .gitignore
- .vscode/settings.json
- BUILD_SCRIPTS.md
- LICENSE
- README.md
- _config.yml
- build_and_run.py
- docs/.nojekyll
- docs/assets/index-CDju8QjF.js
- docs/assets/index-CDju8QjF.js.map
- docs/index.html
- generated-docs/project-overview-generated-prompt.md
- googled947dc864c270e07.html
- issue-notes/20_OBSIDIAN_IMPLEMENTATION_PLAN.md
- issue-notes/22_GO_CGO_EXPLANATION.md
- issue-notes/22_GO_COMPLETION_REPORT.md
- issue-notes/22_GO_INVESTIGATION_CGO_ALTERNATIVES.md
- issue-notes/22_GO_PRECOMPILED_BINARY_SETUP.md
- issue-notes/22_GO_QUICKSTART.md
- issue-notes/22_GO_README.md
- issue-notes/24_OBSIDIAN_COMPARISON.md
- issue-notes/24_OBSIDIAN_COMPLETION_REPORT.md
- issue-notes/24_OBSIDIAN_MANUAL_TEST.md
- issue-notes/24_OBSIDIAN_README.md
- issue-notes/2_GO_IMPLEMENTATION_PLAN.md
- issue-notes/2_IMPLEMENTATION_PLAN_SUMMARY.md
- issue-notes/2_RUST_IMPLEMENTATION_PLAN.md
- issue-notes/2_TYPESCRIPT_IMPLEMENTATION_PLAN.md
- issue-notes/32_TYPESCRIPT_CLI_COMPLETION_REPORT.md
- issue-notes/32_TYPESCRIPT_CLI_MIGRATION_NOTES.md
- issue-notes/32_TYPESCRIPT_CLI_QUICKSTART.md
- issue-notes/32_TYPESCRIPT_CLI_README.md
- issue-notes/32_TYPESCRIPT_CLI_VERIFICATION.md
- issue-notes/34_BUILD_AND_RUN.md
- issue-notes/44_GO_IMPLEMENTATION_REPORT_OTO.md
- issue-notes/44_GO_QUICKSTART_OTO.md
- issue-notes/44_GO_README_OTO.md
- issue-notes/4_RUST_COMPLETION_REPORT.md
- issue-notes/4_RUST_QUICKSTART.md
- issue-notes/4_RUST_README.md
- issue-notes/56_TYPESCRIPT_CLI_AUDIO_FIX_EXPLANATION.md
- issue-notes/56_TYPESCRIPT_CLI_AUDIO_FIX_EXPLANATION_ja.md
- issue-notes/56_TYPESCRIPT_CLI_AUDIO_FIX_SUMMARY.md
- issue-notes/6_TYPESCRIPT_BROWSER_COMPLETION_REPORT.md
- issue-notes/6_TYPESCRIPT_BROWSER_MANUAL_TEST.md
- issue-notes/6_TYPESCRIPT_BROWSER_README.md
- issue-notes/78.md
- issue-notes/78_BROWSER_IMPLEMENTATION_STATUS.md
- issue-notes/78_FINAL_REPORT.md
- issue-notes/78_GITHUB_PAGES_IMPLEMENTATION.md
- issue-notes/80.md
- issue-notes/81.md
- issue-notes/GO_MIGRATION_ZIG_CC.md
- issue-notes/README.md
- pyproject.toml
- pytest.ini
- requirements.txt
- ruff.toml
- src/build_utils.py
- src/go/.gitignore
- src/go/README.md
- src/go/build_and_run.py
- src/go/cmd/sync_simple_oto/main.go
- src/go/cmd/sync_smooth_oto/main.go
- src/go/go.mod
- src/go/go.sum
- src/go/internal/mouse/mouse_test.go
- src/go/internal/mouse/position.go
- src/go/internal/mouse/position_stub.go
- src/go/internal/mouse/position_windows.go
- src/go/internal/synth/simple.go
- src/go/internal/synth/smooth.go
- src/go/internal/synth/synth_test.go
- src/go/test_windows_mouse_speed.go
- src/go-portaudio/.gitignore
- src/go-portaudio/QUICKSTART.md
- src/go-portaudio/README.md
- src/go-portaudio/build_and_run.py
- src/go-portaudio/cmd/sync_simple/main.go
- src/go-portaudio/cmd/sync_smooth/main.go
- src/go-portaudio/download_portaudio.py
- src/go-portaudio/go.mod
- src/go-portaudio/internal/mouse/mouse_test.go
- src/go-portaudio/internal/mouse/position.go
- src/go-portaudio/internal/mouse/position_stub.go
- src/go-portaudio/internal/mouse/position_windows.go
- src/go-portaudio/internal/synth/simple.go
- src/go-portaudio/internal/synth/smooth.go
- src/go-portaudio/internal/synth/synth_test.go
- src/obsidian/.gitignore
- src/obsidian/esbuild.config.mjs
- src/obsidian/manifest.json
- src/obsidian/package.json
- src/obsidian/src/audio/simple-worklet.ts
- src/obsidian/src/audio/smooth-worklet.ts
- src/obsidian/src/main.ts
- src/obsidian/src/mouse-handler.ts
- src/obsidian/src/synth/simple.ts
- src/obsidian/src/synth/smooth.ts
- src/obsidian/tsconfig.json
- src/python/__init__.py
- src/python/build_and_run.py
- src/python/sync_simple.py
- src/python/sync_smooth.py
- src/rust/.gitignore
- src/rust/Cargo.toml
- src/rust/build_and_run.py
- src/rust/src/sync_simple.rs
- src/rust/src/sync_smooth.rs
- src/typescript/browser/.gitignore
- src/typescript/browser/build_and_run.py
- src/typescript/browser/index.html
- src/typescript/browser/package-lock.json
- src/typescript/browser/package.json
- src/typescript/browser/src/audio/simple-worklet.ts
- src/typescript/browser/src/audio/smooth-worklet.ts
- src/typescript/browser/src/main.ts
- src/typescript/browser/src/synth/simple.ts
- src/typescript/browser/src/synth/smooth.ts
- src/typescript/browser/tsconfig.json
- src/typescript/browser/vite.config.ts
- src/typescript/cli/.gitignore
- src/typescript/cli/BUFFER_SIZE_FIX.md
- src/typescript/cli/DELIVERY_SUMMARY.md
- src/typescript/cli/DIAGNOSTIC_GUIDE.md
- src/typescript/cli/FREQUENCY_UPDATE_FIX.md
- src/typescript/cli/INVESTIGATION_REPORT.md
- src/typescript/cli/NAUDIODON_MIGRATION.md
- src/typescript/cli/NAUDIODON_MIGRATION_COMPLETION.md
- src/typescript/cli/NAUDIODON_MIGRATION_SUMMARY.md
- src/typescript/cli/README.md
- src/typescript/cli/USER_GUIDE.md
- src/typescript/cli/build_and_run.py
- src/typescript/cli/package-lock.json
- src/typescript/cli/package.json
- src/typescript/cli/src/audio/output.ts
- src/typescript/cli/src/diagnostics/README.md
- src/typescript/cli/src/diagnostics/main-diagnostic.ts
- src/typescript/cli/src/diagnostics/test-frequency-sweep.ts
- src/typescript/cli/src/diagnostics/test-mouse-audio.ts
- src/typescript/cli/src/diagnostics/test-mouse-capture.ts
- src/typescript/cli/src/main.ts
- src/typescript/cli/src/mouse/position.ts
- src/typescript/cli/src/synth/simple.ts
- src/typescript/cli/src/synth/smooth.ts
- src/typescript/cli/src/types/naudiodon.d.ts
- src/typescript/cli/tsconfig.json

## 現在のオープンIssues
## [Issue #82](../issue-notes/82.md): Add README.ja.md with comprehensive installation methods for all language implementations
## Issue #81: 現在実装されているものをlistしてREADME.ja.mdに追記する ✅

### 完了した作業

- [x] 現在の実装状況を調査
  - [x] Python実装を確認
  - [x] Rust実装を確認  
  - [x] Go実装（Pure Go - Oto版）を確認
  - [x] Go実装（PortAudio + Zig cc版）を確認
  - [x] TypeScript実装（Browser版）を確認
  - [x] TypeScript実装（CLI版 - Windows専用）を確認

- [x] README.ja.mdを作成して実装リストを追記
...
ラベル: 
--- issue-notes/82.md の内容 ---

```markdown

```

## [Issue #81](../issue-notes/81.md): 現在実装されているものをlistしてREADME.ja.mdに追記する。あわせてPRに、それぞれのinstall方法をよりワンライナー的に改善できるか洗い出す
[issue-notes/81.md](https://github.com/cat2151/cat-oscillator-sync/blob/main/issue-notes/81.md)

...
ラベル: 
--- issue-notes/81.md の内容 ---

```markdown
# issue 現在実装されているものをlistしてREADME.ja.mdに追記する。あわせてPRに、それぞれのinstall方法をよりワンライナー的に改善できるか洗い出す #81
[issues #81](https://github.com/cat2151/cat-oscillator-sync/issues/81)



```

## [Issue #80](../issue-notes/80.md): （人力）web版がブラウザで鳴るかどうかtestする
[issue-notes/80.md](https://github.com/cat2151/cat-oscillator-sync/blob/main/issue-notes/80.md)

...
ラベル: 
--- issue-notes/80.md の内容 ---

```markdown
# issue （人力）web版がブラウザで鳴るかどうかtestする #80
[issues #80](https://github.com/cat2151/cat-oscillator-sync/issues/80)



```

## ドキュメントで言及されているファイルの内容
### .github/actions-tmp/README.ja.md
```md
{% raw %}
# GitHub Actions 共通ワークフロー集

このリポジトリは、**複数プロジェクトで使い回せるGitHub Actions共通ワークフロー集**です

<p align="left">
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵-Japanese-red.svg" alt="Japanese"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸-English-blue.svg" alt="English"></a>
</p>

# 3行で説明
- 🚀 プロジェクトごとのGitHub Actions管理をもっと楽に
- 🔗 共通化されたワークフローで、どのプロジェクトからも呼ぶだけでOK
- ✅ メンテは一括、プロジェクト開発に集中できます

## Quick Links
| 項目 | リンク |
|------|--------|
| 📖 プロジェクト概要 | [generated-docs/project-overview.md](generated-docs/project-overview.md) |
| 📖 コールグラフ | [generated-docs/callgraph.html](https://cat2151.github.io/github-actions/generated-docs/callgraph.html) |
| 📊 開発状況 | [generated-docs/development-status.md](generated-docs/development-status.md) |

# notes
- まだ共通化の作業中です
- まだワークフロー内容を改善中です

※README.md は README.ja.md を元にGeminiの翻訳でGitHub Actionsで自動生成しています

{% endraw %}
```

### .github/actions-tmp/issue-notes/2.md
```md
{% raw %}
# issue GitHub Actions「関数コールグラフhtmlビジュアライズ生成」を共通ワークフロー化する #2
[issues #2](https://github.com/cat2151/github-actions/issues/2)


# prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
このymlファイルを、以下の2つのファイルに分割してください。
1. 共通ワークフロー       cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
2. 呼び出し元ワークフロー cat2151/github-actions/.github/workflows/call-callgraph_enhanced.yml
まずplanしてください
```

# 結果
- indent
    - linter？がindentのエラーを出しているがyml内容は見た感じOK
    - テキストエディタとagentの相性問題と判断する
    - 別のテキストエディタでsaveしなおし、テキストエディタをreload
    - indentのエラーは解消した
- LLMレビュー
    - agent以外の複数のLLMにレビューさせる
    - prompt
```
あなたはGitHub Actionsと共通ワークフローのスペシャリストです。
以下の2つのファイルをレビューしてください。最優先で、エラーが発生するかどうかだけレビューしてください。エラー以外の改善事項のチェックをするかわりに、エラー発生有無チェックに最大限注力してください。

--- 共通ワークフロー

# GitHub Actions Reusable Workflow for Call Graph Generation
name: Generate Call Graph

# TODO Windowsネイティブでのtestをしていた名残が残っているので、今後整理していく。今はWSL act でtestしており、Windowsネイティブ環境依存問題が解決した
#  ChatGPTにレビューさせるとそこそこ有用そうな提案が得られたので、今後それをやる予定
#  agentに自己チェックさせる手も、セカンドオピニオンとして選択肢に入れておく

on:
  workflow_call:

jobs:
  check-commits:
    runs-on: ubuntu-latest
    outputs:
      should-run: ${{ steps.check.outputs.should-run }}
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 50 # 過去のコミットを取得

      - name: Check for user commits in last 24 hours
        id: check
        run: |
          node .github/scripts/callgraph_enhanced/check-commits.cjs

  generate-callgraph:
    needs: check-commits
    if: needs.check-commits.outputs.should-run == 'true'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      security-events: write
      actions: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set Git identity
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Remove old CodeQL packages cache
        run: rm -rf ~/.codeql/packages

      - name: Check Node.js version
        run: |
          node .github/scripts/callgraph_enhanced/check-node-version.cjs

      - name: Install CodeQL CLI
        run: |
          wget https://github.com/github/codeql-cli-binaries/releases/download/v2.22.1/codeql-linux64.zip
          unzip codeql-linux64.zip
          sudo mv codeql /opt/codeql
          echo "/opt/codeql" >> $GITHUB_PATH

      - name: Install CodeQL query packs
        run: |
          /opt/codeql/codeql pack install .github/codeql-queries

      - name: Check CodeQL exists
        run: |
          node .github/scripts/callgraph_enhanced/check-codeql-exists.cjs

      - name: Verify CodeQL Configuration
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs verify-config

      - name: Remove existing CodeQL DB (if any)
        run: |
          rm -rf codeql-db

      - name: Perform CodeQL Analysis
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs analyze

      - name: Check CodeQL Analysis Results
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs check-results

      - name: Debug CodeQL execution
        run: |
          node .github/scripts/callgraph_enhanced/analyze-codeql.cjs debug

      - name: Wait for CodeQL results
        run: |
          node -e "setTimeout(()=>{}, 10000)"

      - name: Find and process CodeQL results
        run: |
          node .github/scripts/callgraph_enhanced/find-process-results.cjs

      - name: Generate HTML graph
        run: |
          node .github/scripts/callgraph_enhanced/generate-html-graph.cjs

      - name: Copy files to generated-docs and commit results
        run: |
          node .github/scripts/callgraph_enhanced/copy-commit-results.cjs

--- 呼び出し元
# 呼び出し元ワークフロー: call-callgraph_enhanced.yml
name: Call Call Graph Enhanced

on:
  schedule:
    # 毎日午前5時(JST) = UTC 20:00前日
    - cron: '0 20 * * *'
  workflow_dispatch:

jobs:
  call-callgraph-enhanced:
    # uses: cat2151/github-actions/.github/workflows/callgraph_enhanced.yml
    uses: ./.github/workflows/callgraph_enhanced.yml # ローカルでのテスト用
```

# レビュー結果OKと判断する
- レビュー結果を人力でレビューした形になった

# test
- #4 同様にローカル WSL + act でtestする
- エラー。userのtest設計ミス。
  - scriptの挙動 : src/ がある前提
  - 今回の共通ワークフローのリポジトリ : src/ がない
  - 今回testで実現したいこと
    - 仮のソースでよいので、関数コールグラフを生成させる
  - 対策
    - src/ にダミーを配置する
- test green
  - ただしcommit pushはしてないので、html内容が0件NG、といったケースの検知はできない
  - もしそうなったら別issueとしよう

# test green

# commit用に、yml 呼び出し元 uses をlocal用から本番用に書き換える

# closeとする
- もしhtml内容が0件NG、などになったら、別issueとするつもり

{% endraw %}
```

### issue-notes/80.md
```md
{% raw %}
# issue （人力）web版がブラウザで鳴るかどうかtestする #80
[issues #80](https://github.com/cat2151/cat-oscillator-sync/issues/80)



{% endraw %}
```

### issue-notes/81.md
```md
{% raw %}
# issue 現在実装されているものをlistしてREADME.ja.mdに追記する。あわせてPRに、それぞれのinstall方法をよりワンライナー的に改善できるか洗い出す #81
[issues #81](https://github.com/cat2151/cat-oscillator-sync/issues/81)



{% endraw %}
```

## 最近の変更（過去7日間）
### コミット履歴:
7802042 Add issue note for #81 [auto]
be63114 Add issue note for #80 [auto]
5c54ca8 Deploy: Update GitHub Pages [skip ci]
a6ac6a7 Merge pull request #79 from cat2151/copilot/implement-web-audio-functionality
a8abd7a Fix security issue: Add explicit permissions to GitHub Actions workflow
a3c7549 Update documentation for GitHub Pages deployment
9753f8f Implement GitHub Pages deployment: Add Vite config, GitHub Actions workflow, and build to /docs
f3aaf0b Address PR review comments: fix browser auto-open description, update compatibility tables for Windows-only policy, use wildcard for Vite output
ee01268 Add comprehensive final report for issue #78 browser implementation
afa469d Document existing browser implementation status for issue #78

### 変更されたファイル:
.github/workflows/deploy-pages.yml
.gitignore
README.md
docs/.nojekyll
docs/assets/index-CDju8QjF.js
docs/assets/index-CDju8QjF.js.map
docs/index.html
generated-docs/development-status-generated-prompt.md
generated-docs/development-status.md
generated-docs/project-overview-generated-prompt.md
generated-docs/project-overview.md
issue-notes/78.md
issue-notes/78_BROWSER_IMPLEMENTATION_STATUS.md
issue-notes/78_FINAL_REPORT.md
issue-notes/78_GITHUB_PAGES_IMPLEMENTATION.md
issue-notes/80.md
issue-notes/81.md
src/typescript/browser/vite.config.ts


---
Generated at: 2026-02-02 07:03:09 JST
