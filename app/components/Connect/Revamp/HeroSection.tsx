export default function HeroSection() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="eyebrow">
          <span className="dot" />
          <span>New · Alumni Connect</span>
        </div>
        <h1>
          Talk to someone who&apos;s<br />
          <span className="accent">already there.</span>
        </h1>
        <p className="sub">1-on-1 video sessions with verified alumni and current students from the universities you&apos;re considering. Real answers, before you commit.</p>
        <div className="hero-ctas">
          <a href="#browse" className="btn btn-primary">Find your alumni <span className="btn-arrow">→</span></a>
          <a href="#how" className="btn btn-ghost">How it works</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><strong>120+</strong><span>Verified alumni</span></div>
          <div className="hero-stat"><strong>40+</strong><span>Universities</span></div>
          <div className="hero-stat"><strong>4.9<span style={{ color: "#E64B9E", fontSize: 22 }}>★</span></strong><span>Avg. session rating</span></div>
          <div className="hero-stat"><strong>2,400+</strong><span>Sessions completed</span></div>
        </div>
      </div>
    </section>
  );
}
