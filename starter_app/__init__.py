import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)

from starter_app.models import db, User
from starter_app.api.user_routes import user_routes
from starter_app.api.auth_routes import auth_routes

from starter_app.config import Config

app = Flask(__name__)
app.config.from_object(Config)
CSRFProtect(app)
app.register_blueprint(user_routes, url_prefix='/api/users')
db.init_app(app)
jwt = JWTManager(app)


# Application Security
CORS(app)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') else None,
        httponly=False)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


@app.route('/api/csrf/restore')
def restore_csrf():
    return {'csrf_token': generate_csrf()}


@app.route('/login', methods=['POST'])
def login(response):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return {"errors": ["Missing required parameters"]}, 400

    authenticated = User.authenticate(username, password)
    if authenticated:
        access_token = create_access_token(identity=username)
        response.set_cookie('token', access_token)
        return {"access_token": access_token}, 200

    return {"errors": ["Invalid username or password"]}, 401

