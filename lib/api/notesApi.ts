import { createClient } from "@/lib/supabase/client";

export type Note = {
  id: number;
  user_id: string;
  day: string;
  line: number;
  text: string;
  created_at: string;
};

let cachedUserId: string | null = null;

async function getUserId(supabase: ReturnType<typeof createClient>) {
  if (cachedUserId) return cachedUserId;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Користувач не авторизований");
  }

  cachedUserId = user.id;
  return cachedUserId;
}

export function clearUserIdCache() {
  cachedUserId = null;
}

export async function fetchNotes() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("day")
    .order("line");

  if (error) {
    throw new Error(error.message);
  }

  return data as Note[];
}

const PENDING_SAVES_KEY = "pending-saves";

type PendingSave = { day: string; line: number; text: string };

function getPendingSaves(): PendingSave[] {
  try {
    const raw = localStorage.getItem(PENDING_SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setPendingSaves(saves: PendingSave[]) {
  localStorage.setItem(PENDING_SAVES_KEY, JSON.stringify(saves));
}

function queueSave(day: string, line: number, text: string) {
  const saves = getPendingSaves();
  const existingIndex = saves.findIndex(
    (s) => s.day === day && s.line === line,
  );

  if (existingIndex >= 0) {
    saves[existingIndex].text = text;
  } else {
    saves.push({ day, line, text });
  }

  setPendingSaves(saves);
}

export async function saveNote(day: string, line: number, text: string) {
  const supabase = createClient();
  const user_id = await getUserId(supabase);

  try {
    const { data, error } = await supabase
      .from("notes")
      .upsert({ user_id, day, line, text }, { onConflict: "user_id,day,line" })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as Note;
  } catch (err) {
    if (!navigator.onLine) {
      queueSave(day, line, text);
      return null;
    }
    throw err;
  }
}

export async function syncPendingSaves(): Promise<void> {
  const saves = getPendingSaves();
  if (saves.length === 0) return;

  const remaining: PendingSave[] = [];

  for (const save of saves) {
    try {
      const supabase = createClient();
      const user_id = await getUserId(supabase);

      const { error } = await supabase
        .from("notes")
        .upsert(
          { user_id, day: save.day, line: save.line, text: save.text },
          { onConflict: "user_id,day,line" },
        );

      if (error) {
        remaining.push(save);
      }
    } catch {
      remaining.push(save);
    }
  }

  setPendingSaves(remaining);
}

export async function deleteNote(day: string, line: number) {
  const supabase = createClient();
  const user_id = await getUserId(supabase);

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("user_id", user_id)
    .eq("day", day)
    .eq("line", line);

  if (error) {
    throw new Error(error.message);
  }
}
