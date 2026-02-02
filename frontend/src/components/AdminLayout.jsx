import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    ShieldAlert,
    UserCircle,
    LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = ({ children }) => {
    const { logout } = useAuth();

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/traffic', icon: Activity, label: 'API Traffic' },
        { to: '/admin/suspicious', icon: ShieldAlert, label: 'Suspicious Activity' }
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">Vault Gate</h1>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700 space-y-2">
                    <NavLink
                        to="/admin/profile"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                ? 'bg-slate-700 text-white'
                                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                            }`
                        }
                    >
                        <UserCircle className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                    </NavLink>
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
