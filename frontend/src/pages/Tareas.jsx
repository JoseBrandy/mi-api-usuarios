import { useState, useEffect, useRef } from 'react';
import { getUsuarios, getTareas, crearTarea, actualizarTarea, eliminarTarea } from '../services/api';

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
                                    <button className="btn-success btn-sm" onClick={() => handleToggleCompletada(t)}>
                                        {t.completada ? '↩️' : '✅'}
                                    </button>
                                    <button className="btn-danger btn-sm" onClick={() => handleEliminarTarea(t.id)}>🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}