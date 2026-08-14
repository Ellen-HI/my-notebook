"use client";
import { saveNote, fetchNotes, deleteNote } from "@/lib/api/notesApi";
import { useNoteStore } from "@/lib/store/noteStore";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const getCurrentWeek = () => {
  const today = new Date();

  const day = today.getDay();

  const monday = new Date(today);

  const daysFromMonday = day === 0 ? 6 : day - 1;

  monday.setDate(today.getDate() - daysFromMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return {
      date: `${year}-${month}-${day}`,
    };
  });
};

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
  const week = getCurrentWeek();
  return (
    <main className="notebook">
      <div className="top-controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <LogoutButton />
      </div>
      <div className="week">
        {week.map((item, dayIndex) => {
          const dateKey = item.date;
          const lines = dayIndex === 6 ? 4 : 6;
          return (
            <section className="day" key={item.date}>
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
                        if (text.trim() === "") {
                          deleteNote(dateKey, line).catch((error) => {
                            console.error("Не вдалося видалити запис:", error);
                          });

                          return;
                        }

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
