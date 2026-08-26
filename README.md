# Second Opinion

AI that challenges your thinking instead of simply agreeing with you.

This is a full-stack app: a React/Vite/TypeScript frontend, and a small Express
backend that holds your API key(s) and proxies requests to Claude, ChatGPT, or
Gemini. Keys never touch the browser.

## 1. Get API key(s)

You only need **one** provider to get started — add more any time.

- Claude — https://console.anthropic.com/settings/keys
- ChatGPT — https://platform.openai.com/api-keys
- Gemini — https://aistudio.google.com/apikey

## 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste in whichever key(s) you have
```

## 3. Set up the frontend

```bash
# from the project root
npm install
```

## 4. Run both together (development)

```bash
# from the project root
npm run dev
```

This starts the Express API on `http://localhost:3001` and the Vite dev server
on `http://localhost:5173` at the same time. The frontend's `/api/*` calls are
proxied to the backend automatically (see `vite.config.ts`) — no extra config
needed. Open `http://localhost:5173`.

You can also run them separately in two terminals:
```bash
npm run dev:server   # backend only
npm run dev:client   # frontend only
```

## Choosing a provider

Both the New Opinion page and the Compare AI page show a provider picker
(Claude / ChatGPT / Gemini). Only providers with a key configured on the
backend are selectable — the others show as greyed out with a "no key" label.
Your last choice is remembered in the browser (`localStorage`) and reused next
time. `GET /api/providers` reports which providers are configured, so the
frontend never has to guess.

## Deploying

**Option A — one service serving both.** Build the frontend, then start the
backend; it detects the built `dist/` folder and serves it directly:
```bash
npm run build          # builds frontend to ./dist
npm run server:build    # compiles backend to ./server/dist
npm run server:start    # starts the backend, which now also serves the frontend
```
Deploy the whole repo (with your provider API key(s) set as environment
variables on the host) to any Node-friendly platform — Render, Railway,
Fly.io, a VPS, etc.

**Option B — split hosting.** Deploy `server/` as its own service (e.g. a
Render/Railway web service, or a Vercel/Netlify serverless function you adapt
the routes into) and deploy the frontend separately (Vercel, Netlify, Cloudflare
Pages). If split, set `VITE_API_BASE_URL` (in a frontend `.env`) to your
backend's public URL before building, so `src/lib/api.ts` calls the right host.

## Project structure

```
src/                        frontend (React + TypeScript + Vite + Tailwind)
  types/analysis.ts          the DecisionAnalysis / CompareResult / ProviderInfo models
  lib/
    api.ts                    calls the backend (/api/analyze, /api/compare, /api/providers)
    useProviders.ts            hook: fetches provider list, remembers the user's choice
    mockAI.ts                  DEMO_ANALYSIS — the hand-written landing-page demo
    storage.ts                  localStorage-backed decision history
  context/ThemeContext.tsx    light/dark mode, persisted + respects OS preference
  components/
    ui/                          Button, Chip, ThemeToggle, ProviderPicker
    layout/                      Navbar, Footer
    analysis/                    every analysis-specific component
  pages/                      Home, NewOpinion, Analyzing, Results, CompareAI, History

server/                      backend (Express + TypeScript)
  src/index.ts                the API: /api/analyze, /api/compare, /api/providers, /api/health
  src/prompts.ts               system prompts + strict JSON schema instructions
  src/providers/                one file per AI provider, behind a shared interface
    types.ts                     the Provider interface every provider implements
    claude.ts                    Anthropic SDK
    chatgpt.ts                   OpenAI SDK
    gemini.ts                    Google GenAI SDK
    index.ts                     registry: getProvider(id), listProviders()
  .env.example                copy to .env and add your key(s)
```

## How the backend works

- `POST /api/analyze` — body `{ decision, context?, focusAreas?, provider? }`.
  Builds a prompt instructing the model to return **only** JSON matching the
  `DecisionAnalysis` schema, calls whichever provider was requested (falls
  back to the first configured one if omitted or invalid), validates the
  shape of what comes back, and responds with a complete analysis or a
  clear error.
- `POST /api/compare` — body `{ opinionA, opinionB, provider? }`. Same
  pattern, for the Compare AI page.
- `GET /api/providers` — `[{ id, label, hasApiKey, model }]` for all three
  providers, so the frontend can show/hide/disable options correctly.
- `GET /api/health` — same info, for quick sanity-checking.
- Every route validates input (required fields, length limits) and fails
  with a clear JSON error rather than crashing, since any provider can time
  out, rate-limit, or occasionally return malformed JSON despite instructions.

### Adding another provider

Each provider is a small object implementing the `Provider` interface in
`server/src/providers/types.ts` (`id`, `label`, `hasApiKey`, `model`, and an
async `call({ system, userPrompt, maxTokens })` that returns raw text). To add
one: create `server/src/providers/<name>.ts` following the existing three as
a template, then register it in `server/src/providers/index.ts`'s `registry`
and `DEFAULT_ORDER`. No other file needs to change.

## Design tokens

Defined in `src/index.css` under `@theme`:
- **Color:** cream/ink (light), charcoal/cream (dark), wine accent, moss
  (support) and rust (risk) as sparing semantic colors
- **Type:** Fraunces (display/serif headlines) + Inter (body/UI) + IBM Plex
  Mono (labels, data, confidence %)
- **Dark mode:** class-based (`.dark` on `<html>`, via a Tailwind v4
  `@custom-variant`), toggled in the navbar, persisted to `localStorage`,
  defaults to OS preference on first visit

## Known gaps / good next steps

- Model names for ChatGPT (`gpt-5.6`) and Gemini (`gemini-3.7-flash`) are set
  as sensible current defaults in `.env.example` — override
  `OPENAI_MODEL` / `GEMINI_MODEL` / `ANTHROPIC_MODEL` if a provider renames or
  retires a model after this was written.
- No rate limiting on the backend yet — add one (e.g. `express-rate-limit`)
  before deploying publicly, since each request costs API credits regardless
  of provider.
- No caching — identical decisions re-call the model every time.
- `DEMO_ANALYSIS` (used for "Try an Example" on the landing page) stays a
  static, hand-written analysis by design, so the landing page always loads
  instantly with no API cost — it does not call any provider.
- Each provider's raw-JSON-extraction and prompt handling hasn't been tested
  against a live key in this environment (no network access to test API
  hosts here) — the code follows each SDK's documented usage, but exercising
  a real request against each of the three is worth doing before you rely on
  it.
