const GATE =
  "6fc2a811492e31df3f60e21009907b22f503348087a6674b836d154741998601";
const GATE_KEY = "video-transcripts-gate";

async function sha256hex(value) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isUnlocked() {
  return sessionStorage.getItem(GATE_KEY) === GATE;
}

async function maybeGate() {
  const gate = document.getElementById("gate");
  if (isUnlocked()) {
    if (gate) gate.classList.remove("open");
    return true;
  }

  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-err");
  if (!gate || !form || !input) return false;

  gate.classList.add("open");
  input.focus();

  return new Promise((resolve) => {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const hex = await sha256hex(input.value.trim());
      if (hex !== GATE) {
        if (err) err.hidden = false;
        input.select();
        return;
      }
      sessionStorage.setItem(GATE_KEY, hex);
      gate.classList.remove("open");
      resolve(true);
    });
  });
}

window.videoTranscriptsAuth = { maybeGate, isUnlocked };
