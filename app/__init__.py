import os
from flask import Flask
from config import Config
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from app.api import bp as api_bp
from pymongo import MongoClient

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.register_blueprint(api_bp, url_prefix='/api')
mongodb = MongoClient('localhost', 27017).beto_corpora
login = LoginManager(app)
login.login_view = 'login'
bootstrap = Bootstrap(app)

from app import routes, models, errors
