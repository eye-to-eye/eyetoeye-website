import { inject } from "@vercel/analytics";
import { mountIris } from "./iris.js";
import "./styles.css";

inject();

mountIris(document.getElementById("iris"));

// Sticky nav: translucent dark backdrop once the page scrolls.
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("nav--scrolled", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Scroll-triggered reveals.
const revealables = document.querySelectorAll(".reveal");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealables.forEach((el) => el.classList.add("in-view"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      }
    },
    // Near-zero threshold: elements at the very bottom of the page can only
    // ever poke a few px past the rootMargin line, and must still reveal.
    { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
  );
  revealables.forEach((el) => io.observe(el));
}

document.getElementById("year").textContent = new Date().getFullYear();
