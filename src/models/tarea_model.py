from src.config.database import db
from src.models.categoria_model import tarea_categoria

class Tarea(db.Model):
    __tablename__ = 'tareas'

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(255), nullable=True)
    completada = db.Column(db.Boolean, default=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    categorias = db.relationship('Categoria', secondary=tarea_categoria, lazy=True, backref=db.backref('tareas', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descripcion': self.descripcion,
            'completada': self.completada,
            'usuario_id': self.usuario_id,
            'categorias': [c.to_dict() for c in self.categorias]
        }