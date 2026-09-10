import { createClient } from "@/lib/supabase/client";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      window.setTimeout(() => reject(new Error("Request timed out")), ms),
    ),
  ]);
}

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
  const user_id = await withTimeout(getUserId(supabase), 5000);

  const { data, error } = await withTimeout(
    (async () =>
      supabase
        .from("notes")
        .select("*")
        .eq("user_id", user_id)
        .order("day")
        .order("line"))(),
    5000,
  );

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

  try {
    const user_id = await getUserId(supabase);
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
    if (!navigator.onLine || isNetworkError(err)) {
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

      const { error } = save.text.trim()
        ? await supabase
            .from("notes")
            .upsert(
              { user_id, day: save.day, line: save.line, text: save.text },
              { onConflict: "user_id,day,line" },
            )
        : await supabase
            .from("notes")
            .delete()
            .eq("user_id", user_id)
            .eq("day", save.day)
            .eq("line", save.line);

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

  try {
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
  } catch (err) {
    if (!navigator.onLine || isNetworkError(err)) {
      queueSave(day, line, "");
      return;
    }
    throw err;
  }
}

function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError && /fetch/i.test(err.message);
}
