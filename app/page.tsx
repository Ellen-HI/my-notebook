"use client";
import { saveNote, fetchNotes, deleteNote } from "@/lib/api/notesApi";
import { selectNote, useNoteStore } from "@/lib/store/noteStore";
import { useDebouncedCallback } from "use-debounce";
import { forwardRef, useEffect, useRef } from "react";
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
const weekOffsets = Array.from({ length: 25 }, (_, index) => index - 12);

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref} className="notebook-page">
      {children}
    </div>
  ),
);

Page.displayName = "Page";

type FlipBookApi = {
  pageFlip: () => {
    update: () => void;
  };
};

type SaveNoteFn = ((day: string, line: number, text: string) => void) & {
  cancel: () => void;
};
function NoteInput({
  dateKey,
  line,
  setNote,
  saveNoteToDatabase,
}: {
  dateKey: string;
  line: number;
  setNote: (day: string, line: number, text: string) => void;
  saveNoteToDatabase: SaveNoteFn;
}) {
  const note = useNoteStore(selectNote(dateKey, line));

  return (
    <input
      type="text"
      className="writing-line"
      defaultValue={note?.text ?? ""}
      onChange={(event) => {
        const text = event.target.value;
        setNote(dateKey, line, text);
        if (text.trim()) {
          saveNoteToDatabase(dateKey, line, text);
        }
      }}
      onBlur={(event) => {
        const text = event.target.value;

        if (!text.trim()) {
          saveNoteToDatabase.cancel();

          deleteNote(dateKey, line).catch((error) => {
            console.error("Не вдалося видалити запис:", error);
          });
        }
      }}
    />
  );
}

export default function Home() {
  const flipBookRef = useRef<FlipBookApi | null>(null);
  const language = useSettingsStore((state) => state.language);
  const setNote = useNoteStore((state) => state.setNote);
  const setNotes = useNoteStore((state) => state.setNotes);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error("Не вдалося завантажити записи:", error);
      }
    };

    loadNotes();
  }, [setNotes]);

  useEffect(() => {
    const updateBook = () => {
      flipBookRef.current?.pageFlip()?.update();
    };

    const timer = window.setTimeout(updateBook, 100);

    window.addEventListener("orientationchange", updateBook);
    window.addEventListener("resize", updateBook);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("orientationchange", updateBook);
      window.removeEventListener("resize", updateBook);
    };
  }, []);

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
        ref={flipBookRef}
        width={500}
        height={1100}
        size="stretch"
        minWidth={500}
        maxWidth={700}
        minHeight={780}
        maxHeight={1540}
        startPage={12}
        startZIndex={0}
        showCover={false}
        usePortrait={true}
        autoSize={true}
        mobileScrollSupport={true}
        clickEventForward={false}
        useMouseEvents={true}
        swipeDistance={18}
        showPageCorners={true}
        disableFlipByClick={false}
        drawShadow={true}
        maxShadowOpacity={0.35}
        flippingTime={450}
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

                      <div
                        className="writing-lines"
                        onMouseDownCapture={(event) => event.stopPropagation()}
                        onTouchStartCapture={(event) => event.stopPropagation()}
                        onTouchMoveCapture={(event) => event.stopPropagation()}
                      >
                        {Array.from({ length: lines }).map((_, lineIndex) => (
                          <NoteInput
                            key={lineIndex + 1}
                            dateKey={dateKey}
                            line={lineIndex + 1}
                            setNote={setNote}
                            saveNoteToDatabase={saveNoteToDatabase}
                          />
                        ))}
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
