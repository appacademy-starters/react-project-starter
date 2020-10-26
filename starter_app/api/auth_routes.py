from flask import Blueprint, request, jsonify
from starter_app.models import User

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return {"errors": ["Missing required parameters"]}, 400

    access_token = User.authenticate(username, password)
    if access_token:
        return {"access_token": access_token}, 200

    return {"errors": ["Invalid username or password"]}, 401


