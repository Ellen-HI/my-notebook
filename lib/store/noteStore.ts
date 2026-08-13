import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DraftNote = {
  day: string;
  line: number;
  text: string;
};

type NoteStore = {
  notes: DraftNote[];
  setNote: (day: string, line: number, text: string) => void;
  setNotes: (notes: DraftNote[]) => void;
  clearNotes: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],

      setNote: (day, line, text) =>
        set((state) => {
          const existingNote = state.notes.find(
            (note) => note.day === day && note.line === line,
          );

          if (existingNote) {
            return {
              notes: state.notes.map((note) =>
                note.day === day && note.line === line
                  ? { ...note, text }
                  : note,
              ),
            };
          }

          return {
            notes: [
              ...state.notes,
              {
                day,
                line,
                text,
              },
            ],
          };
        }),
      setNotes: (notes) => set({ notes }),
      clearNotes: () => set({ notes: [] }),
    }),
    {
      name: "notebook-draft",
    },
  ),
);
