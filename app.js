import { generate, toHtml, toText, MAX_PARAGRAPHS } from "./src/generator.js";

const form = document.getElementById("controls");
const countInput = document.getElementById("count");
const startWithInput = document.getElementById("startWith");
const asHtmlInput = document.getElementById("asHtml");
const output = document.getElementById("output");
const stats = document.getElementById("stats");
const copyBtn = document.getElementById("copy");
const downloadBtn = document.getElementById("download");

// Generation runs entirely in the browser, so the page costs zero function
// invocations. The /api endpoint exists for other tools, not for this UI.
let paragraphs = [];

function render() {
  paragraphs = generate(countInput.value, startWithInput.checked);
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

  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  const chars = toText(paragraphs).length;
  stats.textContent = `${paragraphs.length} paragraphs · ${words} words · ${chars} characters`;
}

function currentText() {
  return asHtmlInput.checked ? toHtml(paragraphs) : toText(paragraphs);
}

async function copy() {
  const text = currentText();
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
  flash(copyBtn, "Copied!");
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

// Shareable links: /?paragraphs=8 pre-fills the form.
const params = new URLSearchParams(location.search);
const requested = parseInt(params.get("paragraphs"), 10);
if (Number.isFinite(requested)) {
  countInput.value = Math.min(Math.max(requested, 1), MAX_PARAGRAPHS);
}
if (params.get("startWithLorem") === "false") {
  startWithInput.checked = false;
}

render();
