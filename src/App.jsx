import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Leads from './pages/admin/Leads';
import Reviews from './pages/admin/Reviews';

function App() {
  return (
    <AuthProvider>
      <Router basename="/suhail-cars">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="leads" element={<Leads />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
