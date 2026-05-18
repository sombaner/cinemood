import type { Movie } from "../api/tmdb";
import type { FavoriteMovie } from "../hooks/useFavorites";
import { MovieCard } from "./MovieCard";

type GridMovie = Movie | FavoriteMovie;

type Props = {
  movies: GridMovie[];
  loading?: boolean;
  emptyText?: string;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: GridMovie) => void;
};

export function MovieGrid({
  movies,
  loading = false,
  emptyText = "No movies to show.",
  isFavorite,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <div className="grid-state" role="status" aria-live="polite">
        Loading movies…
      </div>
    );
  }
  if (movies.length === 0) {
    return <div className="grid-state empty">{emptyText}</div>;
  }
  return (
    <div className="movie-grid">
      {movies.map((m) => (
        <MovieCard
          key={m.id}
          movie={m}
          isFavorite={isFavorite(m.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
