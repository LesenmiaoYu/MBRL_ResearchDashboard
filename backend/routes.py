from flask import jsonify
from app import app
from flask import jsonify
from models import MetaInfo
import requests
import xml.etree.ElementTree as ET
from datetime import datetime

# API pool information
API_INFO = {
    'mkt': {
        'url': "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc",
        'key': "38311-Hreg9h7SZdmH"
    },
    'mor': {
        'url': "https://marshall-mor.sona-systems.com/services/SonaAPI.svc",
        'key': "37312-sXnXTHAp6dXa"
    },
    'comp': {
        'url': "https://marshall-research.sona-systems.com/services/SonaAPI.svc",
        'key': "20937-sBjkuZGG89A6"
    }
}


@app.route('/get-meta', methods=['GET'])
def get_meta():
    try:
        meta = MetaInfo.query.first()
        if meta:
            return jsonify({
                "goal_mkt": meta.goal_mkt,
                "goal_mor": meta.goal_mor,
                "goal_comp": meta.goal_comp,
                "admin_id": meta.admin_id,
                "admin_key": meta.admin_key
            }), 200
        else:
            return jsonify({"error": "Meta information not found"}), 404
    except Exception as e:
        print(f"Error fetching meta info: {e}")
        return jsonify({"error": "An error occurred"}), 500




