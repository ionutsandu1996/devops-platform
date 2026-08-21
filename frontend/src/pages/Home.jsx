import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getProjects } from '../api/index.js';
import './Home.css';

const TECH_BADGES = [
    'Docker', 'Kubernetes', 'Helm',
    'GitHub Actions', 'ArgoCD', 'OpenShift',
    'Ansible', 'Jenkins', 'GCP', 'Bitbucket',
];

const STATS = [
    { value: '5+',  label: 'Years Experience' },
    { value: '20+', label: 'Projects Delivered' },
    { value: '99%', label: 'Uptime Achieved' },
    { value: '3',   label: 'Cloud Platforms' },
];

function Home() {
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, projectsRes] = await Promise.all([
                    getServices(),
                    getProjects(),
                ]);
                setServices(servicesRes.data.slice(0, 3));
                setProjects(projectsRes.data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching home data:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <main>

            {/* ── HERO ───────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero__content">
                    <div className="hero__tag">
                        <span className="hero__dot" />
                        Available for freelance work
                    </div>
                    <h1 className="hero__title">
                        I automate, deploy,<br />
                        and <span className="accent">scale</span> your infrastructure
                    </h1>
                    <p className="hero__subtitle">
                        Senior DevOps Engineer with 5+ years at Deutsche Bank.
                        I build CI/CD pipelines, Kubernetes deployments, and
                        GitOps workflows that teams actually rely on.
                    </p>
                    <div className="hero__buttons">
                        <Link to="/contact"  className="btn-primary">Let's Work Together</Link>
                        <Link to="/projects" className="btn-secondary">See My Work</Link>
                    </div>
                    <div className="hero__badges">
                        {TECH_BADGES.map((tech) => (
                            <span key={tech} className="hero__badge">{tech}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS ──────────────────────────────────────────── */}
            <section className="stats">
                <div className="stats__container">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="stats__item">
                            <span className="stats__value">{stat.value}</span>
                            <span className="stats__label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES ───────────────────────────────────────── */}
            <section className="section">
                <div className="section__container">
                    <div className="section__header">
                        <h2 className="section__title">What I Do</h2>
                        <p className="section__subtitle">End-to-end DevOps solutions — from pipeline to production</p>
                    </div>
                    {services.length === 0 ? (
                        <p className="empty">No services added yet.</p>
                    ) : (
                        <div className="grid">
                            {services.map((service) => (
                                <div key={service.id} className="card">
                                    <span className="card__icon">{service.icon || '⚙️'}</span>
                                    <h3 className="card__title">{service.title}</h3>
                                    <p className="card__text">{service.description}</p>
                                    {service.price_from && (
                                        <p className="card__price">From €{service.price_from}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="section__footer">
                        <Link to="/services" className="btn-secondary">View All Services →</Link>
                    </div>
                </div>
            </section>

            {/* ── PROJECTS ───────────────────────────────────────── */}
            <section className="section section--dark">
                <div className="section__container">
                    <div className="section__header">
                        <h2 className="section__title">Featured Projects</h2>
                        <p className="section__subtitle">Real-world DevOps implementations with full documentation</p>
                    </div>
                    {projects.length === 0 ? (
                        <p className="empty">No projects added yet.</p>
                    ) : (
                        <div className="grid">
                            {projects.map((project) => (
                                <div key={project.id} className="card">
                                    {project.is_featured && (
                                        <span className="card__featured">Featured</span>
                                    )}
                                    <h3 className="card__title">{project.title}</h3>
                                    <p className="card__text">{project.description}</p>
                                    {project.tech_stack && (
                                        <div className="card__tags">
                                            {project.tech_stack.split(',').map((tag) => (
                                                <span key={tag} className="card__tag">{tag.trim()}</span>
                                            ))}
                                        </div>
                                    )}
                                    {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="card__link">
                                            View on GitHub →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="section__footer">
                        <Link to="/projects" className="btn-secondary">View All Projects →</Link>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section className="cta">
                <div className="cta__container">
                    <h2 className="cta__title">Ready to ship faster?</h2>
                    <p className="cta__subtitle">Let's build a deployment pipeline your team can trust.</p>
                    <div className="cta__buttons">
                        <Link to="/contact"  className="btn-primary">Get in Touch</Link>
                        <Link to="/services" className="btn-secondary">View Services</Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default Home;
