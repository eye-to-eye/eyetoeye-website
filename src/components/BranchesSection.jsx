// -----------------------------------------------------------------------------
// BranchesSection — circular reveal heading variant. Three branches arranged
// around an iris ring; the body copy is repeated as a numbered list beside it.
// -----------------------------------------------------------------------------

import CircularRevealHeading from "./CircularRevealHeading.jsx";
import BRANCH_IMAGES from "./branchImages.js";

const BRANCHES = [
  {
    key: "research",
    text: "RESEARCH",
    title: "Biological & Optical Research",
    body:
      "Studying the underlying science of pediatric eye conditions, from refractive error and amblyopia to retinal development, and translating findings into screening protocols clinicians can actually use.",
  },
  {
    key: "engineering",
    text: "ENGINEERING",
    title: "Computational Engineering & AI",
    body:
      "Building open-source screening tools, on-device detection models, and clinician dashboards, engineered to run on the modest hardware most underserved clinics actually have access to.",
  },
  {
    key: "advocacy",
    text: "ADVOCACY",
    title: "Global Health Advocacy",
    body:
      "Fundraising, policy outreach, and awareness work that closes the access gap, partnering with clinics, NGOs, and ministries of health to put screening within reach of every child, everywhere.",
  },
];

export default function BranchesSection() {
  const items = BRANCHES.map((b) => ({
    text: b.text,
    image: BRANCH_IMAGES[b.key],
  }));

  return (
    <section>
      <div className="container branches-circular">
        <div className="branches-circular-grid">
          <div className="branches-circular-copy">
            <div className="label">Three branches, one mission</div>
            <h2>Science. Software.</h2>
            <p className="branches-deck">
              Each branch publishes openly, runs on modest hardware, and answers
              to the children in front of us. Hover any label to see what it
              looks like in the field.
            </p>
            <ol className="branches-list">
              {BRANCHES.map((b, i) => (
                <li key={b.key} className="branches-list-item">
                  <span className="bli-num">0{i + 1}</span>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="branches-circular-ring">
            <CircularRevealHeading
              items={items}
              size="lg"
              defaultImage={BRANCH_IMAGES.research}
              centerText={
                <div className="cr-center-text">
                  <span className="cr-center-mark" />
                  <span className="cr-center-label">EYE TO EYE</span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
