export default function Nav() {
  return (
    <nav className="nav">
      <a className="brand" href="#top">
        <span className="mark" aria-hidden="true" />
        <span>Eye to Eye</span>
      </a>
      <div className="nav-links">
        <a href="https://github.com/eye-to-eye">GitHub</a>
        <a href="mailto:eyetoeyehealth@gmail.com">Contact</a>
      </div>
    </nav>
  );
}
