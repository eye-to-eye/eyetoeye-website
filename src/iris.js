// A living iris, drawn in 2D canvas: radial stroma fibers colored across the
// teal → blue → purple spectrum (one hue per branch of the org), a pupil that
// breathes and constricts as the pointer approaches, and a gaze that follows
// the cursor. No WebGL, no dependencies.

const TAU = Math.PI * 2;

// Accent anchors (must stay in sync with the CSS custom properties).
const STOPS = [
  { t: 0.0, c: [62, 230, 197] }, // teal
  { t: 0.5, c: [90, 167, 255] }, // blue
  { t: 1.0, c: [169, 139, 250] }, // purple
];

function mix(a, b, t) {
  return a + (b - a) * t;
}

function spectrum(t) {
  // t in [0,1) → rgb along teal→blue→purple→(wrap back toward teal)
  const wrapped = t < 0.85 ? t / 0.85 : 0; // fold the tail back to teal
  let lo = STOPS[0];
  let hi = STOPS[STOPS.length - 1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (wrapped >= STOPS[i].t && wrapped <= STOPS[i + 1].t) {
      lo = STOPS[i];
      hi = STOPS[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t || 1;
  const k = (wrapped - lo.t) / span;
  return [
    Math.round(mix(lo.c[0], hi.c[0], k)),
    Math.round(mix(lo.c[1], hi.c[1], k)),
    Math.round(mix(lo.c[2], hi.c[2], k)),
  ];
}

export function mountIris(canvas) {
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0;
  let h = 0;
  let dpr = 1;

  // Pointer state, in canvas CSS pixels. Eased each frame for a soft gaze.
  const pointer = { x: 0.5, y: 0.42, has: false };
  const gaze = { x: 0, y: 0 };
  let proximity = 0; // 0 far → 1 pointer on the eye

  // Fibers are generated once; geometry is deterministic per session.
  const FIBER_COUNT = 300;
  const fibers = [];
  for (let i = 0; i < FIBER_COUNT; i++) {
    const angle = (i / FIBER_COUNT) * TAU + (Math.random() - 0.5) * 0.02;
    fibers.push({
      angle,
      hueT: (angle / TAU + Math.random() * 0.04) % 1,
      inner: 0.96 + Math.random() * 0.1, // start, × pupil radius
      outer: 0.78 + Math.random() * 0.24, // end, × iris radius
      wobble: 0.5 + Math.random() * 1.4, // lateral wave amplitude
      seed: Math.random() * TAU,
      speed: 0.2 + Math.random() * 0.5,
      width: 0.6 + Math.random() * 1.3,
      alpha: 0.25 + Math.random() * 0.5,
    });
  }

  // A sparse ring of brighter "crypt" flecks between pupil and limbus.
  const flecks = [];
  for (let i = 0; i < 70; i++) {
    const angle = Math.random() * TAU;
    flecks.push({
      angle,
      dist: 0.45 + Math.random() * 0.45,
      r: 0.6 + Math.random() * 1.6,
      hueT: (angle / TAU) % 1,
      seed: Math.random() * TAU,
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(time) {
    const t = time * 0.001;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.5;
    const R = Math.min(w, h) * 0.4; // iris radius

    // Ease the gaze toward the pointer; the whole iris shifts slightly.
    const targetX = pointer.has ? (pointer.x - 0.5) * 2 : Math.sin(t * 0.13) * 0.25;
    const targetY = pointer.has ? (pointer.y - 0.5) * 2 : Math.cos(t * 0.09) * 0.2;
    gaze.x += (Math.max(-1, Math.min(1, targetX)) - gaze.x) * 0.04;
    gaze.y += (Math.max(-1, Math.min(1, targetY)) - gaze.y) * 0.04;
    const lookX = cx + gaze.x * R * 0.1;
    const lookY = cy + gaze.y * R * 0.08;

    // Pupil: slow breathing, plus constriction as the pointer approaches —
    // the way a real pupil reacts to light.
    const dx = pointer.x * w - cx;
    const dy = pointer.y * h - cy;
    const distNorm = Math.min(1, Math.hypot(dx, dy) / (R * 2.2));
    const targetProx = pointer.has ? 1 - distNorm : 0;
    proximity += (targetProx - proximity) * 0.05;
    const breath = Math.sin(t * 0.55) * 0.5 + Math.sin(t * 0.21) * 0.5;
    const pupilR = R * (0.34 + breath * 0.022 - proximity * 0.07);

    // Ambient halo behind the iris. Kept tight (fades to transparent just
    // beyond the iris) so it never reaches the square canvas edges, which
    // would otherwise leave a faint tinted border against the page.
    const halo = ctx.createRadialGradient(lookX, lookY, R * 0.2, lookX, lookY, R * 1.2);
    halo.addColorStop(0, "rgba(54, 86, 140, 0.16)");
    halo.addColorStop(0.5, "rgba(34, 52, 92, 0.10)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    const drift = t * 0.018; // imperceptible slow rotation of the whole stroma

    // --- Stroma fibers ---------------------------------------------------
    ctx.globalCompositeOperation = "lighter";
    for (const f of fibers) {
      const a = f.angle + drift;
      const sway = Math.sin(t * f.speed + f.seed) * f.wobble;
      const r0 = pupilR * f.inner;
      const r1 = R * f.outer;
      const cos = Math.cos(a);
      const sin = Math.sin(a);

      const x0 = lookX + cos * r0;
      const y0 = lookY + sin * r0;
      const x1 = lookX + cos * r1;
      const y1 = lookY + sin * r1;
      // Control point pushed sideways → gently curved fiber.
      const mx = lookX + cos * ((r0 + r1) / 2) - sin * sway;
      const my = lookY + sin * ((r0 + r1) / 2) + cos * sway;

      const [r, g, b] = spectrum(f.hueT);
      const shimmer = 0.75 + 0.25 * Math.sin(t * 0.8 + f.seed * 3);
      ctx.strokeStyle = `rgba(${r},${g},${b},${(f.alpha * shimmer * 0.62).toFixed(3)})`;
      ctx.lineWidth = f.width;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(mx, my, x1, y1);
      ctx.stroke();
    }

    // --- Crypt flecks ----------------------------------------------------
    for (const fl of flecks) {
      const a = fl.angle + drift;
      const rr = pupilR + (R - pupilR) * fl.dist;
      const x = lookX + Math.cos(a) * rr;
      const y = lookY + Math.sin(a) * rr;
      const [r, g, b] = spectrum(fl.hueT);
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.7 + fl.seed));
      ctx.fillStyle = `rgba(${r},${g},${b},${(tw * 0.5).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, fl.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // --- Limbal ring (dark outer edge of a real iris) ----------------------
    ctx.strokeStyle = "rgba(8, 12, 22, 0.9)";
    ctx.lineWidth = R * 0.07;
    ctx.beginPath();
    ctx.arc(lookX, lookY, R * 0.985, 0, TAU);
    ctx.stroke();

    // Soft colored rim just inside the limbus.
    const rim = ctx.createRadialGradient(lookX, lookY, R * 0.82, lookX, lookY, R);
    rim.addColorStop(0, "rgba(0,0,0,0)");
    rim.addColorStop(0.85, "rgba(90, 167, 255, 0.10)");
    rim.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(lookX, lookY, R, 0, TAU);
    ctx.fill();

    // --- Pupil -------------------------------------------------------------
    const pupil = ctx.createRadialGradient(lookX, lookY, pupilR * 0.5, lookX, lookY, pupilR * 1.18);
    pupil.addColorStop(0, "rgba(3, 5, 10, 1)");
    pupil.addColorStop(0.82, "rgba(3, 5, 10, 0.97)");
    pupil.addColorStop(1, "rgba(3, 5, 10, 0)");
    ctx.fillStyle = pupil;
    ctx.beginPath();
    ctx.arc(lookX, lookY, pupilR * 1.18, 0, TAU);
    ctx.fill();

    // --- Specular highlight: the catchlight that makes an eye look alive ---
    const hx = lookX - R * 0.3 + gaze.x * R * 0.05;
    const hy = lookY - R * 0.34 + gaze.y * R * 0.05;
    const gleam = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.16);
    gleam.addColorStop(0, "rgba(235, 244, 255, 0.85)");
    gleam.addColorStop(0.35, "rgba(235, 244, 255, 0.18)");
    gleam.addColorStop(1, "rgba(235, 244, 255, 0)");
    ctx.fillStyle = gleam;
    ctx.beginPath();
    ctx.arc(hx, hy, R * 0.16, 0, TAU);
    ctx.fill();

    const hx2 = lookX + R * 0.34;
    const hy2 = lookY + R * 0.3;
    const gleam2 = ctx.createRadialGradient(hx2, hy2, 0, hx2, hy2, R * 0.07);
    gleam2.addColorStop(0, "rgba(235, 244, 255, 0.3)");
    gleam2.addColorStop(1, "rgba(235, 244, 255, 0)");
    ctx.fillStyle = gleam2;
    ctx.beginPath();
    ctx.arc(hx2, hy2, R * 0.07, 0, TAU);
    ctx.fill();

    // --- Edge feather ------------------------------------------------------
    // Force everything to fully transparent before the canvas border, so the
    // artwork dissolves into the page background with no visible boundary.
    // (The iris stays fully opaque; only the area beyond it is feathered.)
    const edge = Math.min(w, h) * 0.5;
    ctx.globalCompositeOperation = "destination-in";
    const feather = ctx.createRadialGradient(cx, cy, edge * 0.9, cx, cy, edge);
    feather.addColorStop(0, "rgba(0,0,0,1)");
    feather.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = feather;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- Lifecycle ----------------------------------------------------------
  let raf = 0;
  let running = false;

  function loop(time) {
    draw(time);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(0);
  });

  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width;
    pointer.y = (e.clientY - rect.top) / rect.height;
    pointer.has = true;
  });

  // Don't burn frames when the hero is off-screen or the tab is hidden.
  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.02 }
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  if (reduceMotion) {
    draw(0); // single static frame
  } else {
    start();
  }
}
