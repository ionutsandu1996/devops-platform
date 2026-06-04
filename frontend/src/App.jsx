import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminMessages from './admin/AdminMessages';
import AdminProjects from './admin/AdminProjects';
import AdminServices from './admin/AdminServices';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return <Navigate to="/admin/login" replace />;
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/"               element={<Home />}                                          />
                <Route path="/services"       element={<Services />}                                      />
                <Route path="/projects"       element={<Projects />}                                      />
                <Route path="/about"          element={<About />}                                         />
                <Route path="/contact"        element={<Contact />}                                       />
                <Route path="/admin/login"    element={<AdminLogin />}                                    />
                <Route path="/admin"          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
                <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
                <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
                <Route path="*"               element={<Navigate to="/" replace />}                       />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;