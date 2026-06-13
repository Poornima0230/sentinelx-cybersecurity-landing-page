import "../styles/benefits.css";
export const Benefits = () => {
  const benefits = [
    {
      icon: "🛡️",
      title: "Prevent Costly Breaches",
      desc: "Reduce financial losses and reputational damage caused by cyber attacks.",
    },
    {
      icon: "⚡",
      title: "Save Security Team Time",
      desc: "Automated workflows eliminate repetitive security tasks.",
    },
    {
      icon: "📈",
      title: "Scale With Confidence",
      desc: "Security infrastructure grows seamlessly alongside your business.",
    },
  ];

  return (
    <section className="benefits">
      <div className="benefits-container">
        <div className="benefits-header">
          <span>BENEFITS</span>

          <h2>Why Businesses Choose SentinelX</h2>

          <p>
            Protect your organization with intelligent security solutions
            designed for modern threats.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>

              <h3>{benefit.title}</h3>

              <p>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
