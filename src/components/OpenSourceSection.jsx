function Terminal() {
  return (
    <div className="terminal" aria-hidden="true">
      <div className="bar">
        <span />
        <span />
        <span />
      </div>
      <pre>
        <span className="c3"># clone, screen, deploy.{"\n"}</span>
        <span className="c2">$</span> git clone{" "}
        <span className="c1">github.com/eye-to-eye/screen</span>
        {"\n"}
        <span className="c3">Cloning into 'screen'...{"\n"}</span>
        <span className="c2">$</span> cd screen && pip install -e .{"\n"}
        <span className="c2">$</span> e2e screen --camera 0 --age 7{"\n"}
        <span className="c1">✓ amblyopia risk score: 0.08{"\n"}</span>
        <span className="c1">✓ refractive estimate:  -0.5 D{"\n"}</span>
        <span className="c3"># MIT licensed. Yours to ship.</span>
      </pre>
    </div>
  );
}

export default function OpenSourceSection() {
  return (
    <section className="oss">
      <div className="container">
        <div className="oss-card">
          <div>
            <div className="label">Open by default</div>
            <h2>
              Free to use.
              <br />
              <em>Free to fork.</em>
            </h2>
            <p className="prose" style={{ marginTop: 24 }}>
              Every tool we build ships under MIT or Apache 2.0. No licensing
              fees, no vendor lock-in, no “contact sales.” Any clinic, NGO, or
              researcher can clone, run, and adapt our work for their patients.
              That is the entire point.
            </p>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <a className="btn btn-primary" href="https://github.com/eye-to-eye">
                github.com/eye-to-eye <span className="arr">↗</span>
              </a>
              <a className="btn btn-ghost" href="mailto:eyetoeyehealth@gmail.com">
                Partner with us
              </a>
            </div>
          </div>
          <Terminal />
        </div>
      </div>
    </section>
  );
}
