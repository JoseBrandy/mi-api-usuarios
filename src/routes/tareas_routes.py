from flask import Blueprint
from src.controllers.tareas_controller import get_tareas_por_usuario, crear_tarea, actualizar_tarea, eliminar_tarea, get_tarea_por_id

tareas_bp = Blueprint('tareas', __name__)

@tareas_bp.route('/usuarios/<int:usuario_id>/tareas', methods=['GET'])
def listar_tareas(usuario_id):
    return get_tareas_por_usuario(usuario_id)

@tareas_bp.route('/usuarios/<int:usuario_id>/tareas/<int:tarea_id>', methods=['GET'])
def obtener_tarea(usuario_id, tarea_id):
    return get_tarea_por_id(usuario_id, tarea_id)


@tareas_bp.route('/usuarios/<int:usuario_id>/tareas', methods=['POST'])
def crear_nueva_tarea(usuario_id):
    return crear_tarea(usuario_id)

@tareas_bp.route('/usuarios/<int:usuario_id>/tareas/<int:tarea_id>', methods=['PUT'])
def actualizar_tarea_existente(usuario_id, tarea_id):
    return actualizar_tarea(usuario_id, tarea_id)

@tareas_bp.route('/usuarios/<int:usuario_id>/tareas/<int:tarea_id>', methods=['DELETE'])
def eliminar_tarea_existente(usuario_id, tarea_id):
    return eliminar_tarea(usuario_id, tarea_id)
