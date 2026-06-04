import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllServices, createService, updateService, deleteService } from '../api/index.js';
import './AdminServices.css';

const EMPTY_FORM = {
    title:       '',
    description: '',
    icon:        '',
    price_from:  '',
    is_active:   true,
    sort_order:  0,
};

function AdminServices() {
    const [services,    setServices]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [showModal,   setShowModal]   = useState(false);
    const [editService, setEditService] = useState(null);
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [saving,      setSaving]      = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await getAllServices();
            setServices(res.data);
        } catch (err) {
            setError('Failed to load services.');
            console.error('Error fetching services:', err.message);
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
        setEditService(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setEditService(service);
        setForm({
            title:       service.title,
            description: service.description,
            icon:        service.icon       || '',
            price_from:  service.price_from || '',
            is_active:   service.is_active,
            sort_order:  service.sort_order || 0,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await deleteService(id);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Error deleting service:', err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editService) {
                const res = await updateService(editService.id, form);
                setServices((prev) =>
                    prev.map((s) => s.id === editService.id ? res.data : s)
                );
            } else {
                const res = await createService(form);
                setServices((prev) => [...prev, res.data]);
            }
            setShowModal(false);
        } catch (err) {
            console.error('Error saving service:', err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error)   return <div className="error">{error}</div>;

    return (
        <main className="admin-services">
            <div className="admin-services__container">

                {/* ── HEADER ───────────────────────────────────── */}
                <div className="admin-services__header">
                    <div>
                        <h1 className="admin-services__title">Services</h1>
                        <p className="admin-services__subtitle">
                            {services.length} service{services.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="admin-services__actions">
                        <Link to="/admin" className="btn-secondary">← Dashboard</Link>
                        <button className="btn-primary" onClick={handleAdd}>+ Add Service</button>
                    </div>
                </div>

                {/* ── SERVICES LIST ────────────────────────────── */}
                {services.length === 0 ? (
                    <div className="admin-services__empty">
                        <p>No services yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="admin-services__list">
                        {services.map((service) => (
                            <div key={service.id} className="service-row">
                                <div className="service-row__info">
                                    <div className="service-row__header">
                                        <span className="service-row__icon">{service.icon || '⚙️'}</span>
                                        <h3 className="service-row__title">{service.title}</h3>
                                        {!service.is_active && (
                                            <span className="service-row__inactive">Inactive</span>
                                        )}
                                        {service.price_from && (
                                            <span className="service-row__price">
                                                From €{service.price_from}
                                            </span>
                                        )}
                                    </div>
                                    <p className="service-row__desc">{service.description}</p>
                                </div>
                                <div className="service-row__buttons">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(service)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(service.id)}
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
                                {editService ? 'Edit Service' : 'Add Service'}
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
                                    placeholder="Service title"
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
                                    placeholder="Service description"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="modal__row">
                                <div className="modal__field">
                                    <label className="modal__label">Icon (emoji)</label>
                                    <input
                                        className="modal__input"
                                        type="text"
                                        name="icon"
                                        value={form.icon}
                                        onChange={handleChange}
                                        placeholder="🚀"
                                    />
                                </div>
                                <div className="modal__field">
                                    <label className="modal__label">Price From (€)</label>
                                    <input
                                        className="modal__input"
                                        type="number"
                                        name="price_from"
                                        value={form.price_from}
                                        onChange={handleChange}
                                        placeholder="150"
                                    />
                                </div>
                                <div className="modal__field">
                                    <label className="modal__label">Sort Order</label>
                                    <input
                                        className="modal__input"
                                        type="number"
                                        name="sort_order"
                                        value={form.sort_order}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="modal__field modal__field--checkbox">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={handleChange}
                                    className="modal__checkbox"
                                />
                                <label htmlFor="is_active" className="modal__checkbox-label">
                                    Active (visible on public site)
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
                                    {saving ? 'Saving...' : editService ? 'Save Changes' : 'Add Service'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}

export default AdminServices;