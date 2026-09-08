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

type ExperienceRow = {
  id: string;
  movie_id: string;
  bud_score: number;
  mood: string;
  notes: string;
  contains_spoilers: boolean;
  created_at: string;
};

const mapExperience = (row: ExperienceRow): Experience => ({
  id: row.id,
  movieId: row.movie_id,
  budScore: row.bud_score,
  mood: row.mood,
  notes: row.notes,
  containsSpoilers: row.contains_spoilers,
  createdAt: row.created_at,
});

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
