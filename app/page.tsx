"use client";
import { saveNote, fetchNotes, deleteNote } from "@/lib/api/notesApi";
import { selectNote, useNoteStore } from "@/lib/store/noteStore";
import { useDebouncedCallback } from "use-debounce";
import { forwardRef, useEffect, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { translations } from "@/lib/i18n";
import { useSettingsStore } from "@/lib/store/settingsStore";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import HTMLFlipBook from "react-pageflip-enhanced";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

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
    const dayOfMonth = String(date.getDate()).padStart(2, "0");

    return {
      date: `${year}-${month}-${dayOfMonth}`,
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
    flipNext: () => void;
    flipPrev: () => void;
  };
};

type SyncNoteFn = ((day: string, line: number, text: string) => void) & {
  cancel: () => void;
};

function NoteInput({
  dateKey,
  line,
  setNote,
  syncNoteToDatabase,
  notesT,
}: {
  dateKey: string;
  line: number;
  setNote: (day: string, line: number, text: string) => void;
  syncNoteToDatabase: SyncNoteFn;
  notesT: (typeof translations)[keyof typeof translations]["notes"];
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

        syncNoteToDatabase(dateKey, line, text);
      }}
      onBlur={(event) => {
        const text = event.target.value;

        syncNoteToDatabase.cancel();

        if (text.trim()) {
          saveNote(dateKey, line, text).catch((error) => {
            console.error("Не вдалося зберегти запис:", error);
            toast.error(notesT.saveFailed);
          });
        } else {
          deleteNote(dateKey, line).catch((error) => {
            console.error("Не вдалося видалити запис:", error);
            toast.error(notesT.deleteFailed);
          });
        }
      }}
    />
  );
}

export default function Home() {
  const flipBookRef = useRef<FlipBookApi | null>(null);
  const language = useSettingsStore((state) => state.language);
  const notesT = translations[language].notes;
  const theme = useSettingsStore((state) => state.theme);
  const setNote = useNoteStore((state) => state.setNote);
  const setNotes = useNoteStore((state) => state.setNotes);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch (error) {
        console.error("Не вдалося завантажити записи:", error);
        toast.error(notesT.loadFailed);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNotes]);

  const notebookRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoadingNotes) {
      return;
    }

    const updateBook = () => {
      flipBookRef.current?.pageFlip()?.update();
    };

    const initialTimer = window.setTimeout(updateBook, 100);

    document.fonts?.ready?.then(updateBook);
    let resizeObserver: ResizeObserver | undefined;

    if (notebookRef.current && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => updateBook());
      resizeObserver.observe(notebookRef.current);
    }

    window.addEventListener("orientationchange", updateBook);
    window.addEventListener("resize", updateBook);

    return () => {
      window.clearTimeout(initialTimer);
      resizeObserver?.disconnect();
      window.removeEventListener("orientationchange", updateBook);
      window.removeEventListener("resize", updateBook);
    };
  }, [isLoadingNotes]);

  const syncNoteToDatabase = useDebouncedCallback(
    async (day: string, line: number, text: string) => {
      try {
        if (text.trim()) {
          await saveNote(day, line, text);
        } else {
          await deleteNote(day, line);
        }
      } catch (error) {
        console.error("Не вдалося синхронізувати запис:", error);
        toast.error(text.trim() ? notesT.saveFailed : notesT.deleteFailed);
      }
    },
    500,
  );

  if (isLoadingNotes) {
    return (
      <main className="notebook notebook-loading">
        <Loader size="large" />
      </main>
    );
  }

  return (
    <main className="notebook" ref={notebookRef}>
      <div className="top-controls">
        <ThemeSwitcher />
        <div className="flip-controls">
          <button
            type="button"
            onClick={() => flipBookRef.current?.pageFlip()?.flipPrev()}
            aria-label="previous page"
          >
            <Image
              src={theme === "dark" ? "/leftLight.svg" : "/left.svg"}
              alt="Previous page"
              width={40}
              height={40}
              loading="eager"
            />
          </button>
          <button
            type="button"
            onClick={() => flipBookRef.current?.pageFlip()?.flipNext()}
            aria-label="next page"
          >
            <Image
              src={theme === "dark" ? "/rightLight.svg" : "/right.svg"}
              alt="Next page"
              width={40}
              height={40}
              loading="eager"
            />
          </button>
        </div>

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
        mobileScrollSupport={false}
        clickEventForward={false}
        useMouseEvents={false}
        swipeDistance={18}
        showPageCorners={false}
        disableFlipByClick={true}
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
                            syncNoteToDatabase={syncNoteToDatabase}
                            notesT={notesT}
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
