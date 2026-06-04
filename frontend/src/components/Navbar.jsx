// Navbar.jsx — Navigation bar rendered on every page
// Contains links to all public pages and the admin panel

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// useLocation: gives us the current URL path
// We use it to highlight the active navigation link

function Navbar() {
    // useState: tracks whether the mobile menu is open or closed
    // false = closed, true = open
    // When setMenuOpen is called, React re-renders the component
    const [menuOpen, setMenuOpen] = useState(false);

    // useLocation returns an object with the current URL
    // e.g. { pathname: '/projects', search: '', hash: '' }
    const location = useLocation();

    // Helper function — returns true if the current path matches the link
    // Used to apply the active style to the current page link
    const isActive = (path) => location.pathname === path;

    // Navigation links array — easier to maintain than repeating JSX
    const navLinks = [
        { path: '/',         label: 'Home'     },
        { path: '/services', label: 'Services' },
        { path: '/projects', label: 'Projects' },
        { path: '/about',    label: 'About'    },
        { path: '/contact',  label: 'Contact'  },
    ];

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>

                {/* Logo / Brand name — clicking it goes to home */}
                <Link to="/" style={styles.logo}>
                    Ionut Sandu <span style={styles.logoAccent}>DevOps</span>
                </Link>

                {/* Desktop navigation links */}
                <ul style={styles.navLinks}>
                    {/* .map() renders a list item for each link */}
                    {/* key={link.path} is required by React to track list items */}
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                style={{
                                    ...styles.navLink,
                                    // Spread the active style on top if this is the current page
                                    ...(isActive(link.path) ? styles.navLinkActive : {}),
                                }}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA button — links to contact page */}
                <Link to="/contact" style={styles.ctaButton}>
                    Hire Me
                </Link>

                {/* Mobile hamburger button — only visible on small screens */}
                <button
                    style={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    // !menuOpen toggles between true and false on each click
                >
                    {menuOpen ? '✕' : '☰'}
                </button>

            </div>

            {/* Mobile menu — only rendered when menuOpen is true */}
            {menuOpen && (
                <div style={styles.mobileMenu}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                ...styles.mobileLink,
                                ...(isActive(link.path) ? styles.navLinkActive : {}),
                            }}
                            // Close the menu when a link is clicked
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

// ── STYLES ────────────────────────────────────────────────────────────────────
// Inline styles as a JavaScript object
// We keep them at the bottom to not clutter the component logic
const styles = {
    nav: {
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        // sticky + zIndex: navbar stays at the top when scrolling
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logo: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    logoAccent: {
        color: '#38bdf8',
        // Light blue accent color for "DevOps" part
    },
    navLinks: {
        display: 'flex',
        gap: '32px',
        listStyle: 'none',
    },
    navLink: {
        color: '#94a3b8',
        fontSize: '15px',
        fontWeight: '500',
        transition: 'color 0.2s',
    },
    navLinkActive: {
        color: '#38bdf8',
        // Active link is highlighted in blue
    },
    ctaButton: {
        backgroundColor: '#38bdf8',
        color: '#0f172a',
        padding: '8px 20px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '14px',
    },
    hamburger: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: '#e2e8f0',
        fontSize: '24px',
        // Hidden on desktop — shown on mobile via media query
        // Note: for proper responsive behavior, add media queries in index.css
    },
    mobileMenu: {
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 24px',
        borderTop: '1px solid #1e293b',
        gap: '16px',
    },
    mobileLink: {
        color: '#94a3b8',
        fontSize: '16px',
        fontWeight: '500',
    },
};

export default Navbar;