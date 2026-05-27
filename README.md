# Eye to Eye

Marketing site for the Eye to Eye pediatric vision nonprofit.

Built with **Vite + React 18**. Heavy graphics use `three.js` (warp tunnel shader, dotted surface) and `gsap` (spiral animation timeline).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built bundle locally
```

## Project layout

```
index.html              Vite entry — loads /src/main.jsx
public/
  logo.jpg              Static asset, served at /logo.jpg
src/
  main.jsx              ReactDOM.createRoot mount
  App.jsx               Top-level composition (background + sections)
  styles.css            All global styles
  components/
    Nav.jsx
    Hero.jsx                ─┐
    WarpDriveShader.jsx      │  Hero background layers
    SpiralAnimation.jsx     ─┘
    GooeyText.jsx           Morphing headline
    DottedSurface.jsx       Page-wide dotted backdrop
    ProblemSection.jsx
    BranchesSection.jsx     ─┐
    CircularRevealHeading.jsx│  Branches ring
    branchImages.js         ─┘  (iris SVG data URIs)
    OpenSourceSection.jsx
    SiteFooter.jsx
```

## Notes for developers

- All three.js / gsap usage is wrapped in `useEffect` and cleans itself up on unmount; safe under React strict mode.
- `WarpDriveShader` and `SpiralAnimation` both center on the hero's geometric midpoint. If you change the hero layout, double-check that the warp tunnel's focal point and the spiral's converging point still line up — they're computed against `container.clientWidth/Height` and the device pixel ratio.
- The site is dark-only; the original `DottedSurface` hook into `next-themes` was removed.

## License

Source code: MIT. See `LICENSE`.
