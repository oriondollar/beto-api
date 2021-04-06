from app import mongodb
from app import login
from datetime import datetime
from flask import flash
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username):
        self.username = username
        self.find()

    def add(self, email, password):
        self.email = email
        self.set_password(password)
        self.entry = {'_id': self.username,
                      'email': self.email,
                      'password_hash': self.password_hash}
        mongodb.Users.insert_one(self.entry)
        self.exists = True

    def find(self):
        entry = mongodb.Users.find_one({'_id': self.username})
        if entry is not None:
            self.email = entry['email']
            self.password_hash = entry['password_hash']
            self.exists = True
            self.is_authenticated = True
            self.is_active = True
            self.is_anonymous = False
        else:
            self.email = None
            self.password_hash = None
            self.exists = False
            self.is_authenticated = False
            self.is_active = False
            self.is_anonymous = True

    def get_id(self):
        return self.username

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash is None:
            return False
        else:
            return check_password_hash(self.password_hash, password)

@login.user_loader
def load_user(id):
    return User(mongodb.Users.find_one({'_id': id})['_id'])

# class Abstract(db.Model):
#     __tablename__ = 'abstract'
#
#     id = db.Column(db.Integer, primary_key=True)
#     pub_year = db.Column(db.Integer)
#     pii = db.Column(db.String(), index=True)
#     doi = db.Column(db.String(), index=True)
#     title = db.Column(db.String(), index=True)
#     text = db.Column(db.String())
#     journal_name = db.Column(db.String())
#     has_corros = db.Column(db.Integer)
#     relevance_classification = db.Column(db.Integer)
#     edits = db.relationship('Edit', backref='abstract', lazy='dynamic')
#
#     def __init__(self, **kwargs):
#         super(Abstract, self).__init__(**kwargs)
#
#     def __repr__(self):
#         return '<Abstract {}>'.format(self.pii)
#
# class UserSQL(UserMixin, db.Model):
#     __tablename__ = 'user'
#
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(), index=True, unique=True)
#     email = db.Column(db.String(), index=True, unique=True)
#     password_hash = db.Column(db.String(128))
#     edits = db.relationship('Edit', backref='editor', lazy='dynamic')
#
#     def __init__(self, **kwargs):
#         super(User, self).__init__(**kwargs)
#
#     def __repr__(self):
#         return '<User {}>'.format(self.username)
#
#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)
#
#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)
#
# class Edit(db.Model):
#     __tablename__ = 'edit'
#
#     id = db.Column(db.Integer, primary_key=True)
#     abstract_id = db.Column(db.Integer, db.ForeignKey('abstract.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
#     edit_type = db.Column(db.String())
#     old_val = db.Column(db.String())
#     new_val = db.Column(db.String())
#
#     def __init__(self, **kwargs):
#         super(Edit, self).__init__(**kwargs)
#
#     def __repr__(self):
#         return '<Edit {} - {} in {} on {}>'.format(user_id, edit_type, abstract_id, timestamp)
