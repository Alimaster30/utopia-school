# UTOPIA

**UTOPIA - School of Excellence**

The current UTOPIA website, with the reference layout, typography, animations and interactions preserved. Includes the client crest, photographs, public baking reel, contact details and the footer credit **Site by Tahir Ali - flowcraft.agency**. Footer social links are Facebook and Instagram.

## Run locally

```sh
npm ci
npm start
```

Open http://127.0.0.1:3001/ . To use another port, set `PORT` before starting. The server has no third-party runtime dependencies.

## Deploy on Render

Create a **Web Service** connected to this repository, or create a Blueprint using the included `render.yaml`.

| Setting | Value |
|---|---|
| Branch | `main` |
| Language | Node |
| Root directory | Repository root; leave blank |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Environment variable | `NODE_ENV=production` |
| Health check | `/` |

The included `.node-version` selects Node 24.21.0. In production the server binds to `0.0.0.0` and uses Render's `PORT` environment variable. The Blueprint selects the free compute plan; the plan can be changed in Render.

Use a Node web service to preserve cached guide/slideshow AJAX responses, query filters and video byte-range playback. A plain static-site deployment does not serve those POST routes.

Official setup references: [Render web services](https://render.com/docs/web-services), [Node version](https://render.com/docs/node-version), [Blueprint specification](https://render.com/docs/blueprint-spec).

## Other hosting platforms

Any platform supporting a persistent Node HTTP process can use the same commands. Set `NODE_ENV=production` and the platform-assigned `PORT`; `HOST` can override the bind address. All website files are bundled under `public/`.

## Verify

```sh
npm run build
npm run smoke
```

Run `smoke` while the server is running. Its default target is `http://127.0.0.1:3001`; set `CLONE_URL` if using another port.

`build` checks HTML/CSS resource references and records asset hashes in `verification-report.json`. `smoke` checks captured pages/assets, guide/slideshow fragments and video byte ranges.

## Content scope

This publishes the current **asset and identity adaptation**. Original article copy, student-guide names/narratives, programme descriptions and statistics remain reference content, as requested for the asset-only pass. They have not been verified as UTOPIA facts. Social artwork can retain older crest wording or past promotional text. The contact-form submission backend is not connected; current admissions links use the school's WhatsApp contact.

Unused original-school photographs, videos and narration are excluded from this deployment package. The original reference capture remains in the separate UTOPIA repository.

## Project files

- `public/`: pages, client media, styles, fonts and scripts.
- `server.mjs`: static serving, presentation fragments, filter routing and media ranges.
- `render.yaml`: Render Blueprint.
- `asset-manifest.json`: bundled resource inventory and provenance.
- `media-provenance.json`: client video/audio source and rendition hashes.
- `scripts/`: build/resource verification and server checks.
