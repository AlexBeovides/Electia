import "../styles/FooterSection.scss";

export function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-wrapper">
        <div className="footer-info-wrapper">
          <div className="about">
            <h2 className="footer-logo-txt">electia</h2>

            <div className="footer-logo-img"></div>
          </div>

          <div className="contact-container">
            <div className="contact">
              <div className="contact-header">Contacto</div>
              <div className="contact-details">
                <p>Havana University</p>
                <p>La Habana, Cuba</p>
                <p>+53 55512893</p>
                <a href="electia@gmail.com">electia@gmail.com</a>
              </div>
            </div>
            <div className="quick-links">
              <div className="links-header">Acceso Rápido</div>
              <div className="footer-links-list">
                <ul>
                  <li>
                    <a href="">Principal</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom-wrapper">
          <hr className="footer-line" />

          <div className="footer-footer">
            <div className="copyright">Copyright © 2025</div>
            <div className="social">
              <div className="icon facebook">
                <a href="#"></a>
              </div>
              <div className="icon twitter">
                <a href="#"></a>
              </div>
              <div className="icon instagram">
                <a href="#"></a>
              </div>
              <div className="icon pinterest">
                <a href="#"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
