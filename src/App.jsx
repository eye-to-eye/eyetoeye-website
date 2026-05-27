// -----------------------------------------------------------------------------
// App — top-level composition. Renders the dotted-surface background, then the
// page sections in order.
// -----------------------------------------------------------------------------

import DottedSurface from "./components/DottedSurface.jsx";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import ProblemSection from "./components/ProblemSection.jsx";
import BranchesSection from "./components/BranchesSection.jsx";
import OpenSourceSection from "./components/OpenSourceSection.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

export default function App() {
  return (
    <>
      <DottedSurface />
      <Nav />
      <Hero />
      <ProblemSection />
      <BranchesSection />
      <OpenSourceSection />
      <SiteFooter />
    </>
  );
}
