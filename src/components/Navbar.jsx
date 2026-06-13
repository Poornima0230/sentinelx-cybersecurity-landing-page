import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("click", closeMenu);

      // disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // enable scroll
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="logo">
          <a href="/">
            <span className="logo-heading">SentineIX</span>
          </a>
        </div>

        <nav className={menuOpen ? "menu-mobile" : "menu-web"}>
          <ul className="nav-list">
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Solutions</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Features</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Pricing</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Resources</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Contact</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/">Login</a>
            </li>
            <li onClick={() => setMenuOpen(false)}>
              <a href="/" className="btn-contact">
                Get Protected
              </a>
            </li>
          </ul>
        </nav>

        <div
          className="menu-icon"
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
        >
          {menuOpen ? <IoClose /> : <IoMenu />}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
