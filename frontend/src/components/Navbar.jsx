import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
    { path: '/',         label: 'Home'     },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/about',    label: 'About'    },
    { path: '/contact',  label: 'Contact'  },
];

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <Link to="/" className="navbar__logo">
                    Ops<span className="accent">Ora</span>
                </Link>

                <ul className="navbar__links">
                    {NAV_LINKS.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link to="/contact" className="navbar__cta">Hire Me</Link>

                <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {menuOpen && (
                <div className="navbar__mobile">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar__mobile-link ${isActive(link.path) ? 'navbar__mobile-link--active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
