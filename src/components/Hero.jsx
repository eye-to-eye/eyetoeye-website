// -----------------------------------------------------------------------------
// Hero — full-bleed SpiralAnimation + WarpDriveShader background; GooeyText
// headline morphing between "See every child" and "eye to eye." on top, plus
// tagline + CTAs.
// -----------------------------------------------------------------------------

import WarpDriveShader from "./WarpDriveShader.jsx";
import SpiralAnimation from "./SpiralAnimation.jsx";
import GooeyText from "./GooeyText.jsx";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <WarpDriveShader />
      <SpiralAnimation />
      <div className="hero-inner">
        <h1 className="morph-title" aria-label="See every child eye to eye">
          <GooeyText
            texts={["See every child", "eye to eye."]}
            morphTime={0.7}
            cooldownTime={3.0}
          />
        </h1>
        <p className="tagline">
          Advancing pediatric eye and vision health through AI-driven early
          detection and access for underserved communities.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="mailto:eyetoeyehealth@gmail.com">
            Get Involved <span className="arr">→</span>
          </a>
          <a className="btn btn-ghost" href="https://github.com/eye-to-eye">
            Explore the code
          </a>
        </div>
      </div>
      <div className="scroll-hint">
        <span>SCROLL</span>
        <span className="line" />
      </div>
    </header>
  );
}
