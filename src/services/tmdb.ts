import { Movie } from "../components/MoviePosterCard";

declare const process: { env: { EXPO_PUBLIC_TMDB_API_KEY?: string } };

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
const TMDB_REQUEST_TIMEOUT_MS = 10000;

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export type TmdbMovieResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type TmdbCastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type TmdbMovieDetails = TmdbMovie & {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits: { cast: TmdbCastMember[] };
};

export type MovieDetails = {
  id: string;
  title: string;
  year: string;
  runtime: string;
  genres: string[];
  overview: string;
  rating: string;
  posterImage: string | null;
  backdropImage: string | null;
  cast: { id: string; name: string; character: string; image: string | null }[];
};

export type TmdbHomeMovies = {
  trending: Movie[];
  popular: Movie[];
};

const getApiKey = () => {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB API key is missing. Add EXPO_PUBLIC_TMDB_API_KEY to .env.");
  }

  return apiKey;
};

async function fetchMovies(path: string): Promise<TmdbMovieResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TMDB_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${TMDB_API_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("TMDB request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { results?: unknown }).results)) {
    throw new Error("TMDB returned an invalid movie response.");
  }

  return payload as TmdbMovieResponse;
}

async function fetchMovieDetails(movieId: string, apiKey: string): Promise<TmdbMovieDetails> {
  const query = `?api_key=${encodeURIComponent(apiKey)}&language=en-US&append_to_response=credits`;
  const response = await fetch(`${TMDB_API_URL}/movie/${encodeURIComponent(movieId)}${query}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}.`);
  }

  return response.json() as Promise<TmdbMovieDetails>;
}

const formatYear = (releaseDate: string) => releaseDate?.slice(0, 4) || "—";

export function mapTmdbMovie(movie: TmdbMovie): Movie | null {
  if (!movie.poster_path || !movie.backdrop_path) {
    return null;
  }

  return {
    id: String(movie.id),
    title: movie.title,
    year: formatYear(movie.release_date),
    rating: movie.vote_average.toFixed(1),
    genre: "Movie",
    image: `${TMDB_IMAGE_URL}/w500${movie.poster_path}`,
    backdropImage: `${TMDB_IMAGE_URL}/w780${movie.backdrop_path}`,
    overview: movie.overview,
    budScore: null,
  };
}

const mapMovies = (response: TmdbMovieResponse) =>
  response.results.map(mapTmdbMovie).filter((movie): movie is Movie => movie !== null);

export function mapTmdbMovieDetails(movie: TmdbMovieDetails): MovieDetails {
  return {
    id: String(movie.id),
    title: movie.title,
    year: formatYear(movie.release_date),
    runtime: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : "Runtime unavailable",
    genres: movie.genres.map((genre) => genre.name),
    overview: movie.overview || "No overview is available for this movie yet.",
    rating: movie.vote_average.toFixed(1),
    posterImage: movie.poster_path ? `${TMDB_IMAGE_URL}/w500${movie.poster_path}` : null,
    backdropImage: movie.backdrop_path ? `${TMDB_IMAGE_URL}/w1280${movie.backdrop_path}` : null,
    cast: movie.credits.cast.slice(0, 10).map((member) => ({
      id: String(member.id),
      name: member.name,
      character: member.character,
      image: member.profile_path ? `${TMDB_IMAGE_URL}/w185${member.profile_path}` : null,
    })),
  };
}

export async function fetchMovieDetailsById(movieId: string): Promise<MovieDetails> {
  const details = await fetchMovieDetails(movieId, getApiKey());
  return mapTmdbMovieDetails(details);
}

export async function fetchHomeMovies(): Promise<TmdbHomeMovies> {
  const apiKey = getApiKey();
  const query = `?api_key=${encodeURIComponent(apiKey)}&language=en-US&page=1`;
  const [trendingResponse, popularResponse] = await Promise.all([
    fetchMovies(`/trending/movie/week${query}`),
    fetchMovies(`/movie/popular${query}`),
  ]);

  return {
    trending: mapMovies(trendingResponse),
    popular: mapMovies(popularResponse),
  };
}