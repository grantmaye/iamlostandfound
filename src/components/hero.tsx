"use client";
import { useEffect, useState } from "react";
type Slide = {
  href: string;
  image: string;
  title: string;
  date: string;
  categories: string;
  comments: number;
};
export function Hero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000,
    );
    return () => clearInterval(id);
  }, [paused, slides.length]);
  if (!slides.length) return null;
  return (
    <section
      className="hero"
      aria-label="Featured stories"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
    >
      {slides.map((s, i) => (
        <div
          key={s.href}
          className={"slide " + (i === index ? "active" : "")}
          aria-hidden={i !== index}
          style={{ backgroundImage: `url("${s.image}")` }}
        >
          <div className="hero-panel">
            <h2>
              <a tabIndex={i === index ? 0 : -1} href={s.href}>
                {s.title}
              </a>
            </h2>
            <div className="hero-meta">
              {s.date}
              <span>/</span>
              {s.comments} {s.comments === 1 ? "Comment" : "Comments"}
              <span>/</span>
              {s.categories}
            </div>
          </div>
        </div>
      ))}
      <button
        className="previous"
        aria-label="Previous story"
        onClick={() => setIndex((index + slides.length - 1) % slides.length)}
      >
        ‹
      </button>
      <button
        className="next"
        aria-label="Next story"
        onClick={() => setIndex((index + 1) % slides.length)}
      >
        ›
      </button>
      <div className="dots">
        {slides.map((s, i) => (
          <button
            key={s.href}
            aria-label={`Show story ${i + 1}`}
            aria-pressed={i === index}
            className={i === index ? "selected" : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      <button
        className="pause"
        aria-label={paused ? "Play slideshow" : "Pause slideshow"}
        onClick={() => setPaused(!paused)}
      >
        {paused ? "▶" : "Ⅱ"}
      </button>
    </section>
  );
}
