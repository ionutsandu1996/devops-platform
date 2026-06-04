import { Link } from 'react-router-dom';
import './About.css';

const SKILLS = [
    { category: 'CI/CD',        items: ['GitHub Actions', 'Jenkins', 'ArgoCD'] },
    { category: 'Containers',   items: ['Docker', 'Kubernetes', 'OpenShift'] },
    { category: 'IaC',          items: ['Helm', 'Terraform', 'Ansible'] },
    { category: 'Observability', items: ['Prometheus', 'Grafana', 'Splunk'] },
];

const EXPERIENCE = [
    {
        role:    'DevOps Engineer',
        company: 'Deutsche Bank',
        period:  '2020 — Present',
        desc:    'OpenShift 3→4 migration, ArgoCD GitOps, Jenkins pipelines, GKE, release management for enterprise applications.',
    },
];

function About() {
    return (
        <main>

            {/* ── HEADER ─────────────────────────────────────────── */}
            <section className="page-header">
                <div className="page-header__container">
                    <h1 className="page-header__title">About Me</h1>
                    <p className="page-header__subtitle">
                        DevOps Engineer passionate about automation, reliability, and clean deployments
                    </p>
                </div>
            </section>

            {/* ── BIO ────────────────────────────────────────────── */}
            <section className="about">
                <div className="about__container">

                    <div className="about__bio">
                        <h2 className="about__bio-title">Hi, I'm Ionut 👋</h2>
                        <p className="about__bio-text">
                            I'm a Senior DevOps Engineer with 5+ years of experience
                            building and maintaining CI/CD pipelines, Kubernetes deployments,
                            and GitOps workflows for enterprise teams at Deutsche Bank.
                        </p>
                        <p className="about__bio-text">
                            I hold a PhD in Cyber Physical Systems from Politehnica Bucharest,
                            which gives me a strong foundation in distributed systems and
                            infrastructure design.
                        </p>
                        <p className="about__bio-text">
                            I'm now offering freelance DevOps consulting to help startups
                            and growing teams ship faster, with confidence.
                        </p>
                        <div className="about__bio-links">
                            <Link to="/contact" className="btn-primary">Work With Me</Link>
                            <a
                                href="https://github.com/ionutsandu1996"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                            >
                                GitHub Profile
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── SKILLS ─────────────────────────────────────────── */}
            <section className="skills">
                <div className="skills__container">
                    <h2 className="skills__title">Technical Skills</h2>
                    <div className="skills__grid">
                        {SKILLS.map((group) => (
                            <div key={group.category} className="skills__card">
                                <h3 className="skills__category">{group.category}</h3>
                                <ul className="skills__list">
                                    {group.items.map((item) => (
                                        <li key={item} className="skills__item">
                                            <span className="skills__dot" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── EXPERIENCE ─────────────────────────────────────── */}
            <section className="experience">
                <div className="experience__container">
                    <h2 className="experience__title">Experience</h2>
                    <div className="experience__list">
                        {EXPERIENCE.map((job) => (
                            <div key={job.company} className="experience__item">
                                <div className="experience__header">
                                    <div>
                                        <h3 className="experience__role">{job.role}</h3>
                                        <p className="experience__company">{job.company}</p>
                                    </div>
                                    <span className="experience__period">{job.period}</span>
                                </div>
                                <p className="experience__desc">{job.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}

export default About;