import { useEffect, useState } from "react";
import { getRecommendations, type Movie } from "../api/tmdb";
import type { FavoriteMovie } from "../hooks/useFavorites";
import { MovieGrid } from "./MovieGrid";

type Props = {
  favorites: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: Movie | FavoriteMovie) => void;
};

export function Recommendations({ favorites, isFavorite, onToggleFavorite }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState<FavoriteMovie | null>(null);

  const seedId = favorites[0]?.id ?? null;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      // Yield once so subsequent setState calls happen outside the effect body
      // (avoids the react-hooks/set-state-in-effect cascading-render warning).
      await Promise.resolve();
      if (cancelled) return;
      if (favorites.length === 0 || seedId === null) {
        setMovies([]);
        setSeed(null);
        return;
      }
      const chosen = favorites[0];
      setSeed(chosen);
      setLoading(true);
      try {
        const m = await getRecommendations(chosen.id);
        if (!cancelled) setMovies(m);
      } catch {
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [seedId, favorites]);

  if (favorites.length === 0) return null;
  if (!loading && movies.length === 0) return null;

  return (
    <section className="recommendations" aria-label="Recommendations">
      <h2 className="section-title">
        Because you liked <em>{seed?.title}</em>
      </h2>
      <MovieGrid
        movies={movies}
        loading={loading}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        emptyText="No recommendations yet."
      />
    </section>
  );
}
