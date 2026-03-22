from flask import jsonify, request
from src.models.tarea_model import Tarea
from src.models.usuario_model import Usuario
from src.config.database import db

def get_tareas_por_usuario(usuario_id):
    usuario = Usuario.query.get(usuario_id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    tareas = Tarea.query.filter_by(usuario_id=usuario_id).all()
    return jsonify([t.to_dict() for t in tareas]), 200

def get_tarea_por_id(usuario_id, tarea_id):
    usuario = Usuario.query.get(usuario_id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    tarea = Tarea.query.filter_by(id=tarea_id, usuario_id=usuario_id).first()

    if tarea is None:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    return jsonify(tarea.to_dict()), 200

def crear_tarea(usuario_id):
    usuario = Usuario.query.get(usuario_id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()

    if not data or 'titulo' not in data:
        return jsonify({'error': 'El campo titulo es obligatorio'}), 400

    nueva_tarea = Tarea(
        titulo=data['titulo'],
        descripcion=data.get('descripcion', None),
        usuario_id=usuario_id
    )

    db.session.add(nueva_tarea)
    db.session.commit()

    return jsonify(nueva_tarea.to_dict()), 201

def actualizar_tarea(usuario_id, tarea_id):
    tarea = Tarea.query.filter_by(id=tarea_id, usuario_id=usuario_id).first()

    if tarea is None:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se enviaron datos'}), 400

    tarea.titulo = data.get('titulo', tarea.titulo)
    tarea.descripcion = data.get('descripcion', tarea.descripcion)
    tarea.completada = data.get('completada', tarea.completada)

    db.session.commit()

    return jsonify(tarea.to_dict()), 200

def eliminar_tarea(usuario_id, tarea_id):
    tarea = Tarea.query.filter_by(id=tarea_id, usuario_id=usuario_id).first()

    if tarea is None:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    db.session.delete(tarea)
    db.session.commit()

    return jsonify({'mensaje': 'Tarea eliminada correctamente'}), 200