import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-dot" />
          CLASS 11 & 12 MATHEMATICS
        </div>
        <h1 className="hero-title">
          Spin<span className="hero-accent">.</span> Learn
          <span className="hero-accent">.</span> Conquer
          <span className="hero-accent">.</span>
        </h1>
        <p className="hero-subtitle">
          Discover math concepts through an interactive spin wheel.
          Every spin reveals a formula worth mastering.
        </p>
      </div>
    </section>
  );
};

export default Hero;
