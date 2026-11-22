# Baba Saleh Store — full handoff package

Complete store: Arabic RTL storefront + admin panel + SQLite database (Node.js).

**Start here: [README-AR.md](README-AR.md)** — full Arabic setup guide: hosting requirements (Node 22+, tested on Node 22; current LTS is Node 26), run steps, Docker, owner settings to fill, backup, and demo-mode flags.

Quick start: `npm install --omit=dev && ADMIN_PASSWORD=<choose> PORT=3000 node server.js`
Admin panel at `/admin`. Payments are COD + manual transfer only (no card gateway).
