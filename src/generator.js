// Core text generation. Pure functions, no DOM and no Node APIs, so the exact
// same code powers the browser UI and the serverless API.

import { WORDS, OPENERS, PUNCTUATION } from "./words.js";

const MAX_PARAGRAPHS = 50;

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const between = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function makeSentence({ opener = false } = {}) {
  const length = between(6, 16);
  const words = [];

  if (opener) {
    words.push(pick(OPENERS));
    // The opener already carries a few words, so shorten the tail.
    for (let i = 0; i < Math.max(2, length - 5); i++) words.push(pick(WORDS));
  } else {
    for (let i = 0; i < length; i++) words.push(pick(WORDS));
  }

  // Sprinkle in commas, but never next to each other or at the very end.
  const parts = words.map((word, i) => {
    const canComma = i > 1 && i < words.length - 2;
    return canComma && Math.random() < 0.08 ? `${word},` : word;
  });

  let sentence = parts.join(" ");
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return sentence + pick(PUNCTUATION);
}

export function makeParagraph({ opener = false } = {}) {
  const count = between(3, 7);
  const sentences = [];
  for (let i = 0; i < count; i++) {
    sentences.push(makeSentence({ opener: opener && i === 0 }));
  }
  return sentences.join(" ");
}

/**
 * @param {number} count      how many paragraphs (clamped to 1..50)
 * @param {boolean} startWith whether the first paragraph opens with the classic line
 * @returns {string[]}
 */
export function generate(count = 5, startWith = true) {
  const total = Math.min(Math.max(parseInt(count, 10) || 1, 1), MAX_PARAGRAPHS);
  const paragraphs = [];
  for (let i = 0; i < total; i++) {
    paragraphs.push(makeParagraph({ opener: startWith && i === 0 }));
  }
  return paragraphs;
}

export function toHtml(paragraphs) {
  return paragraphs.map((p) => `<p>${p}</p>`).join("\n");
}

export function toText(paragraphs) {
  return paragraphs.join("\n\n");
}

export { MAX_PARAGRAPHS };
