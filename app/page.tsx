"use client";
import { useState } from "react";
const week = [
  {
    day: "ПОНЕДІЛОК",
    date: "10 серпня",
  },
  {
    day: "ВІВТОРОК",
    date: "11 серпня",
  },
  {
    day: "СЕРЕДА",
    date: "12 серпня",
  },
  {
    day: "ЧЕТВЕР",
    date: "13 серпня",
  },
  {
    day: "П'ЯТНИЦЯ",
    date: "14 серпня",
  },
  {
    day: "СУБОТА",
    date: "15 серпня",
  },
  {
    day: "НЕДІЛЯ",
    date: "16 серпня",
  },
];

const getSavedNotes = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const savedNotes = localStorage.getItem("notebook-notes");

  return savedNotes ? JSON.parse(savedNotes) : [];
};

export default function Home() {
  const [notes, setNotes] = useState<string[]>(getSavedNotes);

  const handleChange = (index: number, value: string) => {
    const updatedNotes = [...notes];

    updatedNotes[index] = value;

    setNotes(updatedNotes);

    localStorage.setItem("notebook-notes", JSON.stringify(updatedNotes));
  };
  let inputIndex = 0;

  return (
    <main className="notebook">
      <div className="week">
        {week.map((item, index) => {
          const lines = index === 6 ? 4 : 6;
          return (
            <section className="day" key={item.day}>
              <h1>{item.day}</h1>
              <p className="date">{item.date}</p>

              <div className="writing-lines">
                {Array.from({ length: lines }).map((_, lineIndex) => {
                  const currentIndex = inputIndex++;
                  return (
                    <input
                      key={lineIndex}
                      type="text"
                      className="writing-line"
                      value={notes[currentIndex] || ""}
                      onChange={(event) =>
                        handleChange(currentIndex, event.target.value)
                      }
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
