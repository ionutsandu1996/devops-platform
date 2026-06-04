import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject, updateProject, deleteProject } from '../api/index.js';
import './AdminProjects.css';

const EMPTY_FORM = {
    title:       '',
    description: '',
    tech_stack:  '',
    github_url:  '',
    demo_url:    '',
    image_url:   '',
    is_featured: false,
    sort_order:  0,
};

function AdminProjects() {
    const [projects,    setProjects]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [showModal,   setShowModal]   = useState(false);
    const [editProject, setEditProject] = useState(null);
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [saving,      setSaving]      = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data);
        } catch (err) {
            setError('Failed to load projects.');
            console.error('Error fetching projects:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAdd = () => {
        setEditProject(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const handleEdit = (project) => {
        setEditProject(project);
        setForm({
            title:       project.title,
            description: project.description,
            tech_stack:  project.tech_stack  || '',
            github_url:  project.github_url  || '',
            demo_url:    project.demo_url    || '',
            image_url:   project.image_url   || '',
            is_featured: project.is_featured || false,
            sort_order:  project.sort_order  || 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Error deleting project:', err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editProject) {
                const res = await updateProject(editProject.id, form);
                setProjects((prev) =>
                    prev.map((p) => p.id === editProject.id ? res.data : p)
                );
            } else {
                const res = await createProject(form);
                setProjects((prev) => [...prev, res.data]);
            }
            setShowModal(false);
        } catch (err) {
            console.error('Error saving project:', err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error)   return <div className="error">{error}</div>;

    return (
        <main className="admin-projects">
            <div className="admin-projects__container">

                {/* ── HEADER ───────────────────────────────────── */}
                <div className="admin-projects__header">
                    <div>
                        <h1 className="admin-projects__title">Projects</h1>
                        <p className="admin-projects__subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="admin-projects__actions">
                        <Link to="/admin" className="btn-secondary">← Dashboard</Link>
                        <button className="btn-primary" onClick={handleAdd}>+ Add Project</button>
                    </div>
                </div>

                {/* ── PROJECTS LIST ────────────────────────────── */}
                {projects.length === 0 ? (
                    <div className="admin-projects__empty">
                        <p>No projects yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="admin-projects__list">
                        {projects.map((project) => (
                            <div key={project.id} className="project-row">
                                <div className="project-row__info">
                                    <div className="project-row__header">
                                        <h3 className="project-row__title">{project.title}</h3>
                                        {project.is_featured && (
                                            <span className="project-row__featured">Featured</span>
                                        )}
                                    </div>
                                    <p className="project-row__desc">{project.description}</p>
                                    {project.tech_stack && (
                                        <p className="project-row__tech">{project.tech_stack}</p>
                                    )}
                                </div>
                                <div className="project-row__buttons">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(project)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(project.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* ── MODAL ────────────────────────────────────────── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <div className="modal__header">
                            <h2 className="modal__title">
                                {editProject ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <button className="modal__close" onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <form className="modal__form" onSubmit={handleSubmit}>

                            <div className="modal__field">
                                <label className="modal__label">Title *</label>
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Project title"
                                    required
                                />
                            </div>

                            <div className="modal__field">
                                <label className="modal__label">Description *</label>
                                <textarea
                                    className="modal__textarea"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Project description"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="modal__field">
                                <label className="modal__label">Tech Stack</label>
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="tech_stack"
                                    value={form.tech_stack}
                                    onChange={handleChange}
                                    placeholder="Docker, Helm, GitHub Actions"
                                />
                            </div>

                            <div className="modal__field">
                                <label className="modal__label">GitHub URL</label>
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="github_url"
                                    value={form.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                />
                            </div>

                            <div className="modal__field">
                                <label className="modal__label">Demo URL</label>
                                <input
                                    className="modal__input"
                                    type="text"
                                    name="demo_url"
                                    value={form.demo_url}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="modal__field modal__field--row">
                                <label className="modal__label">Sort Order</label>
                                <input
                                    className="modal__input modal__input--small"
                                    type="number"
                                    name="sort_order"
                                    value={form.sort_order}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="modal__field modal__field--checkbox">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    id="is_featured"
                                    checked={form.is_featured}
                                    onChange={handleChange}
                                    className="modal__checkbox"
                                />
                                <label htmlFor="is_featured" className="modal__checkbox-label">
                                    Featured project
                                </label>
                            </div>

                            <div className="modal__footer">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : editProject ? 'Save Changes' : 'Add Project'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}

export default AdminProjects;