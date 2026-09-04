import assert from "node:assert/strict";
import { generate, toHtml, toText, MAX_PARAGRAPHS } from "../src/generator.js";
import { BRAINROT, CLASSIC_OPENER, BRAINROT_OPENERS } from "../src/words.js";

const check = (name, fn) => {
  fn();
  console.log(`  ok  ${name}`);
};

check("returns the requested number of paragraphs", () => {
  assert.equal(generate(3).length, 3);
  assert.equal(generate(1).length, 1);
});

check("clamps out-of-range and junk input", () => {
  assert.equal(generate(0).length, 1);
  assert.equal(generate(-5).length, 1);
  assert.equal(generate(999).length, MAX_PARAGRAPHS);
  assert.equal(generate("abc").length, 1);
  assert.equal(generate(undefined).length, 5);
});

check("honours the opening line toggle", () => {
  // The checkbox quotes this line verbatim, so every run has to deliver it --
  // not one opener out of a pool that happens to include it.
  for (let i = 0; i < 100; i++) {
    assert.ok(generate(2, true)[0].startsWith(CLASSIC_OPENER), "missing classic opener");
  }
  const plain = generate(20, false);
  assert.ok(plain.every((p) => !p.startsWith(CLASSIC_OPENER)));
});

check("opens only the first paragraph, never the rest", () => {
  const paragraphs = generate(20, true);
  assert.ok(paragraphs[0].startsWith(CLASSIC_OPENER));
  assert.ok(paragraphs.slice(1).every((p) => !p.startsWith(CLASSIC_OPENER)));
});

check("every paragraph is non-trivial and ends in punctuation", () => {
  for (const p of generate(MAX_PARAGRAPHS)) {
    assert.ok(p.split(/\s+/).length >= 10, `too short: ${p}`);
    assert.match(p, /[.!?]$/);
    assert.doesNotMatch(p, /,\s*,|,\s*[.!?]/, `stray comma: ${p}`);
    assert.doesNotMatch(p, /\s{2,}/, `double space: ${p}`);
  }
});

check("brainrot never overrides the classic opening line", () => {
  for (let i = 0; i < 40; i++) {
    const first = generate(1, true, true)[0];
    assert.ok(first.startsWith(CLASSIC_OPENER), `not the classic opener: ${first}`);
  }
});

check("brainrot opens with its own line when the classic one is off", () => {
  for (let i = 0; i < 40; i++) {
    const first = generate(1, false, true)[0];
    assert.ok(BRAINROT_OPENERS.some((o) => first.startsWith(o)), `not a brainrot opener: ${first}`);
  }
});

check("keeps brainrot out unless it is asked for", () => {
  const plain = generate(MAX_PARAGRAPHS, false).join(" ").toLowerCase();
  for (const phrase of BRAINROT) {
    assert.ok(!plain.includes(phrase), `leaked brainrot: ${phrase}`);
  }
});

check("stirs in brainrot when enabled", () => {
  const text = generate(MAX_PARAGRAPHS, false, true).join(" ").toLowerCase();
  assert.ok(BRAINROT.some((phrase) => text.includes(phrase)), "no brainrot in brainrot mode");
});

check("brainrot paragraphs stay well formed", () => {
  for (const p of generate(MAX_PARAGRAPHS, true, true)) {
    assert.match(p, /[.!?]$/);
    assert.doesNotMatch(p, /,\s*,|,\s*[.!?]/, `stray comma: ${p}`);
    assert.doesNotMatch(p, /\s{2,}/, `double space: ${p}`);
  }
});

check("formats as html and text", () => {
  const paragraphs = generate(2);
  assert.equal(toHtml(paragraphs).match(/<p>/g).length, 2);
  assert.equal(toText(paragraphs).split("\n\n").length, 2);
});

console.log("\nAll generator tests passed.");
