import "../styles/footer.css";
export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2>SentinelX</h2>

            <p>
              Protecting organizations worldwide from modern cyber threats with
              AI-powered security solutions.
            </p>
          </div>

          <div className="footer-links">
            <h3>Company</h3>

            <a href="/">About</a>
            <a href="/">Careers</a>
            <a href="/">Contact</a>
            <a href="/">Blog</a>
          </div>

          <div className="footer-links">
            <h3>Solutions</h3>

            <a href="/">Threat Detection</a>
            <a href="/">Monitoring</a>
            <a href="/">Compliance</a>
            <a href="/">Security Audit</a>
          </div>

          <div className="footer-links">
            <h3>Resources</h3>

            <a href="/">Documentation</a>
            <a href="/">Support</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SentinelX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
