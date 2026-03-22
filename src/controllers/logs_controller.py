from flask import jsonify
from src.models.log_model import Log

def get_logs():
    logs = Log.query.order_by(Log.fecha.desc()).all()
    return jsonify([l.to_dict() for l in logs]), 200