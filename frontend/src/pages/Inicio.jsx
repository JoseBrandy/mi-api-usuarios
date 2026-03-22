export default function Inicio() {
    return (
        <div className="inicio-container">
            <h1 className="inicio-titulo">👋 Bienvenido al Dashboard</h1>
            <p className="inicio-subtitulo">Gestioná usuarios, tareas y categorías desde un solo lugar.</p>
            <div className="inicio-cards">
                <div className="inicio-card">
                    <span className="inicio-icon">👥</span>
                    <h3>Usuarios</h3>
                    <p>Administrá los usuarios del sistema</p>
                </div>
                <div className="inicio-card">
                    <span className="inicio-icon">✅</span>
                    <h3>Tareas</h3>
                    <p>Gestioná las tareas de cada usuario</p>
                </div>
                <div className="inicio-card">
                    <span className="inicio-icon">🏷️</span>
                    <h3>Categorías</h3>
                    <p>Organizá las tareas por categorías</p>
                </div>
                <div className="inicio-card">
                    <span className="inicio-icon">📋</span>
                    <h3>Logs</h3>
                    <p>Revisá la actividad reciente del sistema</p>
                </div>
            </div>
        </div>
    );
}