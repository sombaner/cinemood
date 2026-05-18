export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
};

export type Genre = { id: number; name: string };

type DiscoverExtras = Record<string, string | number>;

const BASE = "https://api.themoviedb.org/3";

function getApiKey(): string | undefined {
  const key = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

export function hasApiKey(): boolean {
  return getApiKey() !== undefined;
}

function buildUrl(path: string, params: Record<string, string | number> = {}): string {
  const key = getApiKey();
  if (!key) {
    throw new Error(
      "Missing TMDB API key. Set VITE_TMDB_API_KEY in .env.local (see README).",
    );
  }
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

type ResultsResponse = { results: Movie[] };

let genresCache: Genre[] | null = null;

export async function getGenres(): Promise<Genre[]> {
  if (genresCache) return genresCache;
  const data = await fetchJson<{ genres: Genre[] }>(buildUrl("/genre/movie/list"));
  genresCache = data.genres;
  return genresCache;
}

export async function discoverByGenres(
  genreIds: number[],
  extra: DiscoverExtras = {},
): Promise<Movie[]> {
  const params: Record<string, string | number> = {
    sort_by: "popularity.desc",
    include_adult: "false",
    page: 1,
    ...extra,
  };
  if (genreIds.length > 0) {
    params["with_genres"] = genreIds.join(",");
  }
  const data = await fetchJson<ResultsResponse>(buildUrl("/discover/movie", params));
  return data.results;
}

export async function getPopular(): Promise<Movie[]> {
  const data = await fetchJson<ResultsResponse>(
    buildUrl("/discover/movie", { sort_by: "popularity.desc", page: 1 }),
  );
  return data.results;
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.trim();
  if (!q) return [];
  const data = await fetchJson<ResultsResponse>(
    buildUrl("/search/movie", { query: q, include_adult: "false", page: 1 }),
  );
  return data.results;
}

export async function getRecommendations(movieId: number): Promise<Movie[]> {
  const data = await fetchJson<ResultsResponse>(
    buildUrl(`/movie/${movieId}/recommendations`, { page: 1 }),
  );
  return data.results;
}

export function imageUrl(path: string | null, size: "w185" | "w342" | "w500" = "w342"): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
