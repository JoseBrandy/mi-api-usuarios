from flask import jsonify, request
from sqlalchemy import or_
from src.models.usuario_model import Usuario
from src.config.database import db


def get_usuarios():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    search = request.args.get('search', '', type=str)

    query = Usuario.query
    if search:
        query = query.filter(
            or_(
                Usuario.nombre.ilike(f'%{search}%'),
                Usuario.email.ilike(f'%{search}%')
            )
        )

    paginacion = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'usuarios': [u.to_dict() for u in paginacion.items],
        'total': paginacion.total,
        'pagina': paginacion.page,
        'por_pagina': paginacion.per_page,
        'paginas': paginacion.pages
    }), 200

def get_usuario_por_id(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    return jsonify(usuario.to_dict()), 200

def crear_usuario():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No se enviaron datos'}), 400

    if 'nombre' not in data or 'email' not in data:
        return jsonify({'error': 'Los campos nombre y email son obligatorios'}), 400

    nuevo_usuario = Usuario(
        nombre=data['nombre'],
        email=data['email']
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify(nuevo_usuario.to_dict()), 201

def actualizar_usuario(id):
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No se enviaron datos'}), 400

    if 'nombre' not in data or 'email' not in data:
        return jsonify({'error': 'Los campos nombre y email son obligatorios'}), 400

    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    usuario.nombre = data['nombre']
    usuario.email = data['email']

    db.session.commit()

    return jsonify(usuario.to_dict()), 200

def eliminar_usuario(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({'mensaje': 'Usuario eliminado correctamente'}), 200