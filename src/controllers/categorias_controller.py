from flask import jsonify, request
from src.models.categoria_model import Categoria
from src.models.tarea_model import Tarea
from src.config.database import db

def get_categorias():
    categorias = Categoria.query.all()
    return jsonify([c.to_dict() for c in categorias]), 200

def crear_categoria():
    data = request.get_json()

    if not data or 'nombre' not in data:
        return jsonify({'error': 'El campo nombre es obligatorio'}), 400

    nueva_categoria = Categoria(
        nombre=data['nombre'],
        descripcion=data.get('descripcion', None)
    )

    db.session.add(nueva_categoria)
    db.session.commit()

    return jsonify(nueva_categoria.to_dict()), 201

def agregar_categoria_a_tarea(tarea_id, categoria_id):
    tarea = Tarea.query.get(tarea_id)

    if tarea is None:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    categoria = Categoria.query.get(categoria_id)

    if categoria is None:
        return jsonify({'error': 'Categoria no encontrada'}), 404

    if categoria in tarea.categorias:
        return jsonify({'error': 'La tarea ya tiene esa categoria'}), 400

    tarea.categorias.append(categoria)
    db.session.commit()

    return jsonify(tarea.to_dict()), 200

def eliminar_categoria_de_tarea(tarea_id, categoria_id):
    tarea = Tarea.query.get(tarea_id)

    if tarea is None:
        return jsonify({'error': 'Tarea no encontrada'}), 404

    categoria = Categoria.query.get(categoria_id)

    if categoria is None:
        return jsonify({'error': 'Categoria no encontrada'}), 404

    if categoria not in tarea.categorias:
        return jsonify({'error': 'La tarea no tiene esa categoria'}), 400

    tarea.categorias.remove(categoria)
    db.session.commit()

    return jsonify(tarea.to_dict()), 200