// Netlify Function (v2 handler signature) exposing the generator as JSON/text/HTML.
// Runs on the free tier: no build step, no dependencies, no state.

import { generate, toHtml, toText, MAX_PARAGRAPHS } from "../../src/generator.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// Output is random on every call, so caching it would defeat the point.
const BASE_HEADERS = { ...CORS, "Cache-Control": "no-store" };

export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const params = new URL(request.url).searchParams;
  const requested = parseInt(params.get("paragraphs") ?? "5", 10);

  if (params.has("paragraphs") && !Number.isFinite(requested)) {
    return json({ error: "`paragraphs` must be a number between 1 and " + MAX_PARAGRAPHS }, 400);
  }

  const count = Math.min(Math.max(Number.isFinite(requested) ? requested : 5, 1), MAX_PARAGRAPHS);
  const startWithLorem = params.get("startWithLorem") !== "false";
  const format = (params.get("format") ?? "json").toLowerCase();

  const paragraphs = generate(count, startWithLorem);

  switch (format) {
    case "text":
    case "txt":
      return new Response(toText(paragraphs), {
        headers: { ...BASE_HEADERS, "Content-Type": "text/plain; charset=utf-8" }
      });

    case "html":
      return new Response(toHtml(paragraphs), {
        headers: { ...BASE_HEADERS, "Content-Type": "text/html; charset=utf-8" }
      });

    case "json":
      return json({ paragraphs, count: paragraphs.length });

    default:
      return json({ error: "`format` must be one of: json, text, html" }, 400);
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...BASE_HEADERS, "Content-Type": "application/json; charset=utf-8" }
  });
}
