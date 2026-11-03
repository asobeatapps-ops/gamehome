# ASOBEAT homepage preview Ver.1.2

## Preview
Upload the entire directory to GitHub Pages (repository root), or run a local static server from this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/ . Directly opening index.html using file:// will not load JSON in most browsers.

## Add a game
Edit `data/games.json`, adding one JSON object with a unique `id`, `title`, `description`, `genre`, `image`, `url`, `releaseDate` (YYYY-MM-DD), and `status` (`published` or `draft`).

All game URLs are intentionally blank. Buttons are disabled until valid https:// URLs are registered. `published` means the card is visible on the portal, not that the game URL has been verified. Titles, descriptions, genres, release dates and thumbnails must be checked before production use.

## Ranking
Set `featuredGameIds` in `data/ranking.json` to up to five game IDs in ranking order. It is intentionally empty until the user confirms ranking positions.

## Ads
No ads or ad scripts are included. The planned single ad placement between game cards is deferred until approval and integration.

## Privacy
`privacy.html` is a placeholder and is not a finalized privacy policy.
