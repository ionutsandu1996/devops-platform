import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__container">
                <p className="footer__brand">
                    Ionut Sandu <span className="accent">DevOps</span>
                </p>
                <div className="footer__links">
                    <Link to="/services" className="footer__link">Services</Link>
                    <Link to="/projects" className="footer__link">Projects</Link>
                    <Link to="/contact"  className="footer__link">Contact</Link>
                </div>
                <div className="footer__links">
                    <a href="https://github.com/ionutsandu1996" target="_blank" rel="noopener noreferrer" className="footer__link">GitHub</a>
                    <a href="https://linkedin.com/in/ionut-sandu" target="_blank" rel="noopener noreferrer" className="footer__link">LinkedIn</a>
                </div>
            </div>
            <div className="footer__copyright">
                <p>© {currentYear} Ionut Sandu. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;