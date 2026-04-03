## Getting Started

1. Install [https://nodejs.org](https://nodejs.org/ja).
2. `npm install`
3. `npm run dev` to star the dev server.

## Architecture

The list and detail pages share the same route through `next.config.ts`. This is to enable transition animations while keeping the urls idempotent.

Newer version of nextjs support this through [view transitions](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition).

The design of the app attempts to minimize [content layout shift](https://web.dev/articles/cls?hl=ja) for elements that can be loaded quickly, while using placeholder for things like the thumbnails of videos.

This page implementation mostly uses HTML standards for layout which helped with rapid development.  However, for UI like this I would strongly consider absolute placement of elements which makes it easier to animate transitions as well as optimize page speed by only rendering video thumbnails that are close to the viewport.



このリポジトリをForkして、映画情報を提供するサービスを作ってください。ページは、トップページとカテゴリ詳細ページと映画情報詳細ページの3つを作成してください。

**トップページ**ではカテゴリごとに映画サムネイルが並んでおり、カテゴリごとにカテゴリ詳細ページへのリンクをつけてください。また映画サムネイルをクリックすると詳細ページに遷移する形にしてください。

**カテゴリ詳細ページ**では映画サムネイルが並んでおり、トップページ同様に映画サムネイルをクリックすると詳細ページに遷移する形にしてください。

**映画情報詳細ページ**では、映画のタイトルと説明とlike数を表示し、右サイドバーで「コメント一覧」を表示してください。

以下のGraphQL Queryを使ってください（Queryの定義はすでに `lib/graphql/query` 以下に入っています）。

詳細や他のQueryを知りたい場合は [https://develop.api.samansa.com/graphiql](https://develop.api.samansa.com/graphiql) を確認してください。

- getHomeScreens
  - 映画一覧ページで表示する映画カテゴリとその映画一覧を返す
- getCategory
  - 映画カテゴリIDを指定することで、そのカテゴリに含まれる映画一覧を返す
- getOriginalVideo
  - 映画IDを指定することで、その詳細情報を返す
- getVideoComments
  - 映画IDを指定することで、その映画へのコメント一覧を返す

実践的な工夫は大歓迎です！（例えば最初のgetHomeScreensでカテゴリのみ取得して、それぞれのカテゴリの映画は後から取得するようにするなど）

