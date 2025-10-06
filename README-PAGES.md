# GitHub Pages Frontend voor AIBOT

1) Zet deze map `docs/` in de root van je repo.
2) Repo moet **Public** zijn (Settings → Danger Zone → Change visibility).
3) Zet Pages aan (Settings → Pages → Source: Deploy from a branch → Branch: main, Folder: /docs).
4) Vul in `docs/config.js` jouw backend URL in (bijv. https://aibot.fly.dev).
5) Backend moet CORS toestaan (in je Node app: `npm i cors` en `app.use(cors())`).

Daarna is je site live op: https://<username>.github.io/<repo-name>/
