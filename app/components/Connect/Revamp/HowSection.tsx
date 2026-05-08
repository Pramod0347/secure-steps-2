export default function HowSection() {
  return (
    <section className="how" id="how">
      <div className="wrap">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Simple, private, and fully inside the Secure Steps app.</p>
        </div>
        <div className="how-grid">
          <div className="how-card"><div className="how-step">Step 01</div><h3>Browse anonymously</h3><p>Filter alumni by college, course, or country. Names and photos stay private.</p></div>
          <div className="how-card"><div className="how-step">Step 02</div><h3>Pick your session</h3><p>Choose 30, 60, or 90 minutes based on how deep you want to go.</p></div>
          <div className="how-card"><div className="how-step">Step 03</div><h3>Meet in-app</h3><p>The video call runs inside our portal. No external links required.</p></div>
        </div>
      </div>
    </section>
  );
}
