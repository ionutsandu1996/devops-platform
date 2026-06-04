import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, markAsRead } from '../api/index.js';
import './AdminMessages.css';

function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getMessages();
                setMessages(res.data);
            } catch (err) {
                setError('Failed to load messages.');
                console.error('Error fetching messages:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            // Update the local state without refetching from the server
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === id ? { ...msg, is_read: true } : msg
                )
            );
        } catch (err) {
            console.error('Error marking message as read:', err.message);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error)   return <div className="error">{error}</div>;

    const unreadCount = messages.filter((m) => !m.is_read).length;

    return (
        <main className="admin-messages">
            <div className="admin-messages__container">

                {/* ── HEADER ───────────────────────────────────── */}
                <div className="admin-messages__header">
                    <div>
                        <h1 className="admin-messages__title">Messages</h1>
                        <p className="admin-messages__subtitle">
                            {unreadCount > 0
                                ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                                : 'All messages read'}
                        </p>
                    </div>
                    <Link to="/admin" className="btn-secondary">← Back to Dashboard</Link>
                </div>

                {/* ── MESSAGES LIST ────────────────────────────── */}
                {messages.length === 0 ? (
                    <div className="admin-messages__empty">
                        <p>No messages yet.</p>
                    </div>
                ) : (
                    <div className="admin-messages__list">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-card ${!msg.is_read ? 'message-card--unread' : ''}`}
                            >
                                <div className="message-card__header">
                                    <div className="message-card__meta">
                                        <span className="message-card__name">{msg.name}</span>
                                        <span className="message-card__email">{msg.email}</span>
                                        {!msg.is_read && (
                                            <span className="message-card__badge">New</span>
                                        )}
                                    </div>
                                    <div className="message-card__right">
                                        <span className="message-card__date">
                                            {new Date(msg.created_at).toLocaleDateString('en-GB', {
                                                day:   '2-digit',
                                                month: 'short',
                                                year:  'numeric',
                                            })}
                                        </span>
                                        {!msg.is_read && (
                                            <button
                                                className="message-card__read-btn"
                                                onClick={() => handleMarkAsRead(msg.id)}
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {msg.subject && (
                                    <p className="message-card__subject">{msg.subject}</p>
                                )}

                                <p className="message-card__body">{msg.message}</p>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </main>
    );
}

export default AdminMessages;