import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Inicio from './pages/Inicio';
import Usuarios from './pages/Usuarios';
import Tareas from './pages/Tareas';
import Categorias from './pages/Categorias';
import Logs from './pages/Logs';
import './App.css';

export default function App() {
    return (
        <BrowserRouter>
            <div className="layout">
                <Sidebar />
                <main className="main-content" style={{ marginLeft: 240 }}>
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/tareas" element={<Tareas />} />
                        <Route path="/categorias" element={<Categorias />} />
                        <Route path="/logs" element={<Logs />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}