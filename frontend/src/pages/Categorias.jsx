import { useState, useEffect } from 'react';
import { getLogs } from '../services/api';

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        try {
            const res = await fetch('http://localhost:3000/categorias');
            const data = await res.json();
            setCategorias(data);
        } catch (e) {
            mostrarToast('Error al cargar categorías', 'error');
        }
    }

    function mostrarToast(msg, tipo = 'success') {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 3000);
    }

    async function handleCrearCategoria() {
        if (!nombre) { mostrarToast('El nombre es obligatorio', 'error'); return; }
        try {
            const res = await fetch('http://localhost:3000/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion })
            });
            const data = await res.json();
            if (!res.ok) { mostrarToast(data.error, 'error'); return; }
            setNombre('');
            setDescripcion('');
            mostrarToast('Categoría creada');
            cargarCategorias();
        } catch (e) {
            mostrarToast('Error al crear categoría', 'error');
        }
    }

    async function handleEliminarCategoria(id) {
        try {
            await fetch(`http://localhost:3000/categorias/${id}`, { method: 'DELETE' });
            mostrarToast('Categoría eliminada');
            cargarCategorias();
        } catch (e) {
            mostrarToast('Error al eliminar', 'error');
        }
    }

    return (
        <div>
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 30, right: 30, padding: '14px 20px',
                    borderRadius: 8, color: 'white', zIndex: 1000,
                    background: toast.tipo === 'error' ? '#e74c3c' : '#00b894'
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Crear categoria */}
            <div className="card">
                <h2>➕ Nueva categoría</h2>
                <div className="form-row">
                    <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
                    <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" />
                    <button className="btn-primary" onClick={handleCrearCategoria}>Crear</button>
                </div>
            </div>

            {/* Lista categorias */}
            <div className="card">
                <h2>🏷️ Categorías <span style={{ fontSize: '0.85rem', color: '#8892b0', fontWeight: 'normal' }}>({categorias.length} en total)</span></h2>
                {categorias.length === 0 ? (
                    <p className="empty">No hay categorías</p>
                ) : (
                    categorias.map(c => (
                        <div key={c.id} className="usuario-item">
                            <div className="usuario-header">
                                <div>
                                    <div className="usuario-info">{c.nombre}</div>
                                    {c.descripcion && <div className="usuario-email">{c.descripcion}</div>}
                                </div>
                                <div className="usuario-actions">
                                    <button className="btn-danger btn-sm" onClick={() => handleEliminarCategoria(c.id)}>🗑️ Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}