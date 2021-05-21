from flask import Blueprint
from pymongo import MongoClient

mongodb = MongoClient('localhost', 27017).beto_corpora
bp = Blueprint('api', __name__)

from app.api import routes
