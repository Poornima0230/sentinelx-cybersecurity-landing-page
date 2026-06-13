import "../styles/hero.css";
export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Side */}
        <div className="hero-content">
          <span className="hero-badge">AI-Powered Cyber Security</span>

          <h1>
            Stop Cyber Attacks
            <span> Before They Start.</span>
          </h1>

          <p className="hero-description">
            SentinelX continuously monitors, detects, and neutralizes cyber
            threats using advanced AI-driven security intelligence.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Get Protected Today</button>

            <button className="secondary-btn">Watch Demo</button>
          </div>

          <div className="hero-features">
            <p>✓ 24/7 Monitoring</p>
            <p>✓ AI Threat Detection</p>
            <p>✓ Trusted by 2,000+ Businesses</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="hero-visual">
          <div className="dashboard-card main-card">
            <h4>Threats Blocked</h4>
            <h2>12,847</h2>
          </div>

          <div className="dashboard-card">
            <h4>Security Score</h4>
            <h2>98%</h2>
          </div>

          <div className="dashboard-card">
            <h4>Monitoring</h4>
            <h2>24/7 Active</h2>
          </div>
        </div>
      </div>
    </section>
  );
};
