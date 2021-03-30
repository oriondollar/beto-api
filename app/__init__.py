import os
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from app.api import bp as api_bp

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.register_blueprint(api_bp, url_prefix='/api')
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'
bootstrap = Bootstrap(app)

from app import routes, models, errors
