// Core text generation. Pure functions, no DOM and no Node APIs, so the exact
// same code powers the browser UI and the serverless API.

import { WORDS, OPENERS, BRAINROT, BRAINROT_OPENERS, PUNCTUATION } from "./words.js";

const MAX_PARAGRAPHS = 50;

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const between = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// Brainrot is opt-in and additive: the meme names are stirred into the kitchen
// vocabulary rather than replacing it.
const wordBank = (brainrot) => (brainrot ? [...WORDS, ...BRAINROT] : WORDS);

function makeSentence({ opener = false, brainrot = false, openers = OPENERS } = {}) {
  const length = between(6, 16);
  const bank = wordBank(brainrot);
  const words = [];

  if (opener) {
    words.push(pick(openers));
    // The opener already carries a few words, so shorten the tail.
    for (let i = 0; i < Math.max(2, length - 5); i++) words.push(pick(bank));
  } else {
    for (let i = 0; i < length; i++) words.push(pick(bank));
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

export function makeParagraph({ opener = false, brainrot = false, openers = OPENERS } = {}) {
  const count = between(3, 7);
  const sentences = [];
  for (let i = 0; i < count; i++) {
    sentences.push(makeSentence({ opener: opener && i === 0, brainrot, openers }));
  }
  return sentences.join(" ");
}

/**
 * @param {number} count      how many paragraphs (clamped to 1..50)
 * @param {boolean} startWith whether the first paragraph opens with the classic line
 * @param {boolean} brainrot  whether to stir in the Italian brainrot meme names
 * @returns {string[]}
 */
export function generate(count = 5, startWith = true, brainrot = false) {
  const total = Math.min(Math.max(parseInt(count, 10) || 1, 1), MAX_PARAGRAPHS);

  // The classic line always wins when its toggle is on. Brainrot only supplies
  // an opening line when that toggle is off, and nothing opens otherwise.
  const openers = startWith ? OPENERS : BRAINROT_OPENERS;
  const opensWithLine = startWith || brainrot;

  const paragraphs = [];
  for (let i = 0; i < total; i++) {
    paragraphs.push(makeParagraph({ opener: opensWithLine && i === 0, brainrot, openers }));
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
