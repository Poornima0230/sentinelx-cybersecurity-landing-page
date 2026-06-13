import "../styles/feature.css";
export const FeatureSection = () => {
  const features = [
    {
      icon: "🛡️",
      title: "Real-Time Threat Detection",
      desc: "Identify and block malicious activity instantly before damage occurs.",
    },
    {
      icon: "🤖",
      title: "AI Security Engine",
      desc: "Machine learning algorithms detect unusual patterns and vulnerabilities.",
    },
    {
      icon: "🌐",
      title: "Network Protection",
      desc: "Protect every device, endpoint, and network connection.",
    },
    {
      icon: "🔒",
      title: "Data Encryption",
      desc: "Keep sensitive business information secure with enterprise-grade encryption.",
    },
    {
      icon: "📊",
      title: "Security Analytics",
      desc: "Get deep visibility into security events through powerful dashboards.",
    },
    {
      icon: "⚡",
      title: "Automated Response",
      desc: "Respond to threats automatically without manual intervention.",
    },
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <span>FEATURES</span>

          <h2>Everything You Need To Stay Secure</h2>

          <p>
            Advanced cybersecurity tools designed to protect your business from
            modern threats.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
