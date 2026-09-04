# <img src="icons/lasagna-14820115.png" alt="" height="30"> Lasagna Ipsum

**[lasagna-ipsum.netlify.app](https://lasagna-ipsum.netlify.app)**

Layers of delicious placeholder text. A static site with an optional serverless
API, built to run on Netlify's free tier.

## How it works

The generator ([src/generator.js](src/generator.js)) is dependency-free ESM with
no DOM and no Node APIs, so the exact same code runs in two places:

- **The browser.** [app.js](app.js) imports it directly — every click of *Bake it*
  is generated locally, so normal site usage costs **zero function invocations**.
- **A Netlify Function.** [netlify/functions/ipsum.mjs](netlify/functions/ipsum.mjs)
  wraps it for anyone who wants filler from their own tooling.

There is no build step, no framework, and no dependencies, which keeps deploys
instant and well inside the free tier's limits.

## Deploy to Netlify

Push this repo to GitHub, then in Netlify: **Add new site → Import an existing
project** and pick it. [netlify.toml](netlify.toml) already sets everything:

| Setting | Value |
| --- | --- |
| Build command | *(none)* |
| Publish directory | `.` |
| Functions directory | `netlify/functions` |

Or from the CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Local development

Any static file server works for the front end, since there's nothing to compile:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

To exercise the function too, use the Netlify CLI (this also wires up the
`/api/ipsum` redirect). It serves on a different port than the static server
above:

```bash
npx netlify-cli dev    # then open http://localhost:8888
```

The CLI needs **Node 22.13+**. On anything older the install fails with
`EBADENGINE` and nothing is cached, so `npx` re-prompts to install on every run.

Run the tests with:

```bash
npm test
```

## API

```
GET https://lasagna-ipsum.netlify.app/api/ipsum
```

| Parameter | Default | Notes |
| --- | --- | --- |
| `paragraphs` | `5` | 1–50, clamped |
| `format` | `json` | `json`, `text`, or `html` |
| `startWithLorem` | `true` | `false` skips the classic opening line (brainrot mode then opens with one of its own) |
| `brainrot` | `false` | `true` stirs the Italian brainrot meme names into the text |

Responses send `Access-Control-Allow-Origin: *`, so you can call it from the
browser. Output is random per request and therefore sent with `Cache-Control: no-store`.

```bash
curl "https://lasagna-ipsum.netlify.app/api/ipsum?paragraphs=2&format=text"
```

The site's **Use the API** panel builds this command from whatever the form is
currently set to, with a button to copy it.

```json
{
  "paragraphs": ["Lasagna ipsum dolor sit amet ..."],
  "count": 2
}
```

Errors return `400` with `{ "error": "..." }`.

## Layout

```
index.html                    markup
styles.css                    styles (light + dark)
fonts/                        self-hosted Yesteryear (display face, OFL)
icons/                        lasagna logo and favicon (Flaticon, see Credits)
app.js                        browser UI wiring
src/words.js                  word banks (kitchen Italian + optional brainrot)
src/generator.js              shared generation logic
netlify/functions/ipsum.mjs   serverless API
test/generator.test.js        generator tests
netlify.toml                  deploy config
```

The function requires Node 18+ (for the Fetch API globals); `netlify.toml` pins
the deploy to Node 20.

## Credits

- **Yesteryear** from Google Fonts, under the SIL Open Font License.
  Self-hosted in `fonts/`.
- **Lasagna icon** from [Flaticon](https://www.flaticon.com/free-icon/cheese_14820115),
  under their free licence (attribution required). Cropped from the 512px PNG
  and re-centred for the favicon; sources in `icons/`.
