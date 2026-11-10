# MathSpin

**Spin. Learn. Conquer.** An interactive spin wheel that helps Class 11 & 12 students discover math concepts.

Each spin lands on a concept like the Quadratic Formula, Chain Rule or Bayes' Theorem, and the app:

- shows a card with the formula and a short explanation
- reads the concept aloud using the browser's text-to-speech
- celebrates with a confetti burst
- tracks your progress: total spins, unique concepts, and Grade 11 vs Grade 12

## Getting started

You need [Node.js](https://nodejs.org) installed.

```bash
npm install     # install dependencies (first time only)
npm run dev     # start the dev server, then open the URL it prints
```

Other commands:

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run build`   | Build an optimized version into `dist/`        |
| `npm run preview` | Serve the built version locally to test it     |
| `npm run lint`    | Check the code for mistakes with oxlint        |

## Project structure

```
src/
  main.jsx               Entry point: mounts <App /> into index.html
  App.jsx                Top-level layout; keeps the spin history
  components/
    Header.jsx           Logo and BETA badge
    Hero.jsx             Headline section
    SpinWheel.jsx        Canvas wheel, spin animation, winner, speech
    Stats.jsx            Counters computed from the spin history
  data/
    mathConcepts.js      The 16 concepts shown on the wheel
```

## Adding a concept

Add an object to `src/data/mathConcepts.js`. The wheel automatically makes room for it:

```js
{
  id: 17,
  title: "Mean Value Theorem",
  formula: "f'(c) = [f(b) - f(a)] / (b - a)",
  description: "Somewhere between a and b, the instantaneous slope equals the average slope.",
  grade: 12,
  color: "#60a5fa",
}
```

## Built with

- [React](https://react.dev) and [Vite](https://vite.dev)
- [canvas-confetti](https://github.com/catdad/canvas-confetti)
- The Web Speech API for read-aloud

For a line-by-line explanation of the code, see [docs/CODE_WALKTHROUGH.md](docs/CODE_WALKTHROUGH.md).
