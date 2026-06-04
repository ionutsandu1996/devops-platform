// App.jsx — Root component of the React application
// Defines all routes using React Router DOM
// BrowserRouter enables client-side navigation without full page reloads

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import Home     from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About    from './pages/About';
import Contact  from './pages/Contact';

// Admin pages
import AdminLogin     from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminMessages  from './admin/AdminMessages';
import AdminProjects  from './admin/AdminProjects';
import AdminServices  from './admin/AdminServices';

// Shared components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── PROTECTED ROUTE ───────────────────────────────────────────────────────────
// A wrapper component that checks if the admin is logged in
// If not, redirects to /admin/login
// Usage: <ProtectedRoute> <AdminDashboard /> </ProtectedRoute>
const ProtectedRoute = ({ children }) => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('adminToken');

    // If no token, redirect to login page
    // Navigate replaces the current history entry — no going back with browser back button
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // Token exists — render the child component
    return children;
};

function App() {
    return (
        // BrowserRouter: enables client-side routing
        // Without it, every link click would reload the entire page from the server
        // With it, React handles navigation in the browser — this is what makes it a SPA
        <BrowserRouter>

            {/* Navbar is outside Routes so it renders on every page */}
            <Navbar />

            {/* Routes: renders the first Route that matches the current URL */}
            <Routes>

                {/* ── PUBLIC ROUTES ────────────────────────────────────── */}
                <Route path="/"         element={<Home />}     />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about"    element={<About />}    />
                <Route path="/contact"  element={<Contact />}  />

                {/* ── ADMIN ROUTES ─────────────────────────────────────── */}
                {/* Login page — public, no protection needed */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected admin routes — redirect to login if no token */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin/messages" element={
                    <ProtectedRoute>
                        <AdminMessages />
                    </ProtectedRoute>
                } />

                <Route path="/admin/projects" element={
                    <ProtectedRoute>
                        <AdminProjects />
                    </ProtectedRoute>
                } />

                <Route path="/admin/services" element={
                    <ProtectedRoute>
                        <AdminServices />
                    </ProtectedRoute>
                } />

                {/* ── 404 ──────────────────────────────────────────────── */}
                {/* If no route matches, redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>

            {/* Footer is outside Routes so it renders on every page */}
            <Footer />

        </BrowserRouter>
    );
}

export default App;