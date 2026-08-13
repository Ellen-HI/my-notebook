"use client";
import { saveNote, fetchNotes } from "@/lib/api/notesApi";
import { useNoteStore } from "@/lib/store/noteStore";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";

const week = [
  {
    day: "ПОНЕДІЛОК",
    date: "2026-08-10",
  },
  {
    day: "ВІВТОРОК",
    date: "2026-08-11",
  },
  {
    day: "СЕРЕДА",
    date: "2026-08-12",
  },
  {
    day: "ЧЕТВЕР",
    date: "2026-08-13",
  },
  {
    day: "П'ЯТНИЦЯ",
    date: "2026-08-14",
  },
  {
    day: "СУБОТА",
    date: "2026-08-15",
  },
  {
    day: "НЕДІЛЯ",
    date: "2026-08-16",
  },
];

export default function Home() {
  const language = useSettingsStore((state) => state.language);
  const notes = useNoteStore((state) => state.notes);
  const setNote = useNoteStore((state) => state.setNote);
  const setNotes = useNoteStore((state) => state.setNotes);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();

        setNotes(
          data.map((note) => ({
            day: note.day,
            line: note.line,
            text: note.text,
          })),
        );
      } catch (error) {
        console.error("Не вдалося завантажити записи:", error);
      }
    };

    loadNotes();
  }, [setNotes]);

  const saveNoteToDatabase = useDebouncedCallback(
    async (day: string, line: number, text: string) => {
      try {
        await saveNote(day, line, text);
      } catch (error) {
        console.error("Не вдалося зберегти запис:", error);
      }
    },
    500,
  );

  return (
    <main className="notebook">
      <LanguageSwitcher />
      <LogoutButton />
      <div className="week">
        {week.map((item, dayIndex) => {
          const dateKey = item.date;
          const lines = dayIndex === 6 ? 4 : 6;
          return (
            <section className="day" key={item.day}>
              <h1>{translations[language].days[dayIndex]}</h1>

              <p className="date">
                {" "}
                {new Date(item.date).toLocaleDateString(
                  language === "uk" ? "uk-UA" : "en-US",
                  {
                    day: "numeric",
                    month: "long",
                  },
                )}
              </p>

              <div className="writing-lines">
                {Array.from({ length: lines }).map((_, lineIndex) => {
                  const line = lineIndex + 1;

                  const note = notes.find(
                    (item) =>
                      item &&
                      item.day === week[dayIndex].date &&
                      item.line === line,
                  );
                  return (
                    <input
                      key={line}
                      type="text"
                      className="writing-line"
                      value={note?.text || ""}
                      onChange={(event) => {
                        const text = event.target.value;
                        setNote(dateKey, line, text);

                        saveNoteToDatabase(dateKey, line, text);
                      }}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
