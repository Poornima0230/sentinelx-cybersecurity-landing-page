import "../styles/trusted.css";
export const TrustedSection = () => {
  const companies = [
    "TechNova",
    "FinSecure",
    "CloudCore",
    "NexaBank",
    "QuantumData",
  ];

  return (
    <section className="trusted-section">
      <div className="trusted-container">
        <p className="trusted-heading">TRUSTED BY INDUSTRY LEADERS</p>

        <div className="trusted-logos">
          {companies.map((company) => (
            <div className="logo-card" key={company}>
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
