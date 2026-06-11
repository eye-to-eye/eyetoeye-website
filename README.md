# Eye to Eye

Marketing site for the Eye to Eye pediatric vision nonprofit — eyetoeye.health.

Built with **Vite + vanilla JS**. No framework: the page is static HTML and CSS
(warm paper-white sections bookended by deep navy hero and footer; Fraunces for
headlines, Public Sans for body). The hero's living iris is hand-drawn on a 2D
`<canvas>` — ~300 radial stroma fibers colored across the org's teal → blue →
purple spectrum, a pupil that breathes and constricts as the pointer
approaches, and a gaze that follows the cursor. Total shipped JS is under 8 kB.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built bundle locally
```

## Project layout

```
index.html        All page markup (single scrolling page)
public/
  logo.jpg        Static asset, served at /logo.jpg
src/
  main.js         Entry: analytics, sticky nav, scroll reveals
  iris.js         The hero iris canvas animation
  styles.css      All styles (design tokens at the top)
```

## Notes for developers

- The accent colors live in two places that must stay in sync: the CSS custom
  properties (`--teal`, `--blue`, `--purple` in `styles.css`) and the `STOPS`
  array in `iris.js`.
- The iris respects `prefers-reduced-motion` (renders a single static frame)
  and pauses via IntersectionObserver when scrolled off-screen.
- Analytics is `@vercel/analytics`; the injected script 404s outside Vercel
  deployments, which is harmless.

## License

Source code: MIT. See `LICENSE`.
