from src.models.log_model import Log
from src.config.database import db

def registrar_log(accion, descripcion):
    log = Log(accion=accion, descripcion=descripcion)
    db.session.add(log)
    db.session.commit()