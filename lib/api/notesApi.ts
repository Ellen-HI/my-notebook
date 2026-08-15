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

export async function saveNote(day: string, line: number, text: string) {
  const supabase = createClient();
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
