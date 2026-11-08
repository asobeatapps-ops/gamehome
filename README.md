# ASOBEAT ゲームホーム

- 公式トップ: https://asobeatapps-ops.github.io/
- ゲームホーム: https://asobeatapps-ops.github.io/gamehome/
- プライバシーポリシー: https://asobeatapps-ops.github.io/gamehome/privacy.html
- お問い合わせ: asobeat.apps@gmail.com

## ローカル確認

```sh
python3 -m http.server 8000
```

http://localhost:8000/ を開きます。`file://` ではJSONを読み込めない場合があります。

## ゲームの管理

`data/games.json` に、重複しない `id`、`title`、`description`、`genre`、`image`、`url`、`releaseDate`（YYYY-MM-DD）、`status` を設定します。`published` の作品のみが一覧に表示され、HTTPSのURLがある作品に遊ぶボタンが有効になります。公開前に実際のゲームの内容・URL・説明を確認してください。

ゲーム一覧・検索・ジャンル・並び替えの処理は `js/app.js` にあります。

## 注目TOP5

`data/ranking.json` の手動順位を先に表示します。`data/config.json` の `apiBase` に設定されたCloudflare APIの `/ranking` から30日間のプレイ数を取得し、公開中でHTTPSのURLがある作品を対象に自動順位を反映します。残りを手動順位・登録済み作品で補完します。非公開・未登録IDは除外し、API障害時は手動TOP5を維持します。

`js/asobeat-tracker.js` は各対応ゲームの実際の開始時に `ASOBEATTrack.play()` を呼んで使う共通トラッカーです。ホーム閲覧をプレイ数として送信するものではありません。APIやD1の設定変更は、このリポジトリの案内文更新には含めません。

## 広告・AdSense

AdSenseは申請中です。`index.html` のheadにはパブリッシャーID `ca-pub-3935348557592966` の確認用スクリプトを1回設置済みです。コード設置、所有権確認、審査承認、広告配信開始は別の段階です。

既存の `#ad-slot` は掲載予定位置のままで、CSSでは非表示です。広告枠の追加や自動広告の設定変更は行っていません。

`ads.txt` は、ルート用リポジトリ `asobeatapps-ops/asobeatapps-ops.github.io` で管理します。公開先は https://asobeatapps-ops.github.io/ads.txt です。`/gamehome/ads.txt` に複製しないでください。

審査結果・所有権確認・ads.txtの認識状態はAdSense管理画面で確認します。サイト側の整備は合格を保証しません。広告配信を始める前に、対象地域や広告設定に応じた同意管理とポリシーの整合性を確認してください。
