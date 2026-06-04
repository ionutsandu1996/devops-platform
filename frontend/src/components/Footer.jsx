import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={styles.footer}>
            <div style={styles.container}>

                <p style={styles.brand}>
                    Ionut Sandu <span style={styles.accent}>DevOps</span>
                </p>

                <div style={styles.links}>
                    <Link to="/services" style={styles.link}>Services</Link>
                    <Link to="/projects" style={styles.link}>Projects</Link>
                    <Link to="/contact"  style={styles.link}>Contact</Link>
                </div>

                <div style={styles.links}>
                    <a href="https://github.com/ionutsandu1996" target="_blank" rel="noopener noreferrer" style={styles.link}>
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/ionut-sandu" target="_blank" rel="noopener noreferrer" style={styles.link}>
                        LinkedIn
                    </a>
                </div>

            </div>

            <div style={styles.copyright}>
                <p>© {currentYear} Ionut Sandu. All rights reserved.</p>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#0f172a',
        borderTop: '1px solid #1e293b',
        marginTop: 'auto',
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '24px',
    },
    brand: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    accent: {
        color: '#38bdf8',
    },
    links: {
        display: 'flex',
        gap: '24px',
    },
    link: {
        color: '#94a3b8',
        fontSize: '14px',
    },
    copyright: {
        textAlign: 'center',
        padding: '16px 24px',
        borderTop: '1px solid #1e293b',
        color: '#475569',
        fontSize: '13px',
    },
};

export default Footer;