export default function FooterSection() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">Secure Steps</div>
            <p className="footer-tag">Built for students who want real answers before making life-changing decisions.</p>
          </div>
          <div className="footer-col"><h5>Product</h5><a href="#">Alumni Connect</a><a href="#">Housing</a><a href="#">Part-time</a></div>
          <div className="footer-col"><h5>Company</h5><a href="#">About</a><a href="#">Careers</a><a href="#">Contact</a></div>
          <div className="footer-col"><h5>Legal</h5><a href="/Privacy">Privacy</a><a href="/Terms&Conditions">Terms</a><a href="/CookiePolicy">Cookies</a></div>
        </div>
        <div className="footer-bot"><span>© 2026 Secure Steps. All rights reserved.</span><span>Made for global students.</span></div>
      </div>
    </footer>
  );
}
