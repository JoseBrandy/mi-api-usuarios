import { useState, useEffect } from 'react';
import { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../services/api';
import Modal from '../components/Modal';

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [toast, setToast] = useState(null);
    const [modalCategoria, setModalCategoria] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editNombre, setEditNombre] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');

    useEffect(() => {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        try {
            const res = await getCategorias();
            setCategorias(res.data);
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
            await crearCategoria({ nombre, descripcion });
            setNombre('');
            setDescripcion('');
            mostrarToast('Categoría creada');
            cargarCategorias();
        } catch (e) {
            mostrarToast(e.response?.data?.error || 'Error al crear', 'error');
        }
    }

    async function handleEliminarCategoria(id) {
        try {
            await eliminarCategoria(id);
            mostrarToast('Categoría eliminada');
            cargarCategorias();
        } catch (e) {
            mostrarToast('Error al eliminar', 'error');
        }
    }

    function abrirEditarCategoria(c) {
        setEditId(c.id);
        setEditNombre(c.nombre);
        setEditDescripcion(c.descripcion || '');
        setModalCategoria(true);
    }

    async function handleActualizarCategoria() {
        try {
            await actualizarCategoria(editId, { nombre: editNombre, descripcion: editDescripcion });
            setModalCategoria(false);
            mostrarToast('Categoría actualizada');
            cargarCategorias();
        } catch (e) {
            mostrarToast(e.response?.data?.error || 'Error al actualizar', 'error');
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
                                    <button className="btn-warning btn-sm" onClick={() => abrirEditarCategoria(c)}>✏️ Editar</button>
                                    <button className="btn-danger btn-sm" onClick={() => handleEliminarCategoria(c.id)}>🗑️ Eliminar</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal editar */}
            {modalCategoria && (
                <Modal titulo="✏️ Editar categoría" onCerrar={() => setModalCategoria(false)} onGuardar={handleActualizarCategoria}>
                    <div className="form-row" style={{ flexDirection: 'column' }}>
                        <input value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" />
                        <input value={editDescripcion} onChange={e => setEditDescripcion(e.target.value)} placeholder="Descripción" />
                    </div>
                </Modal>
            )}
        </div>
    );
}