import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Usuarios
export const getUsuarios = (page = 1, perPage = 5, search = '') =>
    api.get(`/usuarios?page=${page}&per_page=${perPage}&search=${search}`);

export const crearUsuario = (data) =>
    api.post('/usuarios', data);

export const actualizarUsuario = (id, data) =>
    api.put(`/usuarios/${id}`, data);

export const eliminarUsuario = (id) =>
    api.delete(`/usuarios/${id}`);

// Tareas
export const getTareas = (usuarioId) =>
    api.get(`/usuarios/${usuarioId}/tareas`);

export const crearTarea = (usuarioId, data) =>
    api.post(`/usuarios/${usuarioId}/tareas`, data);

export const actualizarTarea = (usuarioId, tareaId, data) =>
    api.put(`/usuarios/${usuarioId}/tareas/${tareaId}`, data);

export const eliminarTarea = (usuarioId, tareaId) =>
    api.delete(`/usuarios/${usuarioId}/tareas/${tareaId}`);

// Logs
export const getLogs = () =>
    api.get('/logs');