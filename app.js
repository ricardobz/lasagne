import { generate, toHtml, toText, MAX_PARAGRAPHS } from "./src/generator.js";

const form = document.getElementById("controls");
const countInput = document.getElementById("count");
const startWithInput = document.getElementById("startWith");
const brainrotInput = document.getElementById("brainrot");
const asHtmlInput = document.getElementById("asHtml");
const moodFace = document.getElementById("moodFace");
const moodNote = document.getElementById("moodNote");
const output = document.getElementById("output");
const stats = document.getElementById("stats");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");
const curlCode = document.getElementById("curl");
const copyCurlBtn = document.getElementById("copyCurl");

// Generation runs entirely in the browser, so the page costs zero function
// invocations. The /api endpoint exists for other tools, not for this UI.
let paragraphs = [];

function render() {
  paragraphs = generate(countInput.value, startWithInput.checked, brainrotInput.checked);
  output.textContent = "";

  if (asHtmlInput.checked) {
    const pre = document.createElement("pre");
    pre.textContent = toHtml(paragraphs);
    output.appendChild(pre);
  } else {
    for (const text of paragraphs) {
      const p = document.createElement("p");
      p.textContent = text;
      output.appendChild(p);
    }
  }

  renderCurl();
  renderMood();

  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const chars = toText(paragraphs).length;
  stats.textContent = `${paragraphs.length} paragraphs · ${words} words · ${chars} characters`;
}

// More paragraphs, more layers, happier lasagna. Ordered by upper bound; the
// last entry has to cover MAX_PARAGRAPHS.
const MOODS = [
  { upTo: 1, face: "\u{1F622}", label: "sad", note: "One sad layer." },
  { upTo: 3, face: "\u{1F615}", label: "unimpressed", note: "Barely a lasagna." },
  { upTo: 6, face: "\u{1F642}", label: "content", note: "Now we're baking." },
  { upTo: 12, face: "\u{1F60B}", label: "delighted", note: "That's a proper pan." },
  { upTo: 25, face: "\u{1F929}", label: "thrilled", note: "Nonna is proud." },
  { upTo: MAX_PARAGRAPHS, face: "\u{1F973}", label: "ecstatic", note: "Feeding the whole village!" }
];

let mood = null;

function renderMood() {
  const count = paragraphCount();
  const next = MOODS.find((m) => count <= m.upTo) ?? MOODS[MOODS.length - 1];
  if (next === mood) return;

  mood = next;
  moodFace.textContent = next.face;
  moodFace.setAttribute("role", "img");
  moodFace.setAttribute("aria-label", `Lasagna is ${next.label}`);
  moodNote.textContent = next.note;

  // Restart the pop animation on every change, not just the first.
  moodFace.classList.remove("is-new");
  void moodFace.offsetWidth;
  moodFace.classList.add("is-new");
}

function paragraphCount() {
  return Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), MAX_PARAGRAPHS);
}

// The API sits on the same origin once deployed; opened from a file:// path
// there is no origin worth printing, so name the deployed host instead.
const DEPLOYED_ORIGIN = "https://lasagna-ipsum.netlify.app";

function renderCurl() {
  const base = location.protocol.startsWith("http") ? location.origin : DEPLOYED_ORIGIN;
  const params = new URLSearchParams({
    paragraphs: String(paragraphCount()),
    format: asHtmlInput.checked ? "html" : "text"
  });
  if (!startWithInput.checked) params.set("startWithLorem", "false");
  if (brainrotInput.checked) params.set("brainrot", "true");
  curlCode.textContent = `curl "${base}/api/ipsum?${params}"`;
}

function currentText() {
  return asHtmlInput.checked ? toHtml(paragraphs) : toText(paragraphs);
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard API needs a secure context and permission; fall back to a
    // throwaway textarea so file:// and older browsers still work.
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    document.execCommand("copy");
    scratch.remove();
  }
}

async function copy() {
  await writeClipboard(currentText());
  flash(copyBtn, "Copied!");
}

async function copyCurl() {
  await writeClipboard(curlCode.textContent);
  flash(copyCurlBtn, "Copied!");
}

function download() {
  const blob = new Blob([currentText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = asHtmlInput.checked ? "lasagna-ipsum.html" : "lasagna-ipsum.txt";
  link.click();
  URL.revokeObjectURL(url);
}

function flash(button, message) {
  const original = button.textContent;
  button.textContent = message;
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1200);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

// Re-render on toggle so the format switch feels immediate.
asHtmlInput.addEventListener("change", render);
copyBtn.addEventListener("click", copy);
downloadBtn.addEventListener("click", download);
copyCurlBtn.addEventListener("click", copyCurl);

// The snippet mirrors the form, so it follows every keystroke rather than
// waiting for the next bake.
form.addEventListener("input", () => {
  renderCurl();
  renderMood();
});

// Shareable links: /?paragraphs=8 pre-fills the form.
const params = new URLSearchParams(location.search);
const requested = parseInt(params.get("paragraphs"), 10);
if (Number.isFinite(requested)) {
  countInput.value = Math.min(Math.max(requested, 1), MAX_PARAGRAPHS);
}
if (params.get("startWithLorem") === "false") {
  startWithInput.checked = false;
}
if (params.get("brainrot") === "true") {
  brainrotInput.checked = true;
}

render();
