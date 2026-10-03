import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, MessageSquare, Star, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname.startsWith(path);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const navLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/inventory', icon: Car, label: 'Inventory' },
        { to: '/admin/leads', icon: MessageSquare, label: 'Leads' },
        { to: '/admin/reviews', icon: Star, label: 'Reviews' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                        {currentUser && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{currentUser.email}</p>
                        )}
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map(({ to, icon: Icon, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(to)
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <Icon className="h-5 w-5 mr-3" />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-red-800/50 rounded-lg w-full transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-bold ml-2">Admin Dashboard</h1>
                </div>
                <div className="p-4 md:p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
