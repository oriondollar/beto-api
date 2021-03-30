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
hidden_config = {}
with open('.hidden_config.txt', 'r') as f:
    for line in f:
        line = line.split(':')
        hidden_config[line[0]] = line[1].split('\n')[0]
mongodb = MongoClient('mongodb+srv://{}:{}@beto-corpora.cljbt.mongodb.net/Corpus?retryWrites=true&w=majority'.format(hidden_config['DATABASE_USERNAME'], hidden_config['DATABASE_PASSWORD'])).beto_corpora
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'
bootstrap = Bootstrap(app)

from app import routes, models, errors
