from flask import Blueprint
from src.controllers.usuarios_controller import get_usuarios, get_usuario_por_id, crear_usuario, actualizar_usuario, eliminar_usuario    

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/usuarios', methods=['GET'])
def listar_usuarios():
    return get_usuarios()

@usuarios_bp.route('/usuarios/<int:id>', methods=['GET'])
def obtener_usuario(id):
    return get_usuario_por_id(id)
    
@usuarios_bp.route('/usuarios', methods=['POST'])
def crear_nuevo_usuario():
    return crear_usuario()

@usuarios_bp.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario_existente(id):
    return actualizar_usuario(id)

@usuarios_bp.route('/usuarios/<int:id>', methods=['DELETE'])
def eliminar_usuario_existente(id):
    return eliminar_usuario(id)