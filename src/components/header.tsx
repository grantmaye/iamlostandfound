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
        <span className="solid-icon">&#xf004;</span>
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
      {search && (
        <form className="search-form" action="/">
          <label className="sr-only" htmlFor="site-search">
            Search stories
          </label>
          <input
            autoFocus
            id="site-search"
            name="s"
            placeholder="Start typing then hit enter..."
            required
          />
          <button className="sr-only">Search</button>
        </form>
      )}
      <div className="masthead">
        <Social />
        <a className="brand" href="/" aria-label="I Am Lost and Found home">
          <img
            src="/logo.jpg"
            srcSet="/logo-300.jpg 300w, /logo-600.jpg 600w, /logo-768.jpg 768w, /logo.jpg 800w"
            sizes="(max-width: 800px) 100vw, 800px"
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
          {search ? "×" : <span className="solid-icon">&#xf002;</span>}
        </button>
      </div>
      <button
        className="menu-toggle"
        aria-expanded={menu}
        aria-controls="navigation"
        onClick={() => setMenu(!menu)}
      >
        <span className="solid-icon" aria-hidden="true">
          &#xf0c9;
        </span>
        <span className="sr-only">Menu</span>
      </button>
      <nav
        id="navigation"
        aria-label="Main navigation"
        className={menu ? "navigation open" : "navigation"}
      >
        <a href="/">Home</a>
        <a href="/about-me/">About Me</a>
        <details
          onMouseEnter={(e) => {
            if (window.matchMedia("(min-width: 768px)").matches)
              e.currentTarget.open = true;
          }}
          onMouseLeave={(e) => {
            if (window.matchMedia("(min-width: 768px)").matches)
              e.currentTarget.open = false;
          }}
        >
          <summary>
            Destinations{" "}
            <span className="solid-icon nav-chevron">&#xf107;</span>
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
        <details
          onMouseEnter={(e) => {
            if (window.matchMedia("(min-width: 768px)").matches)
              e.currentTarget.open = true;
          }}
          onMouseLeave={(e) => {
            if (window.matchMedia("(min-width: 768px)").matches)
              e.currentTarget.open = false;
          }}
        >
          <summary>
            <a href="/category/stay/">Stay</a>{" "}
            <span className="solid-icon nav-chevron">&#xf107;</span>
          </summary>
          <div className="dropdown">
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
