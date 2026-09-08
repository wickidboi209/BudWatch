import { CommunityActivity, ExperienceWithUserRow, hydrateActivities } from "./experiences";
import { supabase } from "./supabase";

export type Crew = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  memberCount: number;
};

export type CrewMember = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  joinedAt: string;
};

type CrewRow = { id: string; name: string; invite_code: string; created_by: string };
type CrewMemberRow = { crew_id: string; user_id: string; joined_at: string };
type ProfileRow = { id: string; username: string | null; avatar_url: string | null };

const displayName = (userId: string, username: string | null) => username ?? `Member ${userId.slice(0, 4)}`;

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("You need to be signed in to do that.");
  return data.user.id;
}

function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export async function createCrew(name: string): Promise<Crew> {
  const userId = await getCurrentUserId();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Give your crew a name first.");

  let crewRow: CrewRow | null = null;
  for (let attempt = 0; attempt < 5 && !crewRow; attempt++) {
    const { data, error } = await supabase
      .from("crews")
      .insert({ name: trimmedName, invite_code: generateInviteCode(), created_by: userId })
      .select()
      .single();
    if (!error) { crewRow = data as CrewRow; break; }
    if (!error.message.toLowerCase().includes("duplicate")) throw new Error("Unable to create your crew. Please try again.");
  }
  if (!crewRow) throw new Error("Unable to create your crew. Please try again.");

  const { error: memberError } = await supabase.from("crew_members").insert({ crew_id: crewRow.id, user_id: userId });
  if (memberError) throw new Error("Unable to join your new crew. Please try again.");

  return { id: crewRow.id, name: crewRow.name, inviteCode: crewRow.invite_code, createdBy: crewRow.created_by, memberCount: 1 };
}

export async function joinCrewByCode(code: string): Promise<Crew> {
  const userId = await getCurrentUserId();
  const trimmedCode = code.trim().toUpperCase();
  if (!trimmedCode) throw new Error("Enter an invite code first.");

  const { data: crewRow, error: crewError } = await supabase
    .from("crews")
    .select("id, name, invite_code, created_by")
    .eq("invite_code", trimmedCode)
    .maybeSingle();

  if (crewError || !crewRow) throw new Error("That invite code doesn't match a crew.");

  const { error: memberError } = await supabase.from("crew_members").insert({ crew_id: crewRow.id, user_id: userId });
  if (memberError) {
    if (memberError.message.toLowerCase().includes("duplicate")) throw new Error("You're already in this crew.");
    throw new Error("Unable to join this crew. Please try again.");
  }

  const { count } = await supabase.from("crew_members").select("user_id", { count: "exact", head: true }).eq("crew_id", crewRow.id);
  return { id: crewRow.id, name: crewRow.name, inviteCode: crewRow.invite_code, createdBy: crewRow.created_by, memberCount: count ?? 1 };
}

export async function getMyCrews(): Promise<Crew[]> {
  const userId = await getCurrentUserId();

  const { data: membershipRows, error: membershipError } = await supabase
    .from("crew_members")
    .select("crew_id")
    .eq("user_id", userId);
  if (membershipError) throw new Error("Unable to load your crews right now.");

  const crewIds = [...new Set((membershipRows ?? []).map((row) => (row as { crew_id: string }).crew_id))];
  if (!crewIds.length) return [];

  const [crewsResult, memberCountsResult] = await Promise.all([
    supabase.from("crews").select("id, name, invite_code, created_by").in("id", crewIds),
    supabase.from("crew_members").select("crew_id").in("crew_id", crewIds),
  ]);
  if (crewsResult.error) throw new Error("Unable to load your crews right now.");

  const counts = new Map<string, number>();
  for (const row of (memberCountsResult.data ?? []) as { crew_id: string }[]) {
    counts.set(row.crew_id, (counts.get(row.crew_id) ?? 0) + 1);
  }

  return ((crewsResult.data ?? []) as CrewRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    inviteCode: row.invite_code,
    createdBy: row.created_by,
    memberCount: counts.get(row.id) ?? 0,
  }));
}

export async function getCrewMembers(crewId: string): Promise<CrewMember[]> {
  const { data: memberRows, error: memberError } = await supabase
    .from("crew_members")
    .select("crew_id, user_id, joined_at")
    .eq("crew_id", crewId)
    .order("joined_at", { ascending: true });
  if (memberError) throw new Error("Unable to load crew members right now.");

  const rows = (memberRows ?? []) as CrewMemberRow[];
  if (!rows.length) return [];

  const userIds = rows.map((row) => row.user_id);
  const { data: profileRows } = await supabase.from("profiles").select("id, username, avatar_url").in("id", userIds);
  const profiles = new Map(((profileRows ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));

  return rows.map((row) => {
    const profile = profiles.get(row.user_id);
    return {
      userId: row.user_id,
      username: displayName(row.user_id, profile?.username ?? null),
      avatarUrl: profile?.avatar_url ?? null,
      joinedAt: row.joined_at,
    };
  });
}

export async function getCrewActivityFeed(crewId: string, limit = 30): Promise<CommunityActivity[]> {
  const { data: memberRows, error: memberError } = await supabase
    .from("crew_members")
    .select("user_id")
    .eq("crew_id", crewId);
  if (memberError) throw new Error("Unable to load this crew's feed right now.");

  const memberIds = [...new Set((memberRows ?? []).map((row) => (row as { user_id: string }).user_id))];
  if (!memberIds.length) return [];

  const { data, error } = await supabase
    .from("experiences")
    .select("id, user_id, movie_id, bud_score, mood, notes, contains_spoilers, created_at")
    .in("user_id", memberIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Unable to load this crew's feed right now.");
  return hydrateActivities((data ?? []) as ExperienceWithUserRow[]);
}

export async function leaveCrew(crewId: string): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("crew_members").delete().eq("crew_id", crewId).eq("user_id", userId);
  if (error) throw new Error("Unable to leave this crew. Please try again.");
}
