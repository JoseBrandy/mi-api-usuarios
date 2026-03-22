import { useState, useEffect } from 'react';
import { getLogs } from '../services/api';

export default function Logs() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        cargarLogs();
    }, []);

    async function cargarLogs() {
        try {
            const res = await getLogs();
            setLogs(res.data);
        } catch (e) {
            console.error('Error al cargar logs');
        }
    }

    return (
        <div className="card">
            <h2>📋 Actividad reciente</h2>
            <button className="btn-primary" onClick={cargarLogs} style={{ marginBottom: 16 }}>Actualizar</button>
            {logs.length === 0 ? (
                <p className="empty">No hay actividad</p>
            ) : (
                logs.map(l => (
                    <div key={l.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '8px 12px',
                        borderBottom: '1px solid #f0f2f5'
                    }}>
                        <span style={{ fontSize: '0.9rem' }}>{l.descripcion}</span>
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>{l.fecha}</span>
                    </div>
                ))
            )}
        </div>
    );
}