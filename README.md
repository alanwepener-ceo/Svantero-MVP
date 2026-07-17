# Svantero SVO₂ Platform — MVP Demo

Illustrative, front-end-only demo. No build step, no dependencies, no server logic —
just static HTML/CSS/JS with deterministic mock data. All figures are simulated.

## Copying these files to your three destinations

This folder (all 7 files) is the complete, fixed, verified current version. Copy the whole
folder's contents — don't mix in older copies of any single file — to each destination:

**1. OneDrive `MVP Demo` folder**
Replace all 7 existing files in
`C:\Alan\OneDrive - Svantero\Svantero\Svantero Platform\3. Svantero Platform\MVP Demo` with
the 7 files here (same filenames, so it's a straight overwrite/replace).

**2. GitHub**
```bash
cd path/to/this/folder
git init
git add .
git commit -m "Svantero SVO2 MVP — Bilateral Executions desk, spread analysis, window.SVO2 fix"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
(Create the empty repo on GitHub first if it doesn't exist yet — github.com → New repository
→ don't initialize with a README, since this folder already has one.)

**3. Netlify**
See "Deploy to a shareable URL" below — drag this folder onto the existing site's deploy
page (or app.netlify.com/drop for a new one). Since `app.js` changed, you must redeploy —
the previous deploy is now stale and still has the bug.

## Run it locally (30 seconds)

The site is plain static files, so you have two options.

**Option A — just open it.** Double-click `index.html` (or drag it into a browser).
Everything works from `file://` except the browser-download of the tick-data CSV on the
SVX → Institutional → Data & Analytics tab, which some browsers block on `file://`.

**Option B — serve it (recommended, avoids all `file://` quirks).**
From inside this folder, run any one of these, then open the URL it prints:

```bash
# Python (already on most machines)
python -m http.server 8080        # then visit http://localhost:8080

# Node
npx serve .                       # or: npx http-server .

# VS Code
# Right-click index.html → "Open with Live Server"
```

All five pages are linked from the top nav, so once one is open you can reach the rest.

## Where to find the new work

- **Bilateral Executions (OTC / TOMS desk):** `svx.html` → **Institutional** tab →
  **Bilateral Executions** sub-tab (first one, left of Risk & Margin). Click an axe line to
  load it into the RFQ ticket, pick counterparties, **Request Quotes**, then **Execute** —
  the trade books into the bilateral blotter and can be walked Pending → Confirmed → Settled.
- **Spread Analysis charting:** on that same Bilateral tab, and on **Data & Analytics**.
  Pick two instruments and hit **Analyse Spread** — dual-axis overlay, spread subchart,
  distribution histogram, and a summary-stats block.

## Deploy to a shareable URL

### A Netlify site is already set up for this project

- **Site name:** `svantero-svo2-mvp`
- **Live URL (once deployed):** <https://svantero-svo2-mvp.netlify.app>
- **Dashboard:** <https://app.netlify.com/projects/svantero-svo2-mvp>

The site exists but has no files on it yet — Netlify's automated deploy requires a CLI
command run from a machine with network access, which isn't available in this environment.
Finishing it yourself takes about 20 seconds:

1. Go to <https://app.netlify.com/projects/svantero-svo2-mvp/deploys>
2. Drag this whole folder onto the "Drag and drop your site output folder here" zone.
3. Netlify uploads it and your site goes live at the URL above within a few seconds.

(If you'd rather have a brand-new site instead of using this pre-created one, drag the
folder onto <https://app.netlify.com/drop> instead — same result, different site name.)

### Alternative: deploy from your own machine via CLI

If you have Node.js installed locally, this single command (run from inside this folder)
deploys straight to the site above:

```bash
npx -y @netlify/mcp@latest --site-id 6415b290-b312-4e33-b931-f78938acc877 --proxy-path "https://netlify-mcp.netlify.app//proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..3OwXWTjZP7K4LqUm.qNQDdAGndjK8YTH22vWRKl2Qrp5zfwQYJADjmCswZv3vG9tRfKFu8MTGuAv58er2-2bvJJY_oxsqjCpok5FtXvrtzZ6OPuN7RpYCJn7CbOvTbY4dVLS-VI8CQewvpj4bl7volw0VMuXMRkkpJDTVURqKZcYhPOpuGJIasVi9Ftm2H2qvb3d4HgRgqhzQcc8oCqUnuDOd_qAk0e70J6puvbgZ-7EMd32G9lcIPauIYGuT2XrVfHxYCSJ-HrX-kqtA_Ax5bLsfUztPypYYqZai9_hgSJST4MsfoLLGRZlYKMqwCjWTEoDyoOQewx2AiUtvq4a3T2ICJD56murja32mRxPMi2ygyh8wklCnldtQHmUvAcN2gK7U60OgonubYUpNhEj8I0BJ.jX9AZG-mIarRzbncg6G_Vg"
```

Note: that proxy token is short-lived, so run it soon if you go this route — if it's expired,
just ask Claude to regenerate it, or use the drag-and-drop option above instead.

### Alternatives

**GitHub Pages:** push this folder to a repo, enable Pages, serve from root.
**Azure Static Web Apps:** no build step needed; app location `/`.
**Netlify via Git (for ongoing auto-redeploy on every push):** push to GitHub, then in
Netlify choose "Import from Git" on this same site → pick the repo → leave build command
blank, publish directory `/`.

## File map

| File | Purpose |
|------|---------|
| `index.html` | Portfolio Management dashboard (home) |
| `svx.html` | SVX exchange: Spot, Derivatives, Staking, Market Risk, Institutional |
| `tokenisation.html` | Tokenisation Engine + Governance/Trust layer + royalties |
| `lifecycle.html` | Seven-stage carbon credit lifecycle |
| `exchange.html` | Redirect stub → `svx.html` (now styled) |
| `app.js` | Shared engine: mock data, formatting, charts, spread-analysis, a11y |
| `style.css` | Shared styling + dark SVX theme + new component styles |

Keep all files together in one folder — pages reference `app.js` and `style.css` by
relative path.

## Bug fix in this revision (important — read this first)

**Symptom:** every page showed *"Couldn't load the demo engine (app.js). Make sure app.js
is in the same folder as this page, then reload."* — even though `app.js` was present,
uploaded correctly, and loading with no errors.

**Root cause:** `app.js` declared its shared object as `const SVO2 = (() => {...})();`.
In JavaScript, `const`/`let` declarations at the top level of a `<script>` do **not**
become properties of `window` (only `var` and function declarations do). So `SVO2` existed
fine as a bare global, but `window.SVO2` — which is exactly what every page's load-check
tests — was always `undefined`, regardless of whether the file loaded correctly. This was
a pre-existing bug, not a deployment issue; it would have shown up the moment anyone
opened any page in a browser.

**Fix:** the single line at the top of `app.js` is now `window.SVO2 = (() => {...})();`
instead of `const SVO2 = ...`. This makes `window.SVO2` defined (fixing the check on every
page) while every existing `SVO2.xxx` call elsewhere in the code keeps working exactly as
before (window properties are also accessible as bare globals).

**Verified:** simulated the exact browser load-check in Node, confirmed `window.SVO2` is
now defined, and confirmed all 37 distinct `SVO2.*` members referenced across the 5 HTML
pages exist on the fixed object. All 5 pages' inline `<script>` blocks re-checked for valid
syntax. This is the only change versus the previous revision — nothing else in `app.js`,
or any HTML/CSS file, was touched.

## What changed in this revision

**New features**
- **Bilateral Executions** OTC desk (TOMS-style): axe & inquiry blotter, RFQ ticket with
  competing counterparty quotes, suggested-counterparty activity panel, and a bilateral
  trade blotter with Pending → Confirmed → Settled (T+0) settlement. Booked trades run
  through the same pre-trade risk checks and mark-to-market P&L as on-exchange orders.
- **Spread-analysis charting** engine (dual-axis overlay + spread subchart + distribution
  histogram + summary statistics), added to Bilateral Executions and Data & Analytics.

**Review fixes**
- Single-sourced the account balance, fund totals, and AED peg in `app.js` (no more
  duplicated literals); reconciled the top-strip equity (Main Trading Desk) vs. total firm
  equity labelling.
- Fixed the Buy-SVO₂ currency bug (BTC/ETH amounts are now converted to USD first).
- Added mark-to-market so P&L and equity move after trades.
- Accessibility: keyboard operability + focus rings for all click targets, modal
  Escape/overlay-close and focus management, ARIA labels, label/`for` associations.
- Wired the SVX market-search box; added `app.js` load guards; meta/OG tags on every page;
  "no relationship implied" notes by custodian/regulator references; styled the redirect
  stub; input bounds; a few utility classes.

## Note

This was validated for JavaScript correctness (syntax, handler resolution, chart math) but
not for pixel rendering, since it was built in a browserless environment. Open it locally
(Option B above) to confirm the visuals before sharing.
