import { useCallback, useEffect, useMemo, useState } from "react";
import {
  discoverByGenres,
  getPopular,
  hasApiKey,
  searchMovies,
  type Movie,
} from "./api/tmdb";
import { Header } from "./components/Header";
import { MoodPicker } from "./components/MoodPicker";
import { GenreBar } from "./components/GenreBar";
import { SearchBar } from "./components/SearchBar";
import { MovieGrid } from "./components/MovieGrid";
import { Recommendations } from "./components/Recommendations";
import { FavoritesView } from "./components/FavoritesView";
import { useFavorites, type FavoriteMovie } from "./hooks/useFavorites";
import { type Mood } from "./data/moods";
import "./App.css";

type View = "discover" | "favorites";
type Genre = { id: number; name: string };

type DiscoverMode =
  | { kind: "default" }
  | { kind: "mood"; mood: Mood }
  | { kind: "genre"; genre: Genre }
  | { kind: "search"; query: string };

function App() {
  const apiKeyPresent = useMemo(() => hasApiKey(), []);
  const [view, setView] = useState<View>("discover");
  const [mode, setMode] = useState<DiscoverMode>({ kind: "default" });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { favorites, isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (!apiKeyPresent) return;
    let cancelled = false;

    const run = async (): Promise<Movie[]> => {
      switch (mode.kind) {
        case "mood":
          return discoverByGenres(mode.mood.genres, mode.mood.extraParams ?? {});
        case "genre":
          return discoverByGenres([mode.genre.id]);
        case "search":
          return searchMovies(mode.query);
        case "default":
          return getPopular();
      }
    };

    void (async () => {
      // Yield once so subsequent setState calls happen outside the effect body
      // (avoids the react-hooks/set-state-in-effect cascading-render warning).
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError(null);
      try {
        const m = await run();
        if (!cancelled) setMovies(m);
      } catch (e: unknown) {
        if (!cancelled) {
          setMovies([]);
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [mode, apiKeyPresent]);

  const handleMood = useCallback((mood: Mood) => {
    setMode({ kind: "mood", mood });
  }, []);

  const handleGenre = useCallback((genre: Genre | null) => {
    setMode(genre ? { kind: "genre", genre } : { kind: "default" });
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setMode((prev) => (prev.kind === "search" ? { kind: "default" } : prev));
      return;
    }
    setMode({ kind: "search", query });
  }, []);

  const handleToggle = useCallback(
    (movie: Movie | FavoriteMovie) => toggle(movie),
    [toggle],
  );

  const activeMoodKey = mode.kind === "mood" ? mode.mood.key : null;
  const activeGenreId = mode.kind === "genre" ? mode.genre.id : null;

  const heading = (() => {
    switch (mode.kind) {
      case "mood":   return `${mode.mood.emoji} ${mode.mood.label} picks`;
      case "genre":  return `${mode.genre.name} movies`;
      case "search": return `Results for "${mode.query}"`;
      case "default": return "Popular right now";
    }
  })();

  return (
    <div className="app">
      <Header view={view} favoritesCount={favorites.length} onChange={setView} />

      {!apiKeyPresent && (
        <div className="banner warning" role="alert">
          <strong>TMDB API key missing.</strong> Create <code>.env.local</code> in the project
          root with <code>VITE_TMDB_API_KEY=&lt;your_key&gt;</code> and restart the dev server.
          See the README for setup steps.
        </div>
      )}

      <main className="main">
        {view === "discover" ? (
          <>
            <MoodPicker activeKey={activeMoodKey} onSelect={handleMood} />
            <GenreBar
              enabled={apiKeyPresent}
              activeGenreId={activeGenreId}
              onSelect={handleGenre}
            />
            <SearchBar onSearch={handleSearch} />

            <Recommendations
              favorites={favorites}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggle}
            />

            <section className="results">
              <div className="results-header">
                <h2 className="section-title">{heading}</h2>
                {mode.kind !== "default" && (
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setMode({ kind: "default" })}
                  >
                    Reset
                  </button>
                )}
              </div>
              {error && <div className="banner error">{error}</div>}
              <MovieGrid
                movies={movies}
                loading={loading}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggle}
                emptyText={
                  apiKeyPresent
                    ? "No movies found. Try another mood or genre."
                    : "Add a TMDB API key to load movies."
                }
              />
            </section>
          </>
        ) : (
          <FavoritesView
            favorites={favorites}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggle}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>Data from <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a> · This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}

export default App;
