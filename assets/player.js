const params = new URLSearchParams(location.search);
const slug = document.body.dataset.slug;
let player;
let paragraphs = [];
let chapters = [];
let activeId = null;

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function setLang(mode) {
  document.body.dataset.lang = mode;
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === mode));
  });
}

function seekTo(seconds) {
  highlight(seconds);
  if (!player || typeof player.seekTo !== "function") return;
  player.seekTo(seconds, true);
  player.playVideo();
}

function render(data) {
  document.title = `${data.titleZh} · ${data.titleEn}`;
  document.getElementById("video-title").textContent = data.titleZh;
  document.getElementById("video-sub").textContent =
    `${data.titleEn} · ${data.channel}`;

  chapters = data.chapters || [];
  const nav = document.getElementById("chapter-nav");
  nav.innerHTML = "";
  chapters.forEach((ch, idx) => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = `${formatTime(ch.start)} ${ch.titleZh}`;
    btn.addEventListener("click", () => seekTo(ch.start));
    btn.dataset.chapter = String(idx);
    nav.appendChild(btn);
  });

  const root = document.getElementById("transcript");
  root.innerHTML = "";
  paragraphs = [];
  chapters.forEach((ch, chapterIndex) => {
    const section = document.createElement("section");
    section.className = "section";
    section.id = `ch-${chapterIndex}`;
    const h = document.createElement("h2");
    h.textContent = `${formatTime(ch.start)}  ${ch.titleZh}`;
    section.appendChild(h);
    (ch.paragraphs || []).forEach((p, paraIndex) => {
      const id = `${chapterIndex}-${paraIndex}`;
      const btn = document.createElement("button");
      btn.className = "para";
      btn.type = "button";
      btn.dataset.id = id;
      btn.innerHTML = `
        <div class="time">${formatTime(p.start)}</div>
        <p class="zh">${p.zh}</p>
        <p class="en">${p.en}</p>
      `;
      btn.addEventListener("click", () => seekTo(p.start));
      section.appendChild(btn);
      paragraphs.push({
        id,
        start: Number(p.start),
        chapterIndex,
        el: btn,
      });
    });
    root.appendChild(section);
  });
}

function highlight(t) {
  if (!paragraphs.length) return;
  let chapterIndex = 0;
  chapters.forEach((ch, idx) => {
    if (t + 0.2 >= ch.start) chapterIndex = idx;
  });
  const inChapter = paragraphs.filter((p) => p.chapterIndex === chapterIndex);
  let current = inChapter[0] || paragraphs[0];
  for (const p of inChapter) {
    if (t + 0.2 >= p.start) current = p;
  }
  if (activeId === current.id) return;
  activeId = current.id;
  paragraphs.forEach((p) => p.el.classList.toggle("active", p.id === current.id));
  document.querySelectorAll("#chapter-nav .chip").forEach((btn) => {
    if (Number(btn.dataset.chapter) === current.chapterIndex) {
      btn.setAttribute("aria-current", "true");
    } else {
      btn.removeAttribute("aria-current");
    }
  });
  current.el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function tick() {
  if (!player || typeof player.getCurrentTime !== "function") return;
  highlight(player.getCurrentTime());
}

function onYouTubeIframeAPIReady() {
  const youtubeId = document.body.dataset.youtubeId;
  player = new YT.Player("player", {
    videoId: youtubeId,
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      hl: "zh-Hant",
      origin: location.origin,
    },
    events: {
      onReady() {
        setInterval(tick, 250);
      },
    },
  });
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

async function boot() {
  await window.videoTranscriptsAuth.maybeGate();
  const res = await fetch("./transcript.json");
  const data = await res.json();
  render(data);
  const lang = params.get("lang");
  setLang(lang === "zh" || lang === "en" || lang === "both" ? lang : "both");
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
  });
}

boot();
