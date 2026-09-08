import { Movie } from "../components/MoviePosterCard";
import { fetchMovieDetailsById } from "./tmdb";
import { supabase } from "./supabase";

export type Experience = {
  id: string;
  movieId: string;
  budScore: number;
  mood: string;
  notes: string;
  containsSpoilers: boolean;
  createdAt: string;
};

export type SaveExperienceInput = {
  movieId: string;
  budScore: number;
  mood: string;
  notes: string;
  containsSpoilers: boolean;
};

export type ExperienceStats = {
  totalExperiences: number;
  averageBudScore: number | null;
  favoriteMood: string | null;
};

export type CommunityActivity = {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  movie: Movie;
  budScore: number;
  mood: string;
  notes: string;
  containsSpoilers: boolean;
  createdAt: string;
};

type ExperienceRow = {
  id: string;
  movie_id: string;
  bud_score: number;
  mood: string;
  notes: string;
  contains_spoilers: boolean;
  created_at: string;
};

type ExperienceWithUserRow = ExperienceRow & { user_id: string };

type ProfileRow = { id: string; username: string | null; avatar_url: string | null };

const mapExperience = (row: ExperienceRow): Experience => ({
  id: row.id,
  movieId: row.movie_id,
  budScore: row.bud_score,
  mood: row.mood,
  notes: row.notes,
  containsSpoilers: row.contains_spoilers,
  createdAt: row.created_at,
});

const displayName = (userId: string, username: string | null) => username ?? `Member ${userId.slice(0, 4)}`;

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("You need to be signed in to do that.");
  return data.user.id;
}

export async function saveExperience(input: SaveExperienceInput): Promise<Experience> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("experiences")
    .insert({
      user_id: userId,
      movie_id: input.movieId,
      bud_score: input.budScore,
      mood: input.mood,
      notes: input.notes,
      contains_spoilers: input.containsSpoilers,
    })
    .select()
    .single();

  if (error) throw new Error("Unable to save your experience. Please try again.");
  return mapExperience(data as ExperienceRow);
}

export async function getUserExperienceStats(): Promise<ExperienceStats> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("experiences")
    .select("bud_score, mood")
    .eq("user_id", userId);

  if (error) throw new Error("Unable to load your BudWatch stats right now.");

  const rows = (data ?? []) as { bud_score: number; mood: string }[];
  if (!rows.length) return { totalExperiences: 0, averageBudScore: null, favoriteMood: null };

  const totalExperiences = rows.length;
  const averageBudScore = rows.reduce((sum, row) => sum + row.bud_score, 0) / totalExperiences;

  const moodCounts = new Map<string, number>();
  for (const row of rows) moodCounts.set(row.mood, (moodCounts.get(row.mood) ?? 0) + 1);
  const favoriteMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];

  return { totalExperiences, averageBudScore, favoriteMood };
}

async function hydrateActivities(rows: ExperienceWithUserRow[]): Promise<CommunityActivity[]> {
  if (!rows.length) return [];

  const userIds = [...new Set(rows.map((row) => row.user_id))];
  const movieIds = [...new Set(rows.map((row) => row.movie_id))];

  const [profilesResult, movieEntries] = await Promise.all([
    supabase.from("profiles").select("id, username, avatar_url").in("id", userIds),
    Promise.all(movieIds.map(async (movieId) => {
      try {
        const details = await fetchMovieDetailsById(movieId);
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
        return [movieId, movie] as const;
      } catch {
        return [movieId, null] as const;
      }
    })),
  ]);

  const profiles = new Map(((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
  const movies = new Map(movieEntries);

  return rows
    .map((row): CommunityActivity | null => {
      const movie = movies.get(row.movie_id);
      if (!movie) return null;
      const profile = profiles.get(row.user_id);
      return {
        id: row.id,
        userId: row.user_id,
        username: displayName(row.user_id, profile?.username ?? null),
        avatarUrl: profile?.avatar_url ?? null,
        movie,
        budScore: row.bud_score,
        mood: row.mood,
        notes: row.notes,
        containsSpoilers: row.contains_spoilers,
        createdAt: row.created_at,
      };
    })
    .filter((activity): activity is CommunityActivity => activity !== null);
}

export async function getCommunityActivityFeed(limit = 30): Promise<CommunityActivity[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("id, user_id, movie_id, bud_score, mood, notes, contains_spoilers, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Unable to load the community feed right now.");
  return hydrateActivities((data ?? []) as ExperienceWithUserRow[]);
}

export async function getExperiencesForMovie(movieId: string): Promise<CommunityActivity[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("id, user_id, movie_id, bud_score, mood, notes, contains_spoilers, created_at")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error("Unable to load experiences for this movie right now.");
  return hydrateActivities((data ?? []) as ExperienceWithUserRow[]);
}
