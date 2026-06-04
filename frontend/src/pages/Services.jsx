import { useEffect, useState } from 'react';
import { getServices } from '../api/index.js';
import './Services.css';

function Services() {
    const [services, setServices] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await getServices();
                setServices(res.data);
            } catch (err) {
                setError('Failed to load services. Please try again later.');
                console.error('Error fetching services:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error)   return <div className="error">{error}</div>;

    return (
        <main>

            {/* ── HEADER ─────────────────────────────────────────── */}
            <section className="page-header">
                <div className="page-header__container">
                    <h1 className="page-header__title">Services</h1>
                    <p className="page-header__subtitle">
                        End-to-end DevOps solutions tailored to your team's needs
                    </p>
                </div>
            </section>

            {/* ── SERVICES GRID ──────────────────────────────────── */}
            <section className="services">
                <div className="services__container">
                    {services.length === 0 ? (
                        <p className="empty">No services available yet.</p>
                    ) : (
                        <div className="services__grid">
                            {services.map((service) => (
                                <div key={service.id} className="service-card">
                                    <div className="service-card__header">
                                        <span className="service-card__icon">
                                            {service.icon || '⚙️'}
                                        </span>
                                        {service.price_from && (
                                            <span className="service-card__price">
                                                From €{service.price_from}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="service-card__title">{service.title}</h3>
                                    <p className="service-card__text">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <section className="services-cta">
                <div className="services-cta__container">
                    <h2 className="services-cta__title">Not sure what you need?</h2>
                    <p className="services-cta__subtitle">
                        Let's talk. I'll help you figure out the best approach for your stack.
                    </p>
                    <a href="/contact" className="btn-primary">Book a Free Consultation</a>
                </div>
            </section>

        </main>
    );
}

export default Services;