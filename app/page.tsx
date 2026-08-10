export default function Home() {
  return (
    <main className="notebook">
      <section className="day">
        <h1>ПОНЕДІЛОК</h1>
        <p className="date">10 серпня</p>

        <h2>Плани на сьогодні:</h2>

        <textarea placeholder="Тиць..." />

        <h2>Важливе:</h2>

        <textarea placeholder="І тут тиць..." />
      </section>

      <section className="day">
        <h1>ВІВТОРОК</h1>
        <p className="date">11 серпня</p>

        <h2>Плани на сьогодні:</h2>

        <textarea placeholder="Тиць..." />

        <h2>Важливе:</h2>

        <textarea placeholder="І тут тиць..." />
      </section>
    </main>
  );
}
