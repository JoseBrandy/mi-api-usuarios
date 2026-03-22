import { useState, useEffect, useRef } from 'react';
import { getUsuarios, getTareas, crearTarea, actualizarTarea, eliminarTarea } from '../services/api';
import { getCategorias, agregarCategoriaATarea, eliminarCategoriaDetarea } from '../services/api';
import Modal from '../components/Modal';

export default function Tareas() {
    const [search, setSearch] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [tareas, setTareas] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [toast, setToast] = useState(null);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const searchTimeout = useRef(null);

    const [modalTarea, setModalTarea] = useState(false);
    const [editTareaId, setEditTareaId] = useState(null);
    const [editTitulo, setEditTitulo] = useState('');
    const [editDescripcion, setEditDescripcion] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [modalCategorias, setModalCategorias] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

    useEffect(() => {
        if (search.length < 2) { setUsuarios([]); return; }
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            const res = await getUsuarios(1, 5, search);
            setUsuarios(res.data.usuarios);
            setMostrarSugerencias(true);
        }, 400);
    }, [search]);

    useEffect(() => {
        if (usuarioSeleccionado) cargarTareas();
    }, [usuarioSeleccionado]);

    async function cargarTareas() {
        try {
            const res = await getTareas(usuarioSeleccionado.id);
            setTareas(res.data);
        } catch (e) {
            mostrarToast('Error al cargar tareas', 'error');
        }
    }

    function mostrarToast(msg, tipo = 'success') {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 3000);
    }

    function seleccionarUsuario(usuario) {
        setUsuarioSeleccionado(usuario);
        setSearch(usuario.nombre);
        setUsuarios([]);
        setMostrarSugerencias(false);
    }

    async function handleCrearTarea() {
        if (!usuarioSeleccionado) { mostrarToast('Seleccioná un usuario', 'error'); return; }
        if (!titulo) { mostrarToast('El título es obligatorio', 'error'); return; }
        try {
            await crearTarea(usuarioSeleccionado.id, { titulo, descripcion });
            setTitulo('');
            setDescripcion('');
            mostrarToast('Tarea creada');
            cargarTareas();
        } catch (e) {
            mostrarToast('Error al crear tarea', 'error');
        }
    }

    async function handleToggleCompletada(tarea) {
        try {
            await actualizarTarea(usuarioSeleccionado.id, tarea.id, { completada: !tarea.completada });
            mostrarToast(tarea.completada ? 'Tarea pendiente' : 'Tarea completada');
            cargarTareas();
        } catch (e) {
            mostrarToast('Error al actualizar', 'error');
        }
    }

    async function handleEliminarTarea(tareaId) {
        try {
            await eliminarTarea(usuarioSeleccionado.id, tareaId);
            mostrarToast('Tarea eliminada');
            cargarTareas();
        } catch (e) {
            mostrarToast('Error al eliminar', 'error');
        }
    }


    function abrirEditarTarea(tarea) {
        setEditTareaId(tarea.id);
        setEditTitulo(tarea.titulo);
        setEditDescripcion(tarea.descripcion || '');
        setModalTarea(true);
    }

    async function handleActualizarTarea() {
        try {
            await actualizarTarea(usuarioSeleccionado.id, editTareaId, {
                titulo: editTitulo,
                descripcion: editDescripcion
            });
            setModalTarea(false);
            mostrarToast('Tarea actualizada');
            cargarTareas();
        } catch (e) {
            mostrarToast('Error al actualizar tarea', 'error');
        }
    }



    useEffect(() => {
        cargarCategorias();
    }, []);

    async function cargarCategorias() {
        const res = await getCategorias();
        setCategorias(res.data);
    }

    function abrirModalCategorias(tarea) {
        setTareaSeleccionada(tarea);
        setModalCategorias(true);
    }

    async function handleAgregarCategoria(categoriaId) {
        try {
            const res = await agregarCategoriaATarea(tareaSeleccionada.id, categoriaId);
            setTareaSeleccionada(res.data);
            mostrarToast('Categoría agregada');
            cargarTareas();
        } catch (e) {
            mostrarToast(e.response?.data?.error || 'Error al agregar', 'error');
        }
    }

    async function handleEliminarCategoria(categoriaId) {
        try {
            const res = await eliminarCategoriaDetarea(tareaSeleccionada.id, categoriaId);
            setTareaSeleccionada(res.data);
            mostrarToast('Categoría eliminada');
            cargarTareas();
        } catch (e) {
            mostrarToast('Error al eliminar categoría', 'error');
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

            {/* Buscador de usuario */}
            <div className="card">
                <h2>👤 Buscar usuario</h2>
                <div style={{ position: 'relative' }}>
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setUsuarioSeleccionado(null); }}
                        placeholder="🔍 Buscá por nombre o email..."
                        style={{ width: '100%' }}
                        onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                    />
                    {mostrarSugerencias && usuarios.length > 0 && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: '#112240', border: '1px solid #1d3557',
                            borderRadius: 6, zIndex: 100, marginTop: 4
                        }}>
                            {usuarios.map(u => (
                                <div
                                    key={u.id}
                                    onClick={() => seleccionarUsuario(u)}
                                    style={{
                                        padding: '10px 14px', cursor: 'pointer',
                                        borderBottom: '1px solid #1d3557',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#1d3557'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ color: '#ccd6f6', fontWeight: 600, pointerEvents: 'none' }}>{u.nombre}</div>
                                    <div style={{ color: '#8892b0', fontSize: '0.85rem', pointerEvents: 'none' }}>{u.email}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {usuarioSeleccionado && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: '#1d3557', borderRadius: 6, fontSize: '0.9rem', color: '#00b894' }}>
                        ✅ Usuario seleccionado: <strong>{usuarioSeleccionado.nombre}</strong>
                    </div>
                )}
            </div>

            {/* Crear tarea */}
            {usuarioSeleccionado && (
                <div className="card">
                    <h2>➕ Nueva tarea</h2>
                    <div className="form-row">
                        <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" />
                        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" />
                        <button className="btn-primary" onClick={handleCrearTarea}>Crear</button>
                    </div>
                </div>
            )}

            {/* Lista de tareas */}
            {usuarioSeleccionado && (
                <div className="card">
                    <h2>✅ Tareas <span style={{ fontSize: '0.85rem', color: '#8892b0', fontWeight: 'normal' }}>({tareas.length} en total)</span></h2>
                    {tareas.length === 0 ? (
                        <p className="empty">No hay tareas para este usuario</p>
                    ) : (
                        tareas.map(t => (
                            <div key={t.id} className="tarea-item">
                                <div>
                                    <span className={t.completada ? 'completada' : ''} style={{ fontSize: '0.95rem' }}>
                                        {t.completada ? '✅' : '⏳'} {t.titulo}
                                    </span>
                                    {t.descripcion && <div style={{ fontSize: '0.8rem', color: '#8892b0', marginTop: 4 }}>{t.descripcion}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="btn-warning btn-sm" onClick={() => abrirEditarTarea(t)}>✏️</button>
                                    <button className="btn-success btn-sm" onClick={() => handleToggleCompletada(t)}>
                                        {t.completada ? '↩️' : '✅'}
                                    </button>
                                    <button className="btn-warning btn-sm" onClick={() => abrirModalCategorias(t)}>🏷️</button>
                                    <button className="btn-danger btn-sm" onClick={() => handleEliminarTarea(t.id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            {modalTarea && (
                <Modal titulo="✏️ Editar tarea" onCerrar={() => setModalTarea(false)} onGuardar={handleActualizarTarea}>
                    <div className="form-row" style={{ flexDirection: 'column' }}>
                        <input value={editTitulo} onChange={e => setEditTitulo(e.target.value)} placeholder="Título" />
                        <input value={editDescripcion} onChange={e => setEditDescripcion(e.target.value)} placeholder="Descripción" />
                    </div>
                </Modal>
            )}

            {modalCategorias && tareaSeleccionada && (
                <Modal titulo={`🏷️ Categorías de "${tareaSeleccionada.titulo}"`} onCerrar={() => setModalCategorias(false)} onGuardar={() => setModalCategorias(false)}>
                    <div>
                        <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: 12 }}>Categorías asignadas:</p>
                        {tareaSeleccionada.categorias.length === 0 ? (
                            <p className="empty">Sin categorías</p>
                        ) : (
                            tareaSeleccionada.categorias.map(c => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#1d3557', borderRadius: 6, marginBottom: 6 }}>
                                    <span style={{ color: '#ccd6f6', fontSize: '0.9rem' }}>🏷️ {c.nombre}</span>
                                    <button className="btn-danger btn-sm" onClick={() => handleEliminarCategoria(c.id)}>✕</button>
                                </div>
                            ))
                        )}
                        <p style={{ color: '#8892b0', fontSize: '0.9rem', margin: '12px 0 8px' }}>Agregar categoría:</p>
                        {categorias.filter(c => !tareaSeleccionada.categorias.find(tc => tc.id === c.id)).map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#0d1b2a', borderRadius: 6, marginBottom: 6 }}>
                                <span style={{ color: '#8892b0', fontSize: '0.9rem' }}>{c.nombre}</span>
                                <button className="btn-success btn-sm" onClick={() => handleAgregarCategoria(c.id)}>+ Agregar</button>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </div>
    );
}