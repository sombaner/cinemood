import type { Movie } from "../api/tmdb";
import type { FavoriteMovie } from "../hooks/useFavorites";
import { MovieGrid } from "./MovieGrid";

type Props = {
  favorites: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (movie: Movie | FavoriteMovie) => void;
};

export function FavoritesView({ favorites, isFavorite, onToggleFavorite }: Props) {
  return (
    <section className="favorites-view">
      <h2 className="section-title">Your favorites</h2>
      <MovieGrid
        movies={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        emptyText="No favorites yet. Tap the ♡ on a movie to save it here."
      />
    </section>
  );
}
