from flask_jwt_extended import create_access_token, get_jwt_identity
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_digest = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
          "id": self.id,
          "username": self.username,
          "email": self.email
        }

    @property
    def password(self):
        raise AttributeError('Password not readable.')

    @password.setter
    def password(self, password):
        self.password_digest = generate_password_hash(password)

    @classmethod
    def authenticate(cls, username, password):
        user = cls.query.filter(User.username == username).scalar()
        return check_password_hash(user.password_digest, password), user
