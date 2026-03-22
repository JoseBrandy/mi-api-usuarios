from flask import Blueprint
from src.controllers.categorias_controller import get_categorias, crear_categoria, agregar_categoria_a_tarea, eliminar_categoria_de_tarea

categorias_bp = Blueprint('categorias', __name__)

@categorias_bp.route('/categorias', methods=['GET'])
def listar_categorias():
    return get_categorias()

@categorias_bp.route('/categorias', methods=['POST'])
def crear_nueva_categoria():
    return crear_categoria()

@categorias_bp.route('/tareas/<int:tarea_id>/categorias/<int:categoria_id>', methods=['POST'])
def agregar_categoria(tarea_id, categoria_id):
    return agregar_categoria_a_tarea(tarea_id, categoria_id)

@categorias_bp.route('/tareas/<int:tarea_id>/categorias/<int:categoria_id>', methods=['DELETE'])
def eliminar_categoria(tarea_id, categoria_id):
    return eliminar_categoria_de_tarea(tarea_id, categoria_id)