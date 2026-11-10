import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="url(#logoGrad)" strokeWidth="2" />
              <path d="M9 14L13 10L17 14L13 18Z" fill="url(#logoGrad2)" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#00f0ff" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="logoGrad2" x1="9" y1="10" x2="17" y2="18">
                  <stop stopColor="#00f0ff" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="logo-text">MATHSPIN</span>
        </div>
        <nav className="header-nav">
          <span className="nav-badge">BETA</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
