import { createClient } from "@/lib/supabase/client";

export type Note = {
  id: number;
  user_id: string;
  day: string;
  line: number;
  text: string;
  created_at: string;
};

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Користувач не авторизований");
  }

  const { data, error } = await supabase
    .from("notes")
    .upsert(
      {
        user_id: user.id,
        day,
        line,
        text,
      },
      {
        onConflict: "user_id,day,line",
      },
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Note;
}

export async function deleteNote(day: string, line: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Користувач не авторизований");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("user_id", user.id)
    .eq("day", day)
    .eq("line", line);

  if (error) {
    throw new Error(error.message);
  }
}
