// -----------------------------------------------------------------------------
// branchImages — iris SVG used as the permanent background for the circular
// branches ring. (Hover-swapping was removed; all three branches share the
// same iris.)
// -----------------------------------------------------------------------------

const svgDataUri = (svg) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(svg.trim());

// Stylized iris: cyan radial fibers, true black pupil, white catchlight, and
// a soft outer rim glow.
const IRIS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <radialGradient id="iris-fill" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#021016"/>
      <stop offset="18%" stop-color="#062430"/>
      <stop offset="42%" stop-color="#1e7286"/>
      <stop offset="72%" stop-color="#6fd7e8"/>
      <stop offset="92%" stop-color="#aee6ee"/>
      <stop offset="100%" stop-color="#062430"/>
    </radialGradient>
    <radialGradient id="iris-rim" cx="50%" cy="50%" r="50%">
      <stop offset="92%" stop-color="rgba(255,255,255,0)"/>
      <stop offset="96%" stop-color="rgba(220,245,250,.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="#020a10"/>
  <circle cx="300" cy="300" r="282" fill="url(#iris-fill)"/>
  <circle cx="300" cy="300" r="282" fill="url(#iris-rim)"/>

  <g stroke="#0a3a4a" stroke-width="1.4" opacity=".75">
    ${Array.from({ length: 180 })
      .map((_, i) => {
        const a = (i / 180) * Math.PI * 2;
        const x1 = 300 + Math.cos(a) * 86;
        const y1 = 300 + Math.sin(a) * 86;
        const x2 = 300 + Math.cos(a) * 268;
        const y2 = 300 + Math.sin(a) * 268;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      })
      .join("")}
  </g>

  <circle cx="300" cy="300" r="86" fill="#000"/>
  <circle cx="300" cy="300" r="86" fill="none" stroke="#021016" stroke-width="2"/>

  <circle cx="266" cy="266" r="14" fill="#ffffff" opacity=".85"/>
  <circle cx="252" cy="284" r="5"  fill="#ffffff" opacity=".55"/>
</svg>`;

const irisDataUri = svgDataUri(IRIS_SVG);

const BRANCH_IMAGES = {
  research: irisDataUri,
  engineering: irisDataUri,
  advocacy: irisDataUri,
};

export default BRANCH_IMAGES;
