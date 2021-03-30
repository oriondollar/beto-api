from app import mongodb
from app.models import User

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, RadioField, SubmitField
from wtforms.validators import ValidationError, DataRequired, Email, EqualTo

class LabelForm(FlaskForm):
    radio = RadioField('Label', choices=[('relevant','Relevant'),
                                         ('irrelevant', 'Irrelevant'),
                                         ('idk', "I'm Not Sure")])
    submit = SubmitField('Classify')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField(
        'Repeat Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = mongodb.Users.find_one({'_id': username.data})
        if user is not None:
            raise ValidationError('This username is already in use.')

    def validate_email(self, email):
        user = mongodb.Users.find_one({'email': email.data})
        if user is not None:
            raise ValidationError('This email address is already in use.')
        email_server = email.data.split('.')[-1]
        if email_server != 'edu':
            raise ValidationError('Please register with a .edu email address')
