from flask import Flask
from flask_cors import CORS
from src.config.database import db, init_db
from src.routes.usuarios_routes import usuarios_bp
from src.routes.tareas_routes import tareas_bp
from src.routes.categorias_routes import categorias_bp
from src.middlewares.error_handler import register_error_handlers

app = Flask(__name__)

# Inicializar base de datos
init_db(app)

# Habilitar CORS
CORS(app)

# Registrar rutas
app.register_blueprint(usuarios_bp)
app.register_blueprint(tareas_bp)
app.register_blueprint(categorias_bp)

# Registrar manejadores de error
register_error_handlers(app)

# Crear tablas si no existen
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return {'mensaje': '¡API de usuarios funcionando!'}