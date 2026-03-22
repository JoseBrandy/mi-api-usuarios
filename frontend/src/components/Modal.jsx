import { createPortal } from 'react-dom';

export default function Modal({ titulo, onCerrar, onGuardar, children }) {
    return createPortal(
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: '#112240', border: '1px solid #1d3557',
                borderRadius: 10, padding: 24, width: '100%', maxWidth: 400
            }}>
                <h3 style={{ color: '#ccd6f6', marginBottom: 16 }}>{titulo}</h3>
                {children}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                    <button className="btn-primary" onClick={onCerrar}>Cancelar</button>
                    <button className="btn-success" onClick={onGuardar}>Guardar</button>
                </div>
            </div>
        </div>,
        document.body
    );
}