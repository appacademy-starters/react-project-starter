import os


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_ECHO = True
    WTF_CSRF_TIME_LIMIT = None
    # Update this to true once login is complete!
    SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = False
