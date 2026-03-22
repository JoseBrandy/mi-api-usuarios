import { Link, useLocation } from 'react-router-dom';

const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/tareas', label: 'Tareas', icon: '✅' },
    { path: '/categorias', label: 'Categorías', icon: '🏷️' },
    { path: '/logs', label: 'Logs', icon: '📋' },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <span className="logo-icon">🧑‍💻</span>
                <span className="logo-text">API Dashboard</span>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}