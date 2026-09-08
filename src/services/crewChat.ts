import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type CrewMessage = {
  id: string;
  crewId: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  body: string;
  createdAt: string;
};

type CrewMessageRow = { id: string; crew_id: string; user_id: string; body: string; created_at: string };
type ProfileRow = { id: string; username: string | null; avatar_url: string | null };

const displayName = (userId: string, username: string | null) => username ?? `Member ${userId.slice(0, 4)}`;

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("You need to be signed in to do that.");
  return data.user.id;
}

async function hydrateMessages(rows: CrewMessageRow[]): Promise<CrewMessage[]> {
  if (!rows.length) return [];

  const userIds = [...new Set(rows.map((row) => row.user_id))];
  const { data: profileRows } = await supabase.from("profiles").select("id, username, avatar_url").in("id", userIds);
  const profiles = new Map(((profileRows ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));

  return rows.map((row) => {
    const profile = profiles.get(row.user_id);
    return {
      id: row.id,
      crewId: row.crew_id,
      userId: row.user_id,
      username: displayName(row.user_id, profile?.username ?? null),
      avatarUrl: profile?.avatar_url ?? null,
      body: row.body,
      createdAt: row.created_at,
    };
  });
}

export async function getCrewMessages(crewId: string, limit = 50): Promise<CrewMessage[]> {
  const { data, error } = await supabase
    .from("crew_messages")
    .select("id, crew_id, user_id, body, created_at")
    .eq("crew_id", crewId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Unable to load this crew's chat right now.");
  const messages = await hydrateMessages((data ?? []) as CrewMessageRow[]);
  return messages.reverse();
}

export async function sendCrewMessage(crewId: string, body: string): Promise<CrewMessage> {
  const userId = await getCurrentUserId();
  const trimmedBody = body.trim();
  if (!trimmedBody) throw new Error("Type a message first.");

  const { data, error } = await supabase
    .from("crew_messages")
    .insert({ crew_id: crewId, user_id: userId, body: trimmedBody })
    .select()
    .single();

  if (error) throw new Error("Unable to send your message. Please try again.");
  const [message] = await hydrateMessages([data as CrewMessageRow]);
  return message;
}

export function subscribeToCrewMessages(crewId: string, onMessage: (row: CrewMessageRow) => void): RealtimeChannel {
  return supabase
    .channel(`crew-messages-${crewId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "crew_messages", filter: `crew_id=eq.${crewId}` },
      (payload) => onMessage(payload.new as CrewMessageRow),
    )
    .subscribe();
}

export async function hydrateMessageRow(row: CrewMessageRow): Promise<CrewMessage> {
  const [message] = await hydrateMessages([row]);
  return message;
}
