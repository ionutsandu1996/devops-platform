import { useEffect, useState } from 'react';
import { getProjects } from '../api/index.js';
import './Projects.css';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(res.data);
            } catch (err) {
                setError('Failed to load projects. Please try again later.');
                console.error('Error fetching projects:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error)   return <div className="error">{error}</div>;

    return (
        <main>

            <section className="page-header">
                <div className="page-header__container">
                    <h1 className="page-header__title">Projects</h1>
                    <p className="page-header__subtitle">
                        Real-world DevOps implementations — fully documented and open source
                    </p>
                </div>
            </section>

            <section className="projects">
                <div className="projects__container">

                    {projects.length === 0 ? (
                        <p className="empty">No projects added yet.</p>
                    ) : (
                        <div className="projects__grid">
                            {projects.map((project) => (
                                <div key={project.id} className="project-card">

                                    {project.is_featured && (
                                        <span className="project-card__featured">Featured</span>
                                    )}

                                    <h3 className="project-card__title">
                                        {project.title}
                                    </h3>

                                    <p className="project-card__text">
                                        {project.description}
                                    </p>

                                    {project.tech_stack && (
                                        <div className="project-card__tags">
                                            {project.tech_stack.split(',').map((tag) => (
                                                <span key={tag} className="project-card__tag">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="project-card__links">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-card__link"
                                            >
                                                GitHub →
                                            </a>
                                        )}
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="project-card__link project-card__link--demo"
                                            >
                                                Live Demo →
                                            </a>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}

export default Projects;