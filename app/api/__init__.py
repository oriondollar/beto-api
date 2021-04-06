from flask import Blueprint
from pymongo import MongoClient

hidden_config = {}
with open('.hidden_config.txt', 'r') as f:
    for line in f:
        line = line.split(':')
        hidden_config[line[0]] = line[1].split('\n')[0]
mongodb = MongoClient('localhost', 27017).beto_corpora
# mongodb = MongoClient('mongodb+srv://{}:{}@beto-corpora.cljbt.mongodb.net/Corpus?retryWrites=true&w=majority'.format(hidden_config['DATABASE_USERNAME'], hidden_config['DATABASE_PASSWORD'])).beto_corpora
bp = Blueprint('api', __name__)

from app.api import routes
