import { create } from "zustand";

export type NoteStatus = "saving" | "saved" | "failed";

const key = (day: string, line: number) => `${day}-${line}`;

type NoteStatusStore = {
  statuses: Record<string, NoteStatus>;
  setStatus: (day: string, line: number, status: NoteStatus) => void;
  clearStatus: (day: string, line: number) => void;
};

export const useNoteStatusStore = create<NoteStatusStore>()((set) => ({
  statuses: {},

  setStatus: (day, line, status) =>
    set((state) => ({
      statuses: { ...state.statuses, [key(day, line)]: status },
    })),

  clearStatus: (day, line) =>
    set((state) => {
      const next = { ...state.statuses };
      delete next[key(day, line)];
      return { statuses: next };
    }),
}));

export const selectNoteStatus =
  (day: string, line: number) => (state: NoteStatusStore) =>
    state.statuses[key(day, line)];
