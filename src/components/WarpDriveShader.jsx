// -----------------------------------------------------------------------------
// WarpDriveShader — fullscreen tunnel shader, centered on its container.
//
// Notes:
//   • iResolution + iMouse are kept in framebuffer pixels so HiDPI displays
//     (DPR > 1) don't push the focal point off-center.
//   • Sizes to its parent's bounding box, not the window.
// -----------------------------------------------------------------------------

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2  iResolution;
  uniform float iTime;
  uniform vec2  iMouse;

  void main() {
    vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec2 mouse = (iMouse           - 0.5 * iResolution.xy) / iResolution.y;

    float t = iTime * 0.5;
    uv -= mouse;

    float r = length(uv) * 0.8;
    float a = atan(uv.y, uv.x);

    // Three offset taps drive the chromatic split, but instead of mapping
    // straight to R/G/B we tint each tap with a brand color so the tunnel
    // reads as cyan / magenta / violet instead of TV-RGB.
    float offset = 0.01;
    float p1 = pow(fract(0.5 / length(uv + vec2(offset, 0.0)) + t * 2.0), 15.0);
    float p2 = pow(fract(0.5 / length(uv)                    + t * 2.0), 15.0);
    float p3 = pow(fract(0.5 / length(uv - vec2(offset, 0.0)) + t * 2.0), 15.0);

    vec3 cCyan    = vec3(0.44, 0.84, 0.91); // #6fd7e8
    vec3 cMagenta = vec3(0.91, 0.47, 0.72); // #e879b8
    vec3 cBlue    = vec3(0.36, 0.49, 1.00); // #5b7dff

    vec3 finalColor = cCyan * p1 + cMagenta * p2 + cBlue * p3;

    float fade = smoothstep(0.0, 0.1, r);
    finalColor *= fade;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function WarpDriveShader({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      // gl_FragCoord is in framebuffer pixels — iResolution + iMouse must
      // match, otherwise HiDPI screens throw the tunnel's focal point off
      // toward a corner.
      const dpr = renderer.getPixelRatio();
      const fw = w * dpr;
      const fh = h * dpr;
      uniforms.iResolution.value.set(fw, fh);
      uniforms.iMouse.value.set(fw / 2, fh / 2);
    };

    window.addEventListener("resize", onResize);
    onResize();

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={"warp-shader " + className}
      aria-hidden="true"
    />
  );
}
