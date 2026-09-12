const THEME_KEY = "video-transcripts-theme";
const CHAPTER_KEY = "video-transcripts-chapters";

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", String(next === "dark"));
    btn.setAttribute(
      "aria-label",
      next === "dark" ? "切換為淺色模式" : "切換為銀河暗黑模式"
    );
    btn.title = next === "dark" ? "淺色模式" : "銀河暗黑模式";
  }
}

function toggleTheme() {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
}

function chaptersOpen() {
  return localStorage.getItem(CHAPTER_KEY) === "open";
}

function setChaptersOpen(open) {
  localStorage.setItem(CHAPTER_KEY, open ? "open" : "closed");
  const nav = document.getElementById("chapter-nav");
  const toggle = document.getElementById("chapter-toggle");
  const dock = document.querySelector(".chapter-dock");
  if (nav) nav.hidden = !open;
  if (toggle) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "收合" : "章節";
  }
  if (dock) dock.classList.toggle("open", open);
}

function initTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark");
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", toggleTheme);
}

window.videoTranscriptsTheme = {
  applyTheme,
  toggleTheme,
  initTheme,
  chaptersOpen,
  setChaptersOpen,
};
