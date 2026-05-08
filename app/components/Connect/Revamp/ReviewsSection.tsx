export default function ReviewsSection() {
  return (
    <section className="reviews">
      <div className="wrap">
        <div className="reviews-head">
          <h2>What students say</h2>
          <div className="rating-summary"><span className="stars">★★★★★</span><strong>4.9</strong><span>· 2,400+ sessions</span></div>
        </div>
        <div className="reviews-grid">
          <div className="review-card"><div className="review-stars">★★★★★</div><p className="review-text">&quot;One 60-min call cleared up what brochures couldn&apos;t — I knew exactly where to apply by the time we hung up.&quot;</p><div className="review-meta"><div className="review-avatar a1">AK</div><div><div className="review-name">Aarav K.</div><div className="review-role">Incoming MBA · Warwick</div></div></div></div>
          <div className="review-card"><div className="review-stars">★★★★★</div><p className="review-text">&quot;Real rent prices and honest course load details. Worth every rupee.&quot;</p><div className="review-meta"><div className="review-avatar a2">PS</div><div><div className="review-name">Priya S.</div><div className="review-role">MSc DS · Edinburgh</div></div></div></div>
          <div className="review-card"><div className="review-stars">★★★★★</div><p className="review-text">&quot;Booked a slot, paid, got an honest answer, done. The anonymity made it feel real.&quot;</p><div className="review-meta"><div className="review-avatar a3">RM</div><div><div className="review-name">Rohan M.</div><div className="review-role">Applying · LSE</div></div></div></div>
        </div>
      </div>
    </section>
  );
}
