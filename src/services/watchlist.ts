import { Movie } from "../components/MoviePosterCard";
import { fetchMovieDetailsById } from "./tmdb";
import { supabase } from "./supabase";

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("You need to be signed in to do that.");
  return data.user.id;
}

export async function isInWatchlist(movieId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .maybeSingle();

  if (error) throw new Error("Unable to check your watchlist right now.");
  return data != null;
}

export async function addToWatchlist(movieId: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("watchlist").upsert({ user_id: userId, movie_id: movieId }, { onConflict: "user_id,movie_id" });
  if (error) throw new Error("Unable to save this movie. Please try again.");
}

export async function removeFromWatchlist(movieId: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("movie_id", movieId);
  if (error) throw new Error("Unable to remove this movie. Please try again.");
}

export async function getWatchlistMovies(): Promise<Movie[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("watchlist")
    .select("movie_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Unable to load your watchlist right now.");

  const rows = (data ?? []) as { movie_id: string }[];
  const movies = await Promise.all(rows.map(async (row) => {
    try {
      const details = await fetchMovieDetailsById(row.movie_id);
      const movie: Movie = {
        id: details.id,
        title: details.title,
        year: details.year,
        rating: details.rating,
        genre: details.genres[0] ?? "Movie",
        image: details.posterImage ?? "",
        backdropImage: details.backdropImage ?? undefined,
        overview: details.overview,
        budScore: null,
      };
      return movie;
    } catch {
      return null;
    }
  }));

  return movies.filter((movie): movie is Movie => movie !== null);
}
