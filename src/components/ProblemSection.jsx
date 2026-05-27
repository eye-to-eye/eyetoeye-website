function Stat({ n, k }) {
  return (
    <div className="stat">
      <div className="n">{n}</div>
      <div className="k">{k}</div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section className="problem">
      <div className="container">
        <div className="problem-grid">
          <div>
            <div className="label">The problem</div>
            <h2>
              A treatable
              <br />
              window, <em>closing</em>.
            </h2>
          </div>
          <div className="stat-stack">
            <p className="prose">
              Millions of children live with undetected eye conditions that are
              entirely treatable when caught early, yet most never see a
              pediatric ophthalmologist before the critical window closes. The
              shortage is most severe exactly where the need is highest: in
              rural clinics, low-income school districts, and the Global South.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 20,
                marginTop: 18,
              }}
            >
              <Stat
                n="1 in 4"
                k={
                  <>
                    school-age children
                    <br />
                    with vision issues
                  </>
                }
              />
              <Stat
                n="< 1%"
                k={
                  <>
                    receive a pediatric
                    <br />
                    eye exam by age 5
                  </>
                }
              />
              <Stat
                n="80%"
                k={
                  <>
                    of childhood blindness
                    <br />
                    is preventable
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
