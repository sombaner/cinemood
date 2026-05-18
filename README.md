# 🎬 cinemood

> Movies for the mood you're in.

**cinemood** is a single-page web app that recommends movies based on your **mood**, a **genre**, or your **past favorites**. Each movie card shows the poster, TMDB rating, release year, and a short overview. Save favorites to your browser and the app builds a "Because you liked…" row of similar movies.

## ✨ Features

- **🎭 Mood picker** — 10 curated moods (Happy, Sad, Adventurous, Romantic, Thrilled, Spooked, Inspired, Nostalgic, Chill, Curious) mapped to TMDB genre + keyword filters.
- **🎞️ Genre browser** — full TMDB genre list as scrollable pills.
- **🔍 Search** — debounced search across the TMDB catalog.
- **⭐ Rich movie cards** — poster, rating, year, and 140-character overview.
- **❤️ Favorites** — one-click save; persisted to `localStorage` (key `cinemood:favorites:v1`). No account required.
- **✨ "Because you liked…"** — automatic recommendations seeded from a saved favorite (TMDB `/movie/{id}/recommendations`).
- **🌙 Dark, responsive UI** — plain CSS, no UI framework.

## 🛠️ Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict)
- [Vite](https://vitejs.dev/) for dev server & bundling
- [TMDB API v3](https://developer.themoviedb.org/) for movie data
- Plain CSS (no UI library)
- `localStorage` for persistence (no backend)

## 🚀 Setup

### 1. Get a free TMDB API key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** ([direct link](https://www.themoviedb.org/settings/api)).
3. Request a **Developer** API key. You'll get a **v3 API key** (a 32-character hex string).

### 2. Install & run

```bash
git clone https://github.com/sombaner/cinemood.git
cd cinemood
npm install

# Create your local env file with the TMDB key
cp .env.example .env.local
# then edit .env.local and set VITE_TMDB_API_KEY=<your key>

npm run dev
```

Open the URL Vite prints (typically <http://localhost:5173>).

### 3. Build for production

```bash
npm run build
npm run preview   # serve the built bundle locally
```

The built site lives in `dist/` — drop it on any static host (Vercel, Netlify, GitHub Pages, S3, …).

## 📁 Project structure

```
src/
├── api/tmdb.ts            # TMDB client: discover, genres, search, recommendations
├── data/moods.ts          # Mood → genre/keyword mapping
├── hooks/useFavorites.ts  # localStorage-backed favorites hook
├── components/
│   ├── Header.tsx
│   ├── MoodPicker.tsx
│   ├── GenreBar.tsx
│   ├── SearchBar.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── Recommendations.tsx
│   └── FavoritesView.tsx
├── App.tsx                # View state, mode handling, data fetching
├── App.css                # Theme + layout
└── main.tsx               # React entry
```

## 🎭 Mood → Genre mapping

| Mood | TMDB genres / filters |
|---|---|
| Happy 😊 | Comedy + Family + Animation |
| Sad 😢 | Drama + Romance · `vote_count.gte=500`, sorted by rating |
| Adventurous 🗺️ | Adventure + Action |
| Romantic 💕 | Romance |
| Thrilled 😱 | Thriller + Mystery |
| Spooked 👻 | Horror |
| Inspired ✨ | Drama + History |
| Nostalgic 📼 | Drama + Comedy · `primary_release_date.lte=1999-12-31` |
| Chill 😌 | Animation + Comedy |
| Curious 🤔 | Documentary + Science Fiction |

Edit `src/data/moods.ts` to customize.

## 📜 License

MIT.

## 🙏 Attribution

This product uses the TMDB API but is **not endorsed or certified by TMDB**.
