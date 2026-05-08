# pong-spuree

A small playable pong demonstration built with Phaser 4 + Vite + TypeScript, using public-domain Steamboat Willie Mickey as the paddle character.

## Controls

- W / S or ↑ / ↓ to move
- First to 5 wins
- Click or SPACE to start / restart

## Run locally

```bash
npm install
npm run dev
```

Opens `http://localhost:8080`.

## Build

```bash
npm run build
```

Outputs to `dist/`. Static-host anywhere.

## Asset

**Mickey from Steamboat Willie** (US public domain since 2024-01-01) cropped from the Walt Disney Animation Studios logo loop on Wikimedia Commons.

## Origin

Started from [`phaserjs/template-vite-ts`](https://github.com/phaserjs/template-vite-ts). Pong logic written from scratch (~150 lines, see `src/game/scenes/Game.ts`).

## License

Code: MIT (inherited from `phaserjs/template-vite-ts`, see [LICENSE](./LICENSE)).
Mickey image: US public domain (Steamboat Willie, 1928).
