import { imageUrl, type Movie } from "../api/tmdb";
import type { FavoriteMovie } from "../hooks/useFavorites";

type CardMovie = Movie | FavoriteMovie;

type Props = {
  movie: CardMovie;
  isFavorite: boolean;
  onToggleFavorite: (movie: CardMovie) => void;
};

function truncate(text: string, n = 140): string {
  if (!text) return "";
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + "…";
}

function getYear(date: string): string {
  if (!date) return "";
  return date.slice(0, 4);
}

function hasOverview(m: CardMovie): m is Movie {
  return "overview" in m && typeof m.overview === "string";
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const poster = imageUrl(movie.poster_path);
  const year = getYear(movie.release_date);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        {poster ? (
          <img className="poster" src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="poster placeholder" aria-hidden>🎞️</div>
        )}
        <button
          type="button"
          className={isFavorite ? "fav-btn active" : "fav-btn"}
          onClick={() => onToggleFavorite(movie)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
        <div className="rating-badge" title="TMDB rating">
          <span aria-hidden>⭐</span> {rating}
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-title" title={movie.title}>{movie.title}</h3>
        {year && <div className="card-meta">{year}</div>}
        {hasOverview(movie) && movie.overview && (
          <p className="card-overview">{truncate(movie.overview)}</p>
        )}
      </div>
    </article>
  );
}
