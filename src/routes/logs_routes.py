from flask import Blueprint
from src.controllers.logs_controller import get_logs

logs_bp = Blueprint('logs', __name__)

@logs_bp.route('/logs', methods=['GET'])
def listar_logs():
    return get_logs()