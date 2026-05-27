export default function SiteFooter() {
  return (
    <footer>
      <div className="foot">
        <div className="foot-brand">
          <div className="row">
            <span className="mark" />
            <span>Eye to Eye</span>
          </div>
          <p>
            A student-led 501(c)(3)-track nonprofit advancing pediatric eye and
            vision health through research, engineering, and advocacy.
          </p>
        </div>
        <div>
          <h4>Reach us</h4>
          <a href="mailto:eyetoeyehealth@gmail.com">eyetoeyehealth@gmail.com</a>
        </div>
        <div>
          <h4>Build with us</h4>
          <a href="https://github.com/eye-to-eye">GitHub</a>
          <a href="https://github.com/eye-to-eye">Open issues</a>
          <a href="mailto:eyetoeyehealth@gmail.com">Volunteer</a>
        </div>
        <div>
          <h4>Branches</h4>
          <a href="#">Research</a>
          <a href="#">Engineering</a>
          <a href="#">Advocacy</a>
        </div>
      </div>
      <div className="meta">
        <span>© 2026 EYE TO EYE · A STUDENT NONPROFIT</span>
        <div className="lic">
          <span>MIT / APACHE 2.0</span>
          <span>MADE OPENLY</span>
        </div>
      </div>
    </footer>
  );
}
