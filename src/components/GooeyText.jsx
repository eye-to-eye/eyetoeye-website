// -----------------------------------------------------------------------------
// GooeyText — two stacked spans are blurred and faded in opposite directions
// over `morphTime`, then held for `cooldownTime` before advancing to the next
// pair of texts. An SVG <feColorMatrix> threshold filter on the parent turns
// the soft blurs into the gooey ink-bleed look.
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useRef } from "react";

export default function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className = "",
  textClassName = "",
}) {
  const t1Ref = useRef(null);
  const t2Ref = useRef(null);
  // Unique filter id so multiple instances on a page don't collide.
  const filterId = useMemo(
    () => "gooey-" + Math.random().toString(36).slice(2, 9),
    []
  );

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let raf = 0;

    const setMorph = (fraction) => {
      const t1 = t1Ref.current;
      const t2 = t2Ref.current;
      if (!t1 || !t2) return;
      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inverse = 1 - fraction;
      t1.style.filter = `blur(${Math.min(8 / inverse - 8, 100)}px)`;
      t1.style.opacity = `${Math.pow(inverse, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      const t1 = t1Ref.current;
      const t2 = t2Ref.current;
      if (!t1 || !t2) return;
      t2.style.filter = "";
      t2.style.opacity = "100%";
      t1.style.filter = "";
      t1.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const newTime = new Date();
      const wasInCooldown = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;
      if (cooldown <= 0) {
        if (wasInCooldown) {
          textIndex = (textIndex + 1) % texts.length;
          if (t1Ref.current && t2Ref.current) {
            t1Ref.current.textContent = texts[textIndex % texts.length];
            t2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    if (t1Ref.current && t2Ref.current) {
      // Seed initial text so we don't flash empty content.
      t1Ref.current.textContent = texts[textIndex % texts.length];
      t2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    }
    morph += cooldownTime;
    animate();

    return () => cancelAnimationFrame(raf);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={"gooey-text " + className}>
      <svg className="gooey-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={`1 0 0 0 0
                       0 1 0 0 0
                       0 0 1 0 0
                       0 0 0 255 -140`}
            />
          </filter>
        </defs>
      </svg>
      <div className="gooey-stage" style={{ filter: `url(#${filterId})` }}>
        <span ref={t1Ref} className={"gooey-text-layer " + textClassName} />
        <span ref={t2Ref} className={"gooey-text-layer " + textClassName} />
      </div>
    </div>
  );
}
