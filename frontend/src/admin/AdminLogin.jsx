import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/index.js';
import './AdminLogin.css';

function AdminLogin() {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState(null);

    // useNavigate: programmatic navigation
    // After login, we redirect the user to /admin
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await login(email, password);

            // Save the JWT token in localStorage
            // The api/index.js interceptor will attach it to every request
            localStorage.setItem('adminToken', res.data.token);

            // Redirect to admin dashboard
            navigate('/admin');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error('Login error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login">
            <div className="admin-login__card">

                <div className="admin-login__header">
                    <h1 className="admin-login__title">Admin Panel</h1>
                    <p className="admin-login__subtitle">Sign in to manage your website</p>
                </div>

                <form className="admin-login__form" onSubmit={handleSubmit}>

                    <div className="admin-login__field">
                        <label className="admin-login__label">Email</label>
                        <input
                            className="admin-login__input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@email.com"
                            required
                        />
                    </div>

                    <div className="admin-login__field">
                        <label className="admin-login__label">Password</label>
                        <input
                            className="admin-login__input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="admin-login__error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="admin-login__btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

            </div>
        </main>
    );
}

export default AdminLogin;