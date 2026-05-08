export default function PricingSection() {
  return (
    <section className="pricing">
      <div className="wrap">
        <div className="section-head">
          <h2>Simple session pricing</h2>
          <p>Pay per call. No subscription, no hidden fees.</p>
        </div>
        <div className="pricing-grid">
          <article className="price-card"><div className="price-duration">Quick</div><div className="price-title">30 mins</div><div className="price-amount"><span className="currency">₹</span>999</div><ul className="price-features"><li>Ask focused questions</li><li>Application shortlist help</li><li>Call summary notes</li></ul><button className="price-btn">Book 30 mins</button></article>
          <article className="price-card featured"><div className="price-duration">Most popular</div><div className="price-title">60 mins</div><div className="price-amount"><span className="currency">₹</span>1,799</div><ul className="price-features"><li>Deep university comparison</li><li>Budget and living strategy</li><li>Timeline and next actions</li></ul><button className="price-btn">Book 60 mins</button></article>
          <article className="price-card"><div className="price-duration">Intensive</div><div className="price-title">90 mins</div><div className="price-amount"><span className="currency">₹</span>2,499</div><ul className="price-features"><li>End-to-end planning</li><li>Essay and profile direction</li><li>Final Q&A + roadmap</li></ul><button className="price-btn">Book 90 mins</button></article>
        </div>
      </div>
    </section>
  );
}
