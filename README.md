# STK Push widget

Static site + two Netlify Functions. No server to run yourself — Netlify hosts
`index.html` and runs the two small `.js` functions on demand.

## Files
- `index.html` — the form + live status UI
- `netlify.toml` — tells Netlify where the functions live
- `netlify/functions/stk-push.js` — sends the STK Push request (holds the API key)
- `netlify/functions/status.js` — polls transaction status by id

## Deploy
1. Push this folder to a GitHub repo, or drag-and-drop it into Netlify's dashboard.
2. In Netlify → Site settings → Environment variables, add:
   - `PAYLOR_API_KEY` = your Paylor secret key (needs payment + wallet scopes)
3. Deploy. Netlify builds the functions automatically — nothing else to configure.

The key never reaches the browser: the frontend only ever calls your own
`/.netlify/functions/...` routes, which attach the key server-side before
talking to `api.paylorke.com`.

## Local testing
```
npm install -g netlify-cli
netlify dev
```
This serves `index.html` and runs the functions locally, reading `PAYLOR_API_KEY`
from a `.env` file (create one with `PAYLOR_API_KEY=...`, don't commit it).
