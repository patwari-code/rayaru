# MathSpin Code Walkthrough

A guided tour of the project, in the order the browser runs it:
`index.html` → `main.jsx` → `App.jsx` → the components.
"L12" means line 12 of the file being discussed.

---

## 1. The setup files

### `package.json`: what the project is and what it uses
- **L2–4** `name`, `private`, `version`: basic info. `private: true` stops it from being published to npm by accident.
- **L5** `"type": "module"`: lets the code use modern `import`/`export` instead of the older `require()`.
- **L6–11** `scripts`: shortcuts you run with `npm run <name>`:
  - `dev` starts a local server that reloads as you edit
  - `build` creates an optimized version in `dist/` that you can deploy
  - `lint` runs `oxlint` to catch mistakes
  - `preview` serves the built version so you can test it
- **L12–17** `dependencies`: libraries the app needs to run: `react` and `react-dom` build the UI, `canvas-confetti` makes the confetti burst, and `howler` is an audio library that is installed but never imported.
- **L18–24** `devDependencies`: tools you only need while developing (Vite, the linter, type hints). They don't ship to users.

### `vite.config.js`
- **L1–2** Imports the React plugin and Vite's `defineConfig` helper.
- **L5–7** Tells Vite to use the React plugin. That plugin is what lets the browser understand JSX (HTML-like code inside JavaScript) and gives you instant reload while editing.

### `index.html`: the only real HTML page
- **L1** `<!DOCTYPE html>` tells the browser to use modern HTML rules.
- **L2** `lang="en"` helps screen readers and search engines.
- **L4** `charset="UTF-8"` makes special characters and emoji show up correctly.
- **L5** The little icon in the browser tab.
- **L6** `viewport` makes the page fit phone screens instead of showing a zoomed-out desktop page.
- **L7** The text on the browser tab.
- **L8–10** Loads the Orbitron and Space Grotesk fonts from Google. The `preconnect` lines open the connection early so the fonts load faster.
- **L13** `<div id="root"></div>` is an empty box. React fills it with the whole app.
- **L14** Loads `main.jsx`, where the JavaScript starts.

---

## 2. `src/main.jsx`: the starting point

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
- **L1** `StrictMode` is a development-only helper. It runs some code twice on purpose to expose bugs. It does nothing in the built version.
- **L2** `createRoot` is how React 18+ attaches itself to the page.
- **L3** Loads the global styles: background colour, fonts, CSS variables.
- **L4** Imports the top-level `App` component.
- **L6** Finds the `#root` div, hands it to React, and tells React to draw `<App />` inside it. Everything you see on the page comes from this one line.

---

## 3. `src/App.jsx`: the top-level component that holds everything

- **L1** Imports `useState`. This is a React **hook** that lets a component remember a value, and React redraws the screen whenever that value changes.
- **L2–5** Imports the four page pieces (components).
- **L6** Imports the list of math concepts.
- **L7** Styles for the layout.
- **L9** `function App()`: a component is just a function that returns UI.
- **L10** `const [history, setHistory] = useState([])` creates a value called `history` that starts as an empty list. `setHistory` is the only correct way to change it, because calling it tells React to redraw. This list of every concept you've landed on is what feeds the Stats panel.
- **L12–14** `handleSpinEnd` is passed down to the wheel. When a spin finishes, the wheel calls it with the winning concept.
  - `setHistory((prev) => [...prev, concept])` builds a **new** list: all the old items (`...prev` is the spread operator) plus the new one. Never edit state in place (like `history.push(...)`), because React only notices a change when it gets a new value.
- **L16–32** The JSX that describes the page:
  - **L17** `className` is how JSX writes the HTML `class` attribute (`class` is a reserved word in JavaScript).
  - **L18, L20** Draws the Header and Hero.
  - **L22** `<SpinWheel segments={mathConcepts} onSpinEnd={handleSpinEnd} />` passes **props** (inputs) to the wheel: the data and the callback. Data flows *down* through props, and events flow *up* through callbacks. This is the core pattern in React.
  - **L24** `{history.length > 0 && <Stats .../>}` is conditional rendering. If the left side is false, nothing is shown, so Stats only appears after your first spin.
  - **L26–30** Footer. `&mdash;` is an em dash (—).
- **L35** `export default App` makes the component available to `main.jsx`.

---

## 4. `Header.jsx` and `Hero.jsx`: display-only components

These don't hold any state or logic. They just display things.

**Header.jsx**
- **L1** Imports this component's own CSS. Keeping each component's styles in its own file keeps things organized.
- **L3** An arrow-function component, which works the same as `function Header()`.
- **L5–6** `<header>` is a semantic tag: it tells browsers and screen readers what this part of the page is.
- **L9–22** An SVG logo drawn with code:
  - `<circle>` is the ring and `<path d="M9 14L13 10...">` is a diamond. `M` means "move to" and `L` means "line to".
  - `<defs>` holds reusable definitions. Here it's two gradients (cyan → purple) that the circle and diamond use via `url(#logoGrad)`.
  - In JSX, SVG attributes are camelCase: `strokeWidth`, not `stroke-width`.
- **L24** The "MATHSPIN" text, and **L27** a "BETA" badge.

**Hero.jsx**
- **L5–20** The big headline section.
- **L8** An empty `<span>` that CSS turns into a glowing dot.
- **L12–14** Each "." is wrapped in `hero-accent` so CSS can colour it differently.

---

## 5. `src/data/mathConcepts.js`: the content

A plain JavaScript **array of objects**, with one object per wheel slice:
```js
{ id: 1, title: "...", formula: "...", description: "...", grade: 11, color: "#00f0ff" }
```
- `id` is a unique number, used by Stats to count unique concepts.
- `title` is written on the wheel and read aloud.
- `formula` / `description` are shown on the result card, and the description is read aloud too.
- `grade` (11 or 12) is used for the grade counters in Stats.
- `color` is a hex colour that tints the slice, the confetti, and the result card.

The content is kept separate from the code. Add another object and the wheel automatically gets another slice, with no other changes needed.

---

## 6. `Stats.jsx`: counters that react to history

- **L1** Imports `useState` and `useEffect`. `useEffect` runs code *after* React draws the screen, which is where you do side effects like timers.
- **L4** `({ history })` uses destructuring to pull the `history` prop out of the props object.
- **L5** `animate` is a true/false flag that controls the pulse effect.
- **L7–13** The effect:
  - **L13** `[history.length]` is the **dependency array**: the effect runs only when this value changes, which means once per new spin.
  - **L9** Turns the pulse on.
  - **L10** After 500 ms, turns it off.
  - **L11** `return () => clearTimeout(t)` is a **cleanup function**. If the component re-runs or disappears before the timer fires, the timer is cancelled. Without cleanup you get leftover timers and bugs.
- **L15–16** `.filter(...)` keeps only grade-11 (or grade-12) items, and `.length` counts them.
- **L17** `new Set(history.map(h => h.id)).size`:
  - `.map` turns the list into just the ids.
  - A `Set` automatically removes duplicates.
  - `.size` is how many distinct concepts you've seen.
- **L22** `` className={`stat-card ${animate ? 'pulse' : ''}`} `` is a template string plus the ternary `? :` operator. It adds the `pulse` CSS class only while `animate` is true.
- **L23–36** Four cards, each showing a number and a label.

The counts aren't stored in state. They're **calculated from `history` every time the component draws**. That's a good habit: one source of truth, and nothing that can drift out of sync.

---

## 7. `SpinWheel.jsx`: the main logic

### Imports and memory (L1–15)
- **L1** Imports four hooks. `useRef` and `useCallback` are explained below.
- **L2** The confetti library.
- **L5** Takes in `segments` (the concepts) and `onSpinEnd` (the callback from App).
- **L6** `canvasRef = useRef(null)` will point to the actual `<canvas>` element so the code can draw on it. A **ref** is a box whose `.current` value persists between redraws, and **changing it does NOT trigger a redraw**.
- **L7** `rotation` (state) is the wheel's current angle in radians. Changing it redraws the wheel.
- **L8** `spinning` is true while the wheel is moving. It's used to block double-clicks, change the button text, and brighten the glow.
- **L9** `winner` is the concept it landed on.
- **L10** `showResult` controls whether the result card is visible.
- **L11** `animationRef` stores the animation frame id.
- **L12** `currentRotationRef` holds the latest angle in a ref. **Why both a ref and state?** State values inside a function are a snapshot from when that function was created. The ref always holds the live value. The next spin starts from it (L189), and the resize handler uses it (L174).
- **L14** `segCount` is how many slices there are.
- **L15** `segAngle = 2π / segCount`. A full circle is 2π radians (360°), so each slice gets an equal share.

### `drawWheel` (L17–147): drawing on the canvas
Wrapped in `useCallback` (L17 and L147). This keeps the same function between redraws unless its dependencies (`segments`, `segAngle`, `spinning`) change. That matters because the effects below list `drawWheel` as a dependency, and without `useCallback` they would re-run on every single render.

- **L18–19** `cx`, `cy` is the centre of the canvas.
- **L20** `radius` is the largest circle that fits, minus 20px of room for the glow rings.
- **L22** `clearRect` wipes the canvas. You must clear before each frame or old drawings pile up.

**Glow rings (L24–48)**
- `ctx.save()` / `ctx.restore()` (L25/35) work like a bookmark. They save the drawing settings (colour, shadow, line width) and put them back afterward, so settings from one shape don't leak into the next.
- `beginPath()` starts a new shape, and `arc(cx, cy, r, 0, 2π)` is a full circle.
- **L28–30 and L33** The ring is brighter and has more blur while `spinning`. This is why `spinning` is in the dependency list.
- `shadowColor` and `shadowBlur` create the neon glow. `stroke()` draws the outline.
- The second ring (L37–48) is the same idea: purple, slightly bigger, fainter.

**Slices (L51–121)**, looped with `forEach` for each concept `seg` at position `i`:
- **L52** `startAngle = rot + i * segAngle`. Adding `rot` (the current rotation) to every slice is **how the wheel spins**. Nothing actually rotates; every frame just redraws all the slices shifted by `rot`.
- **L53** `endAngle` is where the slice ends.
- **L57–60** Draws a pie wedge: move to the centre, draw the arc along the edge, then `closePath` back to the centre.
- **L62–69** A radial gradient (circular colour fade): dark at the centre, getting more of the slice's colour toward the edge. `hexToRgba` adds transparency. **L63** `seg.color || '#00f0ff'` falls back to cyan if a concept has no colour.
- **L72–74** A thin coloured border between slices.

**Slice text (L78–120)**
- **L79** `textAngle` is the middle of the slice.
- **L80** The text sits 65% of the way out from the centre.
- **L81–84** `translate` moves the drawing origin to that spot. `cos` gives the horizontal position and `sin` the vertical one. This is trigonometry turning an angle into x/y coordinates.
- **L85** `rotate(textAngle + π/2)` turns the text so it lines up with the slice.
- **L87** Smaller font on smaller screens.
- **L88–93** Font, white fill, centred alignment, and a glow in the slice's colour.
- **L96–108** **Word wrap.** Canvas can't wrap text by itself, so the code does it by hand:
  - Split the title into words.
  - Keep adding words to the current line.
  - Once a line would go past 10 characters, start a new line.
  - **L108** Push the last line, which is easy to forget.
- **L110–111** Works out the starting y position so the block of lines is vertically centred.
- **L114–117** Draws a dark outline first (`strokeText`), then white text on top (`fillText`), so the text stays readable on any colour.

**Centre hub (L124–146)**: a small dark circle with a cyan glowing outline and the word "SPIN".

### Effect: redraw when rotation changes (L149–161)
- **L150–151** Gets the canvas, and stops if it doesn't exist yet.
- **L153** `devicePixelRatio` is 2 on Retina screens.
- **L154** `getBoundingClientRect()` is the canvas's on-screen size, set by CSS.
- **L155–156** Makes the canvas's *internal* pixel grid bigger by that ratio. **L158** `ctx.scale(dpr, dpr)` lets the drawing code keep using normal CSS sizes anyway. Without this, the wheel looks blurry on Retina and phone screens.
- **L160** Draws the wheel at the current `rotation`.
- **L161** Runs again whenever `rotation` changes (about 60 times a second during a spin) or `drawWheel` changes.

### Effect: resize handler (L164–178)
Same setup steps, but triggered when the browser window is resized, so the wheel redraws at the new size. **L177** removes the listener when the component goes away (cleanup again).

### `spin()` (L180–234): the animation and choosing the winner
- **L181** `if (spinning) return;` is a guard so clicking during a spin does nothing.
- **L183–185** Resets the state: spinning on, old result hidden.
- **L187** The spin lasts 4–6 seconds. `Math.random()` gives a number from 0 to 1.
- **L188** It turns 8 to 14 full rotations. Because it's a random total angle, the landing spot is random.
- **L189** Starts from wherever the wheel last stopped.
- **L190** `performance.now()` is a precise timestamp in milliseconds.
- **L192** `easeOutQuart` is an **easing function**. It takes linear progress t (0→1) and turns it into fast-at-first, slow-at-the-end motion, like a real wheel losing speed to friction.
- **L194** `animate(now)` runs once per screen refresh:
  - **L196** `progress` goes from 0 to 1 and is capped at 1 with `Math.min`.
  - **L199** The current angle is the start angle plus the eased share of the total turn.
  - **L200–201** Saves the angle to the ref (live value) **and** to state (which triggers a redraw through the effect at L149).
  - **L203–204** If it's not finished, asks the browser for the next frame. `requestAnimationFrame` matches the screen's refresh rate and pauses in background tabs, which makes it far better than `setInterval` for animation.
- **L205–230** When the spin is done:
  - **L209** Reduces the angle to the range 0 to 2π. `% (2π)` takes the remainder, and the `+ 2π` then `%` again handles negative numbers.
  - **L210** On a canvas, angle 0 points **right**, angles increase clockwise, and **straight up is 3π/2**. The pointer is at the top, so this works out which angle *on the wheel itself* is under the pointer: (3π/2 − rotation), wrapped into range.
  - **L211** Divides by the slice size and rounds down to get the slice number.
  - **L212** Looks up the winning concept.
  - **L214** Saves the winner.
  - **L217–223** The confetti burst, using the winner's colour. `disableForReducedMotion` respects users who have turned off animations in their system settings.
  - **L225–229** After a 300 ms pause, shows the card, reads the concept aloud, and tells App (`onSpinEnd`) so Stats updates. **L228** checks that `onSpinEnd` exists before calling it.
- **L233** Starts the first frame.

### Text-to-speech (L236–293)
- **L236–263** `getBestVoice` picks the nicest-sounding English voice:
  - **L237** Asks the browser for its list of voices.
  - **L239–251** A ranked wishlist of good voice names.
  - **L252–255** Returns the first match that is English (`lang.startsWith('en')`).
  - **L257–260** If none match, looks for any voice with "premium", "enhanced" or "natural" in its name. `/.../i` is a case-insensitive regular expression.
  - **L262** Otherwise uses any English voice, or `null`.
  - It's wrapped in `useCallback` with `[]` dependencies, so it's created once.
- **L265–285** `speakConcept`:
  - **L266** `cancel()` stops anything still being spoken, so voices don't overlap if you spin fast.
  - **L269–274** Reads the title: slightly slower (`rate 0.85`) and higher pitched for emphasis.
  - **L277–281** Reads the description at a more natural pace.
  - **L283–284** Both get queued, so they play one after the other.
- **L288–293** Some browsers (Chrome especially) load their voices *after* the page loads. Calling `getVoices()` early and listening for `onvoiceschanged` makes sure the list is ready. Cleanup removes the listener.

### The JSX (L295–355)
- **L298–313** The pointer arrow is an SVG placed above the wheel with CSS. It never moves; only the wheel does.
- **L315–319** The `<canvas>`:
  - `ref={canvasRef}` connects it to the ref from L6.
  - Clicking the wheel itself also spins it.
  - It gets the `spinning` class while moving.
- **L321–330** The button. `disabled={spinning}` actually blocks clicks during a spin, and the text changes to "SPINNING...".
- **L333** The result card only shows when there's a winner **and** `showResult` is true.
- **L334** `style={{ '--accent': winner.color }}` sets a **CSS variable**, so `SpinWheel.css` can use `var(--accent)` to colour the card to match the slice. This is a neat way to pass a value from JavaScript into CSS.
- **L336–339** Shows the grade badge, title, formula and description.
- **L340–350** The "Listen Again" button reads the concept aloud again. `() => speakConcept(winner)` wraps the call in an arrow function so it runs on click, not immediately when the card is drawn.

### `hexToRgba` (L358–363)
Turns `"#00f0ff"` plus 0.3 into `"rgba(0, 240, 255, 0.3)"`:
- `slice(1,3)` takes the two red characters, `"00"`, and `parseInt(..., 16)` reads them as base 16 → 0.
- Green and blue work the same way. The result is a colour with transparency.
- It's defined outside the component because it doesn't need any state or props, so it isn't recreated on every render.

---

## 8. The CSS files (short version)
- `index.css` sets global styles: the dark background, fonts, and colour variables.
- Each `Component.css` styles only that component. Examples:
  - `.pulse` in `Stats.css` is the pop animation.
  - `.wheel-pointer` in `SpinWheel.css` positions the arrow over the wheel.
  - `.result-card` uses `var(--accent)`.
  - `.spin-button.disabled` styles the button during a spin.

---

## The main ideas this project teaches
1. **Components and props:** small pieces, with data passed down.
2. **State causes redraws:** `useState` for values the screen depends on, `useRef` for values that shouldn't trigger a redraw.
3. **Effects with cleanup:** `useEffect` for timers, listeners, and drawing on the canvas.
4. **Lifting state up:** `history` lives in App so both SpinWheel and Stats can use it.
5. **Canvas animation:** redraw everything each frame with `requestAnimationFrame` and an easing curve.
6. **Calculated values:** Stats works out its numbers from `history` instead of storing them separately.

## Ideas for practice
- Remove the unused `howler` package.
- Cancel `animationRef.current` with `cancelAnimationFrame` if the component unmounts mid-spin. Right now `animationRef` is saved but never used.
- The first effect (L149) resizes the canvas on every frame. It would be more efficient to do that only on mount and on resize.
