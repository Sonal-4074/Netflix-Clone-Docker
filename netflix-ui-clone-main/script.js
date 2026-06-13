/* ============================================================
   NetClone — app logic
   ============================================================ */

// ---------- Placeholder movie data ----------
const POSTERS = [
  "/images/poster-1.png",
  "/images/poster-2.png",
  "/images/poster-3.png",
  "/images/poster-4.png",
  "/images/poster-5.png",
  "/images/poster-6.png",
  "/images/poster-7.png",
  "/images/poster-8.png",
];

const TITLES = [
  "Echoes of Tomorrow", "Crimson Protocol", "The Last Throne", "Neon Veil",
  "Golden Hour", "The Hollow House", "Ashes of War", "Beyond the Stars",
  "Silent Frequency", "Midnight Run", "Iron Verdict", "Frostbound",
  "Electric Souls", "Rooftop Stories", "The Whisper", "Operation Nightfall",
  "Orbital", "Static Pulse", "Verdant", "Afterglow", "Dead Reckoning",
  "Paper Kingdoms", "Glass Horizon", "The Reckoners", "Lunar Tide",
  "Final Transmission", "Cinder & Smoke", "Parallel", "Heartstrings",
  "The Long Dark", "Quantum Drift", "Velvet Underground", "Steel Rain",
  "The Inheritance", "Wavelength",
];

const GENRES = [
  "Sci-Fi", "Action", "Fantasy", "Crime", "Romance", "Horror",
  "War", "Adventure", "Thriller", "Comedy", "Drama", "Mystery",
];

const CAST_POOL = [
  "Eva Rourke", "Marcus Cole", "Lena Park", "Diego Marin", "Aria Singh",
  "Theo Walsh", "Nadia Frost", "Sam Okafor", "Iris Lang", "Cole Bennett",
];

const DESCRIPTIONS = [
  "A gripping journey through impossible odds where every choice reshapes the world.",
  "When the past returns, one person must choose between loyalty and survival.",
  "A breathtaking spectacle of ambition, betrayal, and the price of power.",
  "In a city that never sleeps, a quiet hero confronts the chaos within.",
  "A heartfelt story about connection, loss, and the courage to begin again.",
  "Something lurks in the dark — and it knows your name.",
  "An epic tale of sacrifice told against the roar of an unforgiving battlefield.",
  "Far beyond the reach of home, hope becomes the only fuel that matters.",
];

let _id = 0;
function makeMovie() {
  const posterIndex = _id % POSTERS.length;
  return {
    id: ++_id,
    title: TITLES[(_id - 1) % TITLES.length],
    poster: POSTERS[posterIndex],
    year: 2017 + Math.floor(Math.random() * 9),
    rating: (7 + Math.random() * 2.9).toFixed(1),
    match: 70 + Math.floor(Math.random() * 30),
    runtime: `${1 + Math.floor(Math.random() * 2)}h ${Math.floor(Math.random() * 59)}m`,
    rated: ["13+", "16+", "18+", "PG", "R"][Math.floor(Math.random() * 5)],
    genres: shuffle(GENRES).slice(0, 3),
    cast: shuffle(CAST_POOL).slice(0, 4),
    desc: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)],
  };
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeRow(count = 12) {
  return Array.from({ length: count }, makeMovie);
}

const ROWS = [
  { title: "Trending Now", ranked: true, items: makeRow(10) },
  { title: "Popular on NetClone", items: makeRow() },
  { title: "Action Movies", items: makeRow() },
  { title: "Sci-Fi Movies", items: makeRow() },
  { title: "Comedy Movies", items: makeRow() },
  { title: "New Releases", items: makeRow() },
  { title: "Top Rated", items: makeRow() },
];

const ALL_MOVIES = ROWS.flatMap((r) => r.items);

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------- Card builder ----------
function cardHTML(movie, rank) {
  return `
    <article class="card" data-id="${movie.id}" tabindex="0" aria-label="${movie.title}">
      ${rank ? `<span class="card__rank">${rank}</span>` : ""}
      <span class="card__preview"><i class="fa-solid fa-circle"></i> Trailer</span>
      <img src="${movie.poster}" alt="${movie.title} poster" loading="lazy" decoding="async" />
      <div class="card__overlay">
        <h4 class="card__title">${movie.title}</h4>
        <div class="card__meta">
          <span class="match">${movie.match}% Match</span>
          <span>${movie.year}</span>
          <span class="rated">${movie.rated}</span>
        </div>
        <div class="card__meta" style="margin-top:.3rem">
          <span><i class="fa-solid fa-star" style="color:#f5c518"></i> ${movie.rating}</span>
          <span>${movie.genres[0]}</span>
        </div>
        <div class="card__actions">
          <button class="mini play" aria-label="Play"><i class="fa-solid fa-play"></i></button>
          <button class="mini" aria-label="Add"><i class="fa-solid fa-plus"></i></button>
          <button class="mini" aria-label="More info"><i class="fa-solid fa-chevron-down"></i></button>
        </div>
      </div>
    </article>`;
}

// ---------- Render rows ----------
function renderRows() {
  const wrap = $("#rows");
  wrap.innerHTML = ROWS.map(
    (row) => `
    <section class="row">
      <div class="row__head">
        <h3 class="row__title">${row.title}</h3>
        <span class="row__explore">Explore All <i class="fa-solid fa-chevron-right"></i></span>
      </div>
      <div class="row__viewport">
        <button class="row__arrow row__arrow--left" aria-label="Scroll left"><i class="fa-solid fa-chevron-left"></i></button>
        <div class="row__track">
          ${row.items.map((m, i) => cardHTML(m, row.ranked ? i + 1 : null)).join("")}
        </div>
        <button class="row__arrow row__arrow--right" aria-label="Scroll right"><i class="fa-solid fa-chevron-right"></i></button>
      </div>
    </section>`
  ).join("");

  // Slider arrows
  $$(".row__viewport").forEach((vp) => {
    const track = $(".row__track", vp);
    const amount = () => track.clientWidth * 0.8;
    $(".row__arrow--left", vp).addEventListener("click", () =>
      track.scrollBy({ left: -amount(), behavior: "smooth" })
    );
    $(".row__arrow--right", vp).addEventListener("click", () =>
      track.scrollBy({ left: amount(), behavior: "smooth" })
    );
  });
}

// ---------- Modal ----------
const modal = $("#modal");
function openModal(id) {
  const m = ALL_MOVIES.find((x) => x.id === Number(id));
  if (!m) return;
  $("#modalImg").src = m.poster;
  $("#modalImg").alt = `${m.title} poster`;
  $("#modalTitle").textContent = m.title;
  $("#modalMatch").textContent = `${m.match}% Match`;
  $("#modalYear").textContent = m.year;
  $("#modalRated").textContent = m.rated;
  $("#modalRuntime").textContent = m.runtime;
  $("#modalDesc").textContent = m.desc;
  $("#modalCast").textContent = m.cast.join(", ");
  $("#modalGenres").textContent = m.genres.join(", ");
  $("#modalRating").textContent = `★ ${m.rating} / 10`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
$("#modalClose").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Featured "More Info"
$("#featuredInfo").addEventListener("click", () => openModal(1));

// Delegated card clicks
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    openModal(card.dataset.id);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement.classList.contains("card")) {
    openModal(document.activeElement.dataset.id);
  }
});

// ---------- Search ----------
const searchBox = $("#search");
const searchInput = $("#searchInput");
const searchResults = $("#searchResults");
const searchGrid = $("#searchGrid");
const rowsEl = $("#rows");

$("#searchToggle").addEventListener("click", () => {
  searchBox.classList.toggle("active");
  if (searchBox.classList.contains("active")) searchInput.focus();
  else clearSearch();
});

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return clearSearch();
  const matches = ALL_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q))
  );
  // de-dupe by title
  const seen = new Set();
  const unique = matches.filter((m) => {
    if (seen.has(m.title)) return false;
    seen.add(m.title);
    return true;
  });
  rowsEl.classList.add("hidden");
  searchResults.classList.remove("hidden");
  $(".search-results__title").textContent = unique.length
    ? `Results for "${searchInput.value.trim()}"`
    : `No matches for "${searchInput.value.trim()}"`;
  searchGrid.innerHTML = unique.map((m) => cardHTML(m)).join("");
});

function clearSearch() {
  searchInput.value = "";
  searchResults.classList.add("hidden");
  rowsEl.classList.remove("hidden");
}

// ---------- Navbar scroll ----------
const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// ---------- Landing -> App transition ----------
const landing = $("#landing");
const app = $("#app");

function enterApp() {
  landing.classList.add("hidden");
  app.classList.remove("hidden");
  window.scrollTo(0, 0);
  document.title = "Home — NetClone";
}
$("#signInBtn").addEventListener("click", enterApp);
$("#getStartedForm").addEventListener("submit", (e) => {
  e.preventDefault();
  enterApp();
});

// ---------- Intro animation ----------
window.addEventListener("load", () => {
  renderRows();
  setTimeout(() => {
    $("#intro").classList.add("intro--hide");
  }, 2600);
});
