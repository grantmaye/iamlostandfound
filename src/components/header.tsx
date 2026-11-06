"use client";
import { useState } from "react";
const destinations = [
  "Antarctica",
  "Argentina",
  "Austria",
  "Belize",
  "Bhutan",
  "Botswana",
  "Caribbean",
  "Costa Rica",
  "Croatia",
  "Egypt",
  "England",
  "Finland",
  "France",
  "Greece",
  "Iceland",
  "Italy",
  "Japan",
  "Mexico",
  "Montenegro",
  "Morocco",
  "Nicaragua",
  "Norway",
  "Slovenia",
  "South Africa",
  "Spain",
  "Uganda",
  "United States",
  "Uruguay",
];
const stays = [
  ["Africa", "stay-in-africa"],
  ["North America", "stay-in-north-america"],
  ["South America", "stay-in-americas"],
  ["Europe", "stay-in-europe"],
  ["Caribbean", "stay-in-the-caribbean"],
];
export function Social() {
  return (
    <div className="social">
      <a href="https://www.facebook.com/lostandfoundiam" aria-label="Facebook">
        <span className="brand-icon">&#xf39e;</span>
      </a>
      <a href="https://www.bloglovin.com/@jamiesedwards" aria-label="Bloglovin">
        ♥
      </a>
      <a
        href="https://www.instagram.com/iamlostandfound_"
        aria-label="Instagram"
      >
        <span className="brand-icon">&#xf16d;</span>
      </a>
      <a
        href="https://www.linkedin.com/in/jamie-edwards-39a0837/"
        aria-label="LinkedIn"
      >
        <span className="brand-icon">&#xf0e1;</span>
      </a>
      <a
        href="https://www.pinterest.com/jamieedwards/_created/"
        aria-label="Pinterest"
      >
        <span className="brand-icon">&#xf231;</span>
      </a>
    </div>
  );
}
export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  return (
    <header className="site-header shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="masthead">
        <Social />
        <a className="brand" href="/" aria-label="I Am Lost and Found home">
          <img
            src="/logo.jpg"
            width="800"
            height="216"
            alt="I AM LOST AND FOUND — INSPIRING / TRAVEL"
          />
        </a>
        <button
          className="search-toggle"
          aria-label={search ? "Close search" : "Open search"}
          aria-expanded={search}
          onClick={() => setSearch(!search)}
        >
          {search ? (
            "×"
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 6 6" />
            </svg>
          )}
        </button>
      </div>
      {search && (
        <form className="search-form" action="/">
          <label htmlFor="site-search">Search stories</label>
          <input
            autoFocus
            id="site-search"
            name="s"
            placeholder="Start typing then hit enter..."
            required
          />
          <button>Search</button>
        </form>
      )}
      <button
        className="menu-toggle"
        aria-expanded={menu}
        aria-controls="navigation"
        onClick={() => setMenu(!menu)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
        <span className="sr-only">Menu</span>
      </button>
      <nav
        id="navigation"
        aria-label="Main navigation"
        className={menu ? "navigation open" : "navigation"}
      >
        <a href="/">Home</a>
        <a href="/about-me/">About Me</a>
        <details>
          <summary>
            Destinations <span>⌄</span>
          </summary>
          <div className="dropdown destinations">
            {destinations.map((n) => (
              <a
                key={n}
                href={"/category/" + n.toLowerCase().replaceAll(" ", "-") + "/"}
              >
                {n}
              </a>
            ))}
          </div>
        </details>
        <details>
          <summary>
            Stay <span>⌄</span>
          </summary>
          <div className="dropdown">
            <a href="/category/stay/">All stays</a>
            {stays.map(([n, s]) => (
              <a key={s} href={"/category/stay/" + s + "/"}>
                {n}
              </a>
            ))}
          </div>
        </details>
        <a href="/travel-coaching-2/">Travel Coaching</a>
        <a href="/category/travel-essays/">Travel Essays</a>
        <a href="/elementor-15992/">Subscribe</a>
      </nav>
    </header>
  );
}
