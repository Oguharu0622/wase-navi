# わせナビ

企業ごとの選考フロー、締切、ES添削、Gemini模擬面接を管理するスマホ向けPWAです。

## 公開手順

1. この `wase-navi` フォルダをGitHubにアップロードします。
2. Vercelで新しいプロジェクトとして取り込みます。
3. Vercelの環境変数に次の3つを設定します。

```text
GOOGLE_SEARCH_API_KEY
GOOGLE_SEARCH_ENGINE_ID
GEMINI_API_KEY
```

4. 公開URLをスマホで開き、ホーム画面に追加します。

## 自動調査

`api/research-company.js` が企業名を受け取り、Google Custom Searchで検索し、Geminiで選考フローをJSON化します。

フロント側にAPIキーを置かないでください。友人にキーが見えてしまうため、必ずVercelの環境変数に入れます。
