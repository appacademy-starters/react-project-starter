import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import (
    LoginManager,
    current_user,
    login_user,
    logout_user,
    login_required
)

from starter_app.models import db, User
from starter_app.api.user_routes import user_routes
from starter_app.api.auth_routes import auth_routes

from starter_app.config import Config

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
db.init_app(app)
login_manager = LoginManager(app)

# Application Security
CORS(app)
CSRFProtect(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


@app.route('/api/csrf/restore')
def restore_csrf():
    id = current_user.id if current_user.is_authenticated else None
    return {'csrf_token': generate_csrf(), "current_user_id": id}


@app.route('/login', methods=['GET', 'POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return {"errors": ["Missing required parameters"]}, 400

    authenticated, user = User.authenticate(username, password)
    print(authenticated)
    print(user)
    if authenticated:
        login_user(user)
        return {"current_user_id": current_user.id}

    return {"errors": ["Invalid username or password"]}, 401


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return {'msg': 'You have been logged out'}, 200
