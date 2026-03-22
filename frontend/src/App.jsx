import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Usuarios from './pages/Usuarios';
import Logs from './pages/Logs';
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <header style={{ background: '#2c3e50', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem' }}>🧑‍💻 API de Usuarios</h1>
                <nav style={{ display: 'flex', gap: 20 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>👥 Usuarios</Link>
                    <Link to="/logs" style={{ color: 'white', textDecoration: 'none' }}>📋 Logs</Link>
                </nav>
            </header>

            <div style={{ maxWidth: 1000, margin: '30px auto', padding: '0 20px' }}>
                <Routes>
                    <Route path="/" element={<Usuarios />} />
                    <Route path="/logs" element={<Logs />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}