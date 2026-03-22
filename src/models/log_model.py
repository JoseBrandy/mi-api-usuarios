from src.config.database import db
from datetime import datetime

class Log(db.Model):
    __tablename__ = 'logs'

    id = db.Column(db.Integer, primary_key=True)
    accion = db.Column(db.String(50), nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'accion': self.accion,
            'descripcion': self.descripcion,
            'fecha': self.fecha.strftime('%Y-%m-%d %H:%M:%S')
        }