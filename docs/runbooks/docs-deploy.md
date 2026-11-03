# Runbook — Docs deploy (Storybook on Cloudflare)

The docs are Storybook, built to `storybook-static/` and served by a
Cloudflare Worker that holds only static assets
(`.storybook/wrangler.jsonc`).

- URL: <https://material-design-react.nicolassoares-santos.workers.dev>
- Deployed by `.github/workflows/docs.yml` on every push to `main` (that is,
  every merged pull request), or by hand from the Actions tab
  (*Run workflow*).
- CI builds Storybook on every pull request, so a broken story never reaches
  `main`.

---

## Credentials

| Name | Kind (GitHub → Settings → Secrets and variables → Actions) | What it is |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Secret | API token `github-actions-material-design-react` |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | The Cloudflare account the Worker lives in |

The token is a **custom token** with one permission — **Account · Workers
Scripts · Edit** — on this account only. No zone permissions (the Worker uses
`workers.dev`), no KV, R2 or other products: if the token leaks, it can deploy
Workers on this account and nothing else. No IP filter, because GitHub's
runners change address on every run.

## Rotate or replace the token

When it expires, leaks, or is lost:

1. Cloudflare → My Profile → API Tokens: roll the token (new value, same
   permissions) or create a new custom token as above, and delete the old one.
2. Test it, in a terminal where the value won't be logged:
   `curl "https://api.cloudflare.com/client/v4/user/tokens/verify" -H "Authorization: Bearer <token>"`
   — expect `"status":"active"`.
3. Replace the secret: `gh secret set CLOUDFLARE_API_TOKEN -R Nic-Soares/material-design-react`
   (it prompts for the value).
4. Actions → Docs → *Run workflow* to check a deploy.

## Deploy by hand

From a clean `main`:

```sh
npm run build-storybook
npx wrangler login      # opens the browser; no token needed locally
npx wrangler deploy -c .storybook/wrangler.jsonc
```

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Authentication error [code: 10000]` | The token lacks a permission Wrangler needs | Add **Account · Account Settings · Read** to the token, then record it in this runbook |
| A file over 25 MiB | Workers static assets limit files to 25 MiB | Find the file in `storybook-static/`; split or drop it |
