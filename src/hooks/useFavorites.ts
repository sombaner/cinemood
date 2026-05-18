import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../api/tmdb";

export type FavoriteMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "vote_average" | "release_date"
>;

const STORAGE_KEY = "cinemood:favorites:v1";

function loadInitial(): FavoriteMovie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteMovie[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites],
  );

  const toggle = useCallback((movie: Movie | FavoriteMovie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev.filter((m) => m.id !== movie.id);
      }
      const entry: FavoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
      };
      return [entry, ...prev];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { favorites, isFavorite, toggle, remove };
}
