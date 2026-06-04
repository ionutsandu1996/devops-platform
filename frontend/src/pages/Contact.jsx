import { useState } from 'react';
import { submitContact } from '../api/index.js';
import './Contact.css';

function Contact() {
    const [form, setForm] = useState({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error,   setError]   = useState(null);

    // onChange handler — updates the correct field in the form state
    // e.target.name matches the name attribute on each input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await submitContact(form);
            setSuccess(true);
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError('Failed to send message. Please try again.');
            console.error('Error submitting contact form:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>

            {/* ── HEADER ─────────────────────────────────────────── */}
            <section className="page-header">
                <div className="page-header__container">
                    <h1 className="page-header__title">Contact</h1>
                    <p className="page-header__subtitle">
                        Have a project in mind? Let's talk.
                    </p>
                </div>
            </section>

            {/* ── CONTACT SECTION ────────────────────────────────── */}
            <section className="contact">
                <div className="contact__container">

                    {/* Left — info */}
                    <div className="contact__info">
                        <h2 className="contact__info-title">Let's Work Together</h2>
                        <p className="contact__info-text">
                            I'm available for freelance DevOps projects. Whether you need
                            a CI/CD pipeline, a Kubernetes deployment, or a full GitOps
                            setup — I can help.
                        </p>

                        <div className="contact__details">
                            <div className="contact__detail">
                                <span className="contact__detail-icon">📧</span>
                                <span className="contact__detail-text">ionutdanielsandu96@gmail.com</span>
                            </div>
                            <div className="contact__detail">
                                <span className="contact__detail-icon">📍</span>
                                <span className="contact__detail-text">Bucharest, Romania</span>
                            </div>
                            <div className="contact__detail">
                                <span className="contact__detail-icon">⏱️</span>
                                <span className="contact__detail-text">Response within 24 hours</span>
                            </div>
                        </div>

                        <div className="contact__social">
                            
                                <a href="https://github.com/ionutsandu1996"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact__social-link"
                            >
                                GitHub
                            </a>
                            
                                <a href="https://www.linkedin.com/in/ionuț-daniel-sandu-0b99a316b/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact__social-link"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="contact__form-wrapper">
                        {success ? (
                            <div className="contact__success">
                                <span className="contact__success-icon">✅</span>
                                <h3>Message sent!</h3>
                                <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => setSuccess(false)}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="contact__form" onSubmit={handleSubmit}>
                                <div className="contact__field">
                                    <label className="contact__label">Name *</label>
                                    <input
                                        className="contact__input"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div className="contact__field">
                                    <label className="contact__label">Email *</label>
                                    <input
                                        className="contact__input"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div className="contact__field">
                                    <label className="contact__label">Subject</label>
                                    <input
                                        className="contact__input"
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div className="contact__field">
                                    <label className="contact__label">Message *</label>
                                    <textarea
                                        className="contact__textarea"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your project..."
                                        rows={6}
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="contact__error">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    className="btn-primary contact__submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Contact;