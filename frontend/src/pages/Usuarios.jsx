import { useState, useEffect } from 'react';
import { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, getTareas, crearTarea, actualizarTarea, eliminarTarea } from '../services/api';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [paginas, setPaginas] = useState(1);
    const [search, setSearch] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState(null);
    const [tareas, setTareas] = useState({});
    const [tareasVisibles, setTareasVisibles] = useState({});

    useEffect(() => {
        cargarUsuarios(pagina, search);
    }, [pagina, search]);

    async function cargarUsuarios(page, searchTerm) {
        try {
            const res = await getUsuarios(page, 5, searchTerm);
            setUsuarios(res.data.usuarios);
            setTotal(res.data.total);
            setPaginas(res.data.paginas);
        } catch (e) {
            mostrarToast('Error al cargar usuarios', 'error');
        }
    }

    function mostrarToast(msg, tipo = 'success') {
        setToast({ msg, tipo });
        setTimeout(() => setToast(null), 3000);
    }

    async function handleCrearUsuario() {
        if (!nombre || !email) { mostrarToast('Completá todos los campos', 'error'); return; }
        try {
            await crearUsuario({ nombre, email });
            setNombre('');
            setEmail('');
            mostrarToast('Usuario creado');
            cargarUsuarios(pagina, search);
        } catch (e) {
            mostrarToast(e.response?.data?.error || 'Error al crear usuario', 'error');
        }
    }

    async function handleEliminarUsuario(id) {
        try {
            await eliminarUsuario(id);
            mostrarToast('Usuario eliminado');
            cargarUsuarios(pagina, search);
        } catch (e) {
            mostrarToast('Error al eliminar', 'error');
        }
    }

    async function toggleTareas(usuarioId) {
        const visible = tareasVisibles[usuarioId];
        setTareasVisibles(prev => ({ ...prev, [usuarioId]: !visible }));
        if (!visible) {
            const res = await getTareas(usuarioId);
            setTareas(prev => ({ ...prev, [usuarioId]: res.data }));
        }
    }

    async function handleCrearTarea(usuarioId, titulo, descripcion) {
        if (!titulo) { mostrarToast('El título es obligatorio', 'error'); return; }
        try {
            await crearTarea(usuarioId, { titulo, descripcion });
            mostrarToast('Tarea creada');
            const res = await getTareas(usuarioId);
            setTareas(prev => ({ ...prev, [usuarioId]: res.data }));
        } catch (e) {
            mostrarToast('Error al crear tarea', 'error');
        }
    }

    async function handleToggleCompletada(usuarioId, tarea) {
        await actualizarTarea(usuarioId, tarea.id, { completada: !tarea.completada });
        const res = await getTareas(usuarioId);
        setTareas(prev => ({ ...prev, [usuarioId]: res.data }));
        mostrarToast(tarea.completada ? 'Tarea pendiente' : 'Tarea completada');
    }

    async function handleEliminarTarea(usuarioId, tareaId) {
        await eliminarTarea(usuarioId, tareaId);
        const res = await getTareas(usuarioId);
        setTareas(prev => ({ ...prev, [usuarioId]: res.data }));
        mostrarToast('Tarea eliminada');
    }

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: 30, right: 30, padding: '14px 20px',
                    borderRadius: 8, color: 'white', zIndex: 1000,
                    background: toast.tipo === 'error' ? '#e74c3c' : '#2ecc71'
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Crear usuario */}
            <div className="card">
                <h2>➕ Crear usuario</h2>
                <div className="form-row">
                    <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
                    <button className="btn-primary" onClick={handleCrearUsuario}>Crear</button>
                </div>
            </div>

            {/* Lista usuarios */}
            <div className="card">
                <h2>👥 Usuarios <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 'normal' }}>({total} en total)</span></h2>
                <input
                    placeholder="🔍 Buscar por nombre o email..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPagina(1); }}
                    style={{ maxWidth: 400, marginBottom: 16 }}
                />
                {usuarios.map(u => (
                    <div key={u.id} className="usuario-item">
                        <div className="usuario-header">
                            <div>
                                <div className="usuario-info">{u.nombre}</div>
                                <div className="usuario-email">{u.email}</div>
                            </div>
                            <div className="usuario-actions">
                                <button className="btn-primary btn-sm" onClick={() => toggleTareas(u.id)}>📋 Tareas</button>
                                <button className="btn-danger btn-sm" onClick={() => handleEliminarUsuario(u.id)}>🗑️ Eliminar</button>
                            </div>
                        </div>

                        {tareasVisibles[u.id] && (
                            <div className="tareas-container" style={{ display: 'block' }}>
                                <TareaForm usuarioId={u.id} onCrear={handleCrearTarea} />
                                {(tareas[u.id] || []).map(t => (
                                    <div key={t.id} className="tarea-item">
                                        <span className={t.completada ? 'completada' : ''}>{t.titulo} {t.completada ? '✅' : '⏳'}</span>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn-success btn-sm" onClick={() => handleToggleCompletada(u.id, t)}>{t.completada ? '↩️' : '✅'}</button>
                                            <button className="btn-danger btn-sm" onClick={() => handleEliminarTarea(u.id, t.id)}>🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* Paginacion */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                    <button className="btn-primary btn-sm" onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>← Anterior</button>
                    <span style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Página {pagina} de {paginas}</span>
                    <button className="btn-primary btn-sm" onClick={() => setPagina(p => p + 1)} disabled={pagina === paginas}>Siguiente →</button>
                </div>
            </div>
        </div>
    );
}

function TareaForm({ usuarioId, onCrear }) {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    return (
        <div className="form-row" style={{ marginBottom: 10 }}>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nueva tarea" />
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" />
            <button className="btn-success btn-sm" onClick={() => { onCrear(usuarioId, titulo, descripcion); setTitulo(''); setDescripcion(''); }}>➕ Agregar</button>
        </div>
    );
}