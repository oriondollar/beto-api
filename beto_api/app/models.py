from app import db
from app import login
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Abstract(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pub_year = db.Column(db.Integer)
    pii = db.Column(db.String(24), index=True)
    doi = db.Column(db.String(60), index=True)
    title = db.Column(db.String(700), index=True)
    text = db.Column(db.String(10000))
    journal_name = db.Column(db.String(100))
    has_corros = db.Column(db.Integer)
    relevance_classification = db.Column(db.Integer)
    edits = db.relationship('Edit', backref='abstract', lazy='dynamic')

    def __repr__(self):
        return '<Abstract {}>'.format(self.pii)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    edits = db.relationship('Edit', backref='editor', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Edit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    abstract_id = db.Column(db.Integer, db.ForeignKey('abstract.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    edit_type = db.Column(db.String(64))
    old_val = db.Column(db.String(512))
    new_val = db.Column(db.String(512))

    def __repr__(self):
        return '<Edit {} - {} in {} on {}>'.format(user_id, edit_type, abstract_id, timestamp)

@login.user_loader
def load_user(id):
    return User.query.get(int(id))
