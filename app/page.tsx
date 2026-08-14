"use client";
import { saveNote, fetchNotes, deleteNote } from "@/lib/api/notesApi";
import { useNoteStore } from "@/lib/store/noteStore";
import { useDebouncedCallback } from "use-debounce";
import { forwardRef, useEffect } from "react";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import HTMLFlipBook from "react-pageflip-enhanced";

const getWeek = (weekOffset: number) => {
  const today = new Date();

  const day = today.getDay();

  const monday = new Date(today);

  const daysFromMonday = day === 0 ? 6 : day - 1;

  monday.setDate(today.getDate() - daysFromMonday);
  monday.setDate(monday.getDate() + weekOffset * 7);

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
const weekOffsets = Array.from({ length: 105 }, (_, index) => index - 52);

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref} className="notebook-page">
      {children}
    </div>
  ),
);

Page.displayName = "Page";

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
      <div className="top-controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <LogoutButton />
      </div>

      <HTMLFlipBook
        className="flip-book"
        style={{}}
        width={500}
        height={900}
        size="stretch"
        minWidth={300}
        maxWidth={500}
        minHeight={540}
        maxHeight={1200}
        startPage={52}
        startZIndex={0}
        showCover={false}
        usePortrait={true}
        mobileScrollSupport={true}
        clickEventForward={false}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={true}
        disableFlipByClick={false}
        drawShadow={true}
        maxShadowOpacity={0.35}
        flippingTime={900}
        autoSize={true}
      >
        {weekOffsets.map((offset) => {
          const week = getWeek(offset);

          return (
            <Page key={offset}>
              <div className="week">
                {week.map((item, dayIndex) => {
                  const dateKey = item.date;
                  const lines = dayIndex === 6 ? 4 : 6;

                  return (
                    <section className="day" key={item.date}>
                      <h1>{translations[language].days[dayIndex]}</h1>

                      <p className="date">
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
                              item.day === dateKey &&
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
                                    console.error(
                                      "Не вдалося видалити запис:",
                                      error,
                                    );
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
            </Page>
          );
        })}
      </HTMLFlipBook>
    </main>
  );
}
