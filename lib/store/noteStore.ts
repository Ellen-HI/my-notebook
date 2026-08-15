import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DraftNote = {
  day: string;
  line: number;
  text: string;
};

const key = (day: string, line: number) => `${day}-${line}`;

type NoteStore = {
  notes: Record<string, DraftNote>;
  // DraftNote[];
  setNote: (day: string, line: number, text: string) => void;
  setNotes: (notes: DraftNote[]) => void;
  clearNotes: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: {},

      setNote: (day, line, text) =>
        set((state) => ({
          notes: {
            ...state.notes,
            [key(day, line)]: { day, line, text },
          },
        })),

      setNotes: (notes) =>
        set({
          notes: Object.fromEntries(
            notes.map((note) => [key(note.day, note.line), note]),
          ),
        }),

      clearNotes: () => set({ notes: {} }),
    }),
    {
      name: "notebook-draft",
    },
  ),
);

export const selectNote = (day: string, line: number) => (state: NoteStore) =>
  state.notes[key(day, line)];
