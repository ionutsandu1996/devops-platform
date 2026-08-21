import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMessages, getProjects, getAllServices } from '../api/index.js';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats,   setStats]   = useState({ messages: 0, unread: 0, projects: 0, services: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [messagesRes, projectsRes, servicesRes] = await Promise.all([
                    getMessages(),
                    getProjects(),
                    getAllServices(),
                ]);

                const unread = messagesRes.data.filter((m) => !m.is_read).length;

                setStats({
                    messages: messagesRes.data.length,
                    unread,
                    projects: projectsRes.data.length,
                    services: servicesRes.data.length,
                });
            } catch (err) {
                console.error('Error fetching dashboard stats:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <main className="admin-dashboard">
            <div className="admin-dashboard__container">

                {/* ── HEADER ───────────────────────────────────── */}
                <div className="admin-dashboard__header">
                    <div>
                        <h1 className="admin-dashboard__title">Dashboard</h1>
                        <p className="admin-dashboard__subtitle">Welcome to OpsOra 👋</p>
                    </div>
                    <button className="admin-dashboard__logout" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* ── STATS ────────────────────────────────────── */}
                <div className="admin-dashboard__stats">
                    <div className="admin-stat">
                        <span className="admin-stat__value">{stats.messages}</span>
                        <span className="admin-stat__label">Total Messages</span>
                    </div>
                    <div className="admin-stat admin-stat--alert">
                        <span className="admin-stat__value">{stats.unread}</span>
                        <span className="admin-stat__label">Unread Messages</span>
                    </div>
                    <div className="admin-stat">
                        <span className="admin-stat__value">{stats.projects}</span>
                        <span className="admin-stat__label">Projects</span>
                    </div>
                    <div className="admin-stat">
                        <span className="admin-stat__value">{stats.services}</span>
                        <span className="admin-stat__label">Services</span>
                    </div>
                </div>

                {/* ── QUICK LINKS ──────────────────────────────── */}
                <div className="admin-dashboard__nav">
                    <Link to="/admin/messages" className="admin-nav-card">
                        <span className="admin-nav-card__icon">✉️</span>
                        <h3 className="admin-nav-card__title">Messages</h3>
                        <p className="admin-nav-card__text">View and manage contact form submissions</p>
                        {stats.unread > 0 && (
                            <span className="admin-nav-card__badge">{stats.unread} unread</span>
                        )}
                    </Link>

                    <Link to="/admin/projects" className="admin-nav-card">
                        <span className="admin-nav-card__icon">🗂️</span>
                        <h3 className="admin-nav-card__title">Projects</h3>
                        <p className="admin-nav-card__text">Add, edit and delete portfolio projects</p>
                    </Link>

                    <Link to="/admin/services" className="admin-nav-card">
                        <span className="admin-nav-card__icon">⚙️</span>
                        <h3 className="admin-nav-card__title">Services</h3>
                        <p className="admin-nav-card__text">Manage your DevOps service offerings</p>
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default AdminDashboard;
