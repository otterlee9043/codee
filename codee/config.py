import os
from dotenv import load_dotenv

flask_env = os.environ.get("FLASK_ENV", "development")

if flask_env == "development":
    load_dotenv(".env.development")
else:
    load_dotenv(".env.production")

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "Hard to guess"
    SSL_REDIRECT = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_RECORD_QUERIES = True
    GITHUB_OAUTH_CLIENT_ID = os.environ.get("GITHUB_OAUTH_CLIENT_ID")
    GITHUB_OAUTH_CLIENT_SECRET = os.environ.get("GITHUB_OAUTH_CLIENT_SECRET")
    SEND_FILE_MAX_AGE_DEFAULT = 0

    SESSION_TYPE = "sqlalchemy"
    PERMANENT_SESSION_LIFETIME = 8 * 60 * 60
    SESSION_KEY_PREFIX = "session:"
    SESSION_REFRESH_EACH_REQUEST = False

    LOGIN_REMEMBER = False

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    

class ProductionConfig(Config):
    DB_USER = os.environ.get("DB_USER")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = os.environ.get("DB_PORT")
    DB_DATABASE = os.environ.get("DB_DATABASE")

    SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}?charset=utf8"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
