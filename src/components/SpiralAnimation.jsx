// -----------------------------------------------------------------------------
// SpiralAnimation — a star-spiral particle system driven by a gsap timeline.
//
// Sizes its canvas to the parent and centers the spiral's focal point on the
// container midpoint so it aligns with the WarpDriveShader's center.
// -----------------------------------------------------------------------------

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SpiralAnimation() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ---- sizing ---------------------------------------------------------
    let cw = 0;
    let ch = 0;
    let size = 0;
    let dpr = 1;
    const resize = () => {
      const r = wrapper.getBoundingClientRect();
      cw = Math.max(200, Math.floor(r.width));
      ch = Math.max(200, Math.floor(r.height));
      size = Math.max(cw, ch);
      dpr = window.devicePixelRatio || 1;
      // Square buffer so the spiral stays circular even on wide screens —
      // CSS stretches it to viewport, but the wrapper is already constrained
      // to a centered square via styles.css.
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + "px";
      canvas.style.height = size + "px";
      canvas.style.left = (cw - size) / 2 + "px";
      canvas.style.top = (ch - size) / 2 + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // ---- math helpers ---------------------------------------------------
    const ease = (p, g) =>
      p < 0.5 ? 0.5 * Math.pow(2 * p, g) : 1 - 0.5 * Math.pow(2 * (1 - p), g);

    const easeOutElastic = (x) => {
      const c4 = (2 * Math.PI) / 4.5;
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1;
    };

    const map = (v, a1, b1, a2, b2) => a2 + (b2 - a2) * ((v - a1) / (b1 - a1));
    const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));
    const lerp = (a, b, t) => a * (1 - t) + b * t;

    // ---- controller state ----------------------------------------------
    const STATE = { time: 0 };
    const CHANGE_EVENT_TIME = 0.32;
    const CAMERA_Z = -400;
    const CAMERA_TRAVEL_DISTANCE = 3400;
    const START_DOT_Y_OFFSET = 28;
    const VIEW_ZOOM = 100;
    const NUMBER_OF_STARS = 5000;
    const TRAIL_LENGTH = 80;

    const spiralPath = (p) => {
      p = clamp(1.2 * p, 0, 1);
      p = ease(p, 1.8);
      const turns = 6;
      const theta = 2 * Math.PI * turns * Math.sqrt(p);
      const r = 170 * Math.sqrt(p);
      return {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta) + START_DOT_Y_OFFSET,
      };
    };

    const rotate = (v1, v2, p, orientation) => {
      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      const dx = v1.x - midX;
      const dy = v1.y - midY;
      const angle = Math.atan2(dy, dx);
      const o = orientation ? -1 : 1;
      const r = Math.sqrt(dx * dx + dy * dy);
      const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p);
      return {
        x:
          midX +
          r * (1 + bounce) * Math.cos(angle + o * Math.PI * easeOutElastic(p)),
        y:
          midY +
          r * (1 + bounce) * Math.sin(angle + o * Math.PI * easeOutElastic(p)),
      };
    };

    const showProjectedDot = (px, py, pz, sizeFactor) => {
      const t2 = clamp(map(STATE.time, CHANGE_EVENT_TIME, 1, 0, 1), 0, 1);
      const newCameraZ =
        CAMERA_Z + ease(Math.pow(t2, 1.2), 1.8) * CAMERA_TRAVEL_DISTANCE;
      if (pz > newCameraZ) {
        const depth = pz - newCameraZ;
        const x = (VIEW_ZOOM * px) / depth;
        const y = (VIEW_ZOOM * py) / depth;
        const sw = (400 * sizeFactor) / depth;
        ctx.lineWidth = sw;
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // ---- stars (seeded so layout is deterministic) ----------------------
    const makeSeededRandom = () => {
      let seed = 1234;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    };
    const seededRandom = makeSeededRandom();
    const stars = [];
    for (let i = 0; i < NUMBER_OF_STARS; i++) {
      const angle = seededRandom() * Math.PI * 2;
      const distance = 30 * seededRandom() + 15;
      const rotationDirection = seededRandom() > 0.5 ? 1 : -1;
      const expansionRate = 1.2 + seededRandom() * 0.8;
      const finalScale = 0.7 + seededRandom() * 0.6;
      const dx = distance * Math.cos(angle);
      const dy = distance * Math.sin(angle);
      const spiralLocation = (1 - Math.pow(1 - seededRandom(), 3.0)) / 1.3;
      let z =
        0.5 * CAMERA_Z +
        seededRandom() * (CAMERA_TRAVEL_DISTANCE + CAMERA_Z - 0.5 * CAMERA_Z);
      z = lerp(z, CAMERA_TRAVEL_DISTANCE / 2, 0.3 * spiralLocation);
      const strokeWeightFactor = Math.pow(seededRandom(), 2.0);
      stars.push({
        dx,
        dy,
        spiralLocation,
        z,
        angle,
        distance,
        rotationDirection,
        expansionRate,
        finalScale,
        strokeWeightFactor,
      });
    }

    const renderStar = (s, p) => {
      const sp = spiralPath(s.spiralLocation);
      const q = p - s.spiralLocation;
      if (q <= 0) return;

      const dp = clamp(4 * q, 0, 1);
      const linearE = dp;
      const elasticE = easeOutElastic(dp);
      const powerE = Math.pow(dp, 2);
      let easing;
      if (dp < 0.3) easing = lerp(linearE, powerE, dp / 0.3);
      else if (dp < 0.7) easing = lerp(powerE, elasticE, (dp - 0.3) / 0.4);
      else easing = elasticE;

      let sx;
      let sy;
      if (dp < 0.3) {
        sx = lerp(sp.x, sp.x + s.dx * 0.3, easing / 0.3);
        sy = lerp(sp.y, sp.y + s.dy * 0.3, easing / 0.3);
      } else if (dp < 0.7) {
        const mid = (dp - 0.3) / 0.4;
        const curve = Math.sin(mid * Math.PI) * s.rotationDirection * 1.5;
        const bx = sp.x + s.dx * 0.3;
        const by = sp.y + s.dy * 0.3;
        const tx = sp.x + s.dx * 0.7;
        const ty = sp.y + s.dy * 0.7;
        const perpX = -s.dy * 0.4 * curve;
        const perpY = s.dx * 0.4 * curve;
        sx = lerp(bx, tx, mid) + perpX * mid;
        sy = lerp(by, ty, mid) + perpY * mid;
      } else {
        const fin = (dp - 0.7) / 0.3;
        const bx = sp.x + s.dx * 0.7;
        const by = sp.y + s.dy * 0.7;
        const targetDist = s.distance * s.expansionRate * 1.5;
        const spiralAngle = s.angle + 1.2 * s.rotationDirection * fin * Math.PI;
        const tx = sp.x + targetDist * Math.cos(spiralAngle);
        const ty = sp.y + targetDist * Math.sin(spiralAngle);
        sx = lerp(bx, tx, fin);
        sy = lerp(by, ty, fin);
      }

      const vx = ((s.z - CAMERA_Z) * sx) / VIEW_ZOOM;
      const vy = ((s.z - CAMERA_Z) * sy) / VIEW_ZOOM;

      let sizeMul = 1.0;
      if (dp < 0.6) sizeMul = 1.0 + dp * 0.2;
      else
        sizeMul =
          1.2 * (1.0 - (dp - 0.6) / 0.4) + s.finalScale * ((dp - 0.6) / 0.4);
      const dotSize = 8.5 * s.strokeWeightFactor * sizeMul;
      showProjectedDot(vx, vy, s.z, dotSize);
    };

    const drawTrail = (t1) => {
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const f = map(i, 0, TRAIL_LENGTH, 1.1, 0.1);
        const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f;
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = sw;
        const pt = spiralPath(t1 - 0.00015 * i);
        const rotated = rotate(
          pt,
          { x: pt.x + 5, y: pt.y + 5 },
          Math.sin(STATE.time * Math.PI * 2) * 0.5 + 0.5,
          i % 2 === 0
        );
        ctx.beginPath();
        ctx.arc(rotated.x, rotated.y, sw / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStartDot = () => {
      if (STATE.time > CHANGE_EVENT_TIME) {
        const dy = (CAMERA_Z * START_DOT_Y_OFFSET) / VIEW_ZOOM;
        showProjectedDot(0, dy, CAMERA_TRAVEL_DISTANCE, 2.5);
      }
    };

    const render = () => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, size, size);
      ctx.save();
      // Translate so the spiral's start point (which has a vertical
      // START_DOT_Y_OFFSET) lands exactly at the hero's geometric center —
      // matching the warp tunnel's centered focal point.
      ctx.translate(size / 2, size / 2 - START_DOT_Y_OFFSET);

      const t1 = clamp(
        map(STATE.time, 0, CHANGE_EVENT_TIME + 0.25, 0, 1),
        0,
        1
      );
      const t2 = clamp(map(STATE.time, CHANGE_EVENT_TIME, 1, 0, 1), 0, 1);
      ctx.rotate(-Math.PI * ease(t2, 2.7));

      drawTrail(t1);
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < stars.length; i++) renderStar(stars[i], t1);
      drawStartDot();
      ctx.restore();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      render();
    });
    ro.observe(wrapper);

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(STATE, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: "none",
      onUpdate: render,
    });

    return () => {
      ro.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="spiral-wrapper" aria-hidden="true">
      <canvas ref={canvasRef} className="spiral-canvas" />
    </div>
  );
}
