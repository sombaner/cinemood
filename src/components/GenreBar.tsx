import { useEffect, useState } from "react";
import { getGenres, type Genre } from "../api/tmdb";

type Props = {
  activeGenreId: number | null;
  onSelect: (genre: Genre | null) => void;
  enabled: boolean;
};

export function GenreBar({ activeGenreId, onSelect, enabled }: Props) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getGenres()
      .then((g) => { if (!cancelled) setGenres(g); })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); });
    return () => { cancelled = true; };
  }, [enabled]);

  if (error) return null;
  if (!enabled || genres.length === 0) return null;

  return (
    <section className="genre-bar" aria-label="Filter by genre">
      <div className="genre-pills">
        <button
          type="button"
          className={activeGenreId === null ? "pill active" : "pill"}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            className={g.id === activeGenreId ? "pill active" : "pill"}
            onClick={() => onSelect(g)}
          >
            {g.name}
          </button>
        ))}
      </div>
    </section>
  );
}
