"use client";

export default function ConnectStyles() {
  return (
    <style jsx global>{`
        :global(html) { scroll-behavior: smooth; }
        :global(body) { background: #fafaf9; color: #0a0a0a; font-family: Inter, system-ui, -apple-system, sans-serif; }
        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .hero { padding: 120px 0 60px; text-align: center; background: #fff; }
        .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: #f7efff; border-radius: 999px; font-size: 12px; font-weight: 600; color: #7a5fb8; margin-bottom: 24px; }
        .eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: #ff3ea0; box-shadow: 0 0 0 3px rgba(255, 62, 160, 0.2); }
        h1 { font-size: clamp(38px, 5.5vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -0.035em; max-width: 820px; margin: 0 auto 20px; }
        .accent { background: linear-gradient(135deg, #7a5fb8 0%, #e64b9e 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .sub { font-size: 18px; color: #6f6f6f; max-width: 560px; margin: 0 auto 36px; }
        .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 999px; font-weight: 600; font-size: 14px; text-decoration: none; }
        .btn-primary { background: #0a0a0a; color: #fff; }
        .btn-ghost { background: transparent; color: #0a0a0a; border: 1.5px solid #edeae3; }
        .hero-stats { display: flex; justify-content: center; gap: 48px; margin-top: 56px; flex-wrap: wrap; }
        .hero-stat strong { display: block; font-size: 28px; font-weight: 800; }
        .hero-stat span { font-size: 13px; color: #6f6f6f; }
        .how, .browse { padding: 80px 0; background: #f4f2ee; }
        .reviews, .pricing { padding: 80px 0; background: #fff; }
        .section-head { text-align: center; margin-bottom: 56px; }
        .section-head h2, .browse-head h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 10px; }
        .section-head p, .browse-head p { font-size: 15px; color: #6f6f6f; }
        .how-grid, .reviews-grid { display: grid; gap: 20px; }
        .how-grid { grid-template-columns: repeat(3, 1fr); }
        .reviews-grid { grid-template-columns: repeat(3, 1fr); }
        .how-card, .review-card { background: #fff; border: 1px solid #edeae3; border-radius: 20px; padding: 28px; }
        .how-step { font-size: 11px; font-weight: 600; color: #6f6f6f; letter-spacing: 0.08em; text-transform: uppercase; }
        .how-card h3 { margin-top: 8px; font-size: 20px; font-weight: 700; }
        .how-card p { font-size: 14.5px; color: #6f6f6f; }
        .reviews-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; gap: 20px; flex-wrap: wrap; }
        .reviews-head h2 { font-size: clamp(26px, 3.5vw, 36px); font-weight: 800; }
        .rating-summary { display: flex; align-items: center; gap: 10px; color: #6f6f6f; }
        .stars, .review-stars { color: #e64b9e; }
        .review-card { background: #fafaf9; display: flex; flex-direction: column; }
        .review-text { font-size: 15px; color: #3a3a3a; line-height: 1.6; margin: 16px 0 24px; flex-grow: 1; }
        .review-meta { display: flex; align-items: center; gap: 12px; padding-top: 20px; border-top: 1px solid #edeae3; }
        .review-avatar { width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 700; }
        .a1 { background: linear-gradient(135deg, #7a5fb8, #b79ce0); }
        .a2 { background: linear-gradient(135deg, #e64b9e, #ff8fb8); }
        .a3 { background: linear-gradient(135deg, #3e2a6b, #7a5fb8); }
        .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; flex-wrap: wrap; }
        .sort-toggle { display: inline-flex; background: #fff; padding: 4px; border-radius: 999px; border: 1px solid #edeae3; }
        .sort-btn { padding: 9px 18px; border-radius: 999px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #6f6f6f; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
        .sort-btn.active { background: #0a0a0a; color: #fff; }
        .search-box { background: #fff; border: 1px solid #edeae3; border-radius: 999px; padding: 9px 18px; min-width: 300px; }
        .search-box input { width: 100%; border: none; outline: none; background: transparent; font-size: 13px; }
        .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px; }
        .filter-chip { padding: 7px 14px; background: #fff; border: 1px solid #edeae3; border-radius: 999px; font-size: 12.5px; color: #6f6f6f; cursor: pointer; }
        .filter-chip.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
        .group-header { display: flex; align-items: center; gap: 14px; margin: 40px 0 20px; }
        .group-icon { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; font-size: 12px; font-weight: 800; }
        .g1 { background: linear-gradient(135deg, #fff4e0, #ffe1a8); color: #8b5a00; }
        .g2 { background: linear-gradient(135deg, #e4eeff, #b8d0fa); color: #1e3a8a; }
        .g3 { background: linear-gradient(135deg, #f2e6ff, #d4c4f7); color: #3e2a6b; }
        .g4 { background: linear-gradient(135deg, #ffe4f0, #f5b4c8); color: #8b1e5a; }
        .group-info { flex: 1; }
        .group-name { font-size: 18px; font-weight: 700; }
        .group-meta { font-size: 12px; color: #6f6f6f; }
        .group-view-all { font-size: 13px; font-weight: 600; color: #7a5fb8; text-decoration: none; }
        .alumni-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .alumni-card { background: #fff; border: 1px solid #edeae3; border-radius: 22px; padding: 28px 20px 26px; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .alumni-avatar-wrap { position: relative; margin-bottom: 16px; }
        .alumni-avatar { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; font-size: 24px; background: linear-gradient(135deg, #f2e6ff, #b79ce0); border: 3px solid #fff; box-shadow: 0 0 0 1px #edeae3; }
        .av-2 { background: linear-gradient(135deg, #ffe4f0, #e64b9e); color: #5a1039; }
        .av-3 { background: linear-gradient(135deg, #e4eeff, #7a5fb8); color: #2d1a5a; }
        .av-4 { background: linear-gradient(135deg, #ffe8d4, #f5b4c8); color: #6b2e4a; }
        .av-5 { background: linear-gradient(135deg, #d4e8e1, #8dbaae); color: #1f3e38; }
        .av-6 { background: linear-gradient(135deg, #fff4e0, #f5b4c8); color: #6b2e4a; }
        .av-7 { background: linear-gradient(135deg, #c8dfff, #b79ce0); color: #2d1a5a; }
        .av-8 { background: linear-gradient(135deg, #ffd4eb, #7a5fb8); color: #fff; }
        .available-badge { position: absolute; top: -4px; right: -6px; background: #e4f8e8; color: #137a3a; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 999px; display: flex; align-items: center; gap: 4px; border: 2px solid #fff; }
        .available-badge .dot { width: 5px; height: 5px; border-radius: 50%; background: #1db954; }
        .verified-tick { position: absolute; bottom: -2px; right: -2px; width: 22px; height: 22px; border-radius: 50%; background: #7a5fb8; border: 2px solid #fff; color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 700; line-height: 1; }
        .alumni-id { font-size: 10.5px; font-weight: 600; color: #6f6f6f; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
        .alumni-title { font-size: 15px; font-weight: 700; line-height: 1.2; margin-bottom: 6px; }
        .alumni-sub { font-size: 12.5px; color: #6f6f6f; line-height: 1.4; margin-bottom: 20px; min-height: 48px; }
        .alumni-tag-strip { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 6px 14px; background: #f7efff; color: #7a5fb8; border-radius: 999px; margin-bottom: 22px; }
        .alumni-bottom-cta { width: 100%; padding: 14px 10px; border-radius: 999px; border: none; background: #0a0a0a; color: #fff; font-weight: 600; font-size: 15px; line-height: 1; margin-top: auto; }
        .pricing { padding-bottom: 100px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 960px; margin: 0 auto; }
        .price-card { border: 1px solid #edeae3; border-radius: 20px; padding: 32px 28px; display: flex; flex-direction: column; position: relative; }
        .price-card.featured { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
        .price-card.featured::before { content: "Most booked"; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #e64b9e; color: #fff; font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 999px; }
        .price-duration { font-size: 13px; color: #6f6f6f; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; }
        .price-card.featured .price-duration { color: rgba(255, 255, 255, 0.55); }
        .price-title { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
        .price-amount { font-size: 40px; font-weight: 800; line-height: 1; margin-bottom: 28px; }
        .currency { font-size: 22px; font-weight: 500; margin-right: 2px; vertical-align: top; }
        .price-features { list-style: none; margin-bottom: 28px; flex-grow: 1; padding: 0; }
        .price-features li { padding: 8px 0; font-size: 14px; display: flex; gap: 10px; color: #3a3a3a; }
        .price-card.featured .price-features li { color: rgba(255, 255, 255, 0.85); }
        .price-features li::before { content: "✓"; color: #7a5fb8; font-weight: 700; }
        .price-card.featured .price-features li::before { color: #ff3ea0; }
        .price-btn { width: 100%; padding: 12px; border-radius: 999px; background: transparent; border: 1.5px solid #0a0a0a; font-weight: 600; font-size: 14px; }
        .price-card.featured .price-btn { background: #fff; color: #0a0a0a; border-color: #fff; }
        footer { background: #0a0a0a; color: #fff; padding: 60px 0 30px; }
        .footer-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .footer-logo { font-weight: 800; font-size: 22px; margin-bottom: 10px; }
        .footer-logo::after { content: "."; color: #e64b9e; }
        .footer-tag { font-size: 13.5px; color: rgba(255, 255, 255, 0.6); max-width: 240px; }
        .footer-col h5 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255, 255, 255, 0.45); margin-bottom: 18px; }
        .footer-col a { display: block; color: rgba(255, 255, 255, 0.85); text-decoration: none; font-size: 13.5px; padding: 5px 0; }
        .footer-bot { display: flex; justify-content: space-between; padding-top: 24px; font-size: 12px; color: rgba(255, 255, 255, 0.45); flex-wrap: wrap; gap: 10px; }
        @media (max-width: 1000px) { .alumni-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr; } .how-grid { grid-template-columns: 1fr; } }
        @media (max-width: 800px) { .pricing-grid { grid-template-columns: 1fr; } }
        @media (max-width: 760px) { .alumni-grid { grid-template-columns: repeat(2, 1fr); } .footer-top { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .alumni-grid { grid-template-columns: 1fr; } }
      `}</style>
  );
}
