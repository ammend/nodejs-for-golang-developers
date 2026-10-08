# Node.js for Golang Developers

**English** | [简体中文](README.zh-CN.md)

> Talk is cheap. Show me the code.

Learn Node.js from Go by editing and running real examples. A bilingual, two-level learning guide with paired editors, local execution, browser previews, and automatic progress.

## Run

Requires **Node.js ≥ 22.12**, **Go ≥ 1.22**, and Linux/macOS (Windows: WSL).

```bash
npm ci
npm run build
npm start
```

Open **http://127.0.0.1:3000**. Stop with `Ctrl+C`.

For a remote machine, set your own long token, then run:

```bash
HOST=0.0.0.0 PORT=3000 ACCESS_TOKEN='your-random-token-at-least-24-characters' npm start
```

Open `http://SERVER_IP:3000` and enter that token. Use a trusted network or an encrypted SSH tunnel: `ssh -L 3000:127.0.0.1:3000 user@server`. This runs code with the server account’s permissions; it is **not a multi-user sandbox**.

## Curriculum

All **24 items across six stages** include editable code, Chinese/English explanations, and an exercise.

| Stage | Items |
| --- | --- |
| Mental models · 2 | Values and references; sync, async and the event loop |
| JS / TS · 6 | Conditions and loops; functions and modules; collections; JSON; errors; TypeScript |
| Node backend · 7 | HTTP server; routing; query parameters; request bodies; headers; middleware; files |
| Frontend · 3 | HTML/CSS; DOM events; React/JSX |
| Full-stack integration · 3 | API consumption; server rendering; form validation |
| Projects · 3 | Todo API; configuration; behavior tests |

Click **Run** to record an item as studied—even if it errors. Code, language, and progress stay in your browser. Frontend lessons show an interactive preview; full-stack lessons show the result of real HTTP requests as a page snapshot. Rerunning creates a fresh workspace.

## Under the hood

- [Sandpack](https://github.com/codesandbox/sandpack) editors; local Go/Node execution; esbuild for TS and browser examples. No external preview service or CDN.
- Server runs have a **10-second timeout**, two-job limit, and bounded input/output. Browser preview scripts run in a sandboxed iframe; the server timeout does not stop browser loops.
- TypeScript is transpiled, not type-checked. These are small learning examples, not production applications or a comprehensive language reference.
- Content: [`curriculum.js`](curriculum.js) + [`tasks/`](tasks/). Startup skill: [`nodejs-for-golang-developers-start`](skills/nodejs-for-golang-developers-start/SKILL.md).

## Test

```bash
npm test
npx playwright install chromium
npm run test:browser
```

Build first after editing the UI. Cold Go compilation may exceed the execution timeout; retry after the cache warms. See [REVIEW.md](REVIEW.md) for the initial implementation review.

Inspired by [Golang for Node.js Developers](https://github.com/miguelmota/golang-for-nodejs-developers). [MIT](LICENSE).
