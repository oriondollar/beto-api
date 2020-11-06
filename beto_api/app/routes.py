import numpy as np
from app import app, db
from app.models import User, Abstract, Edit
from app.forms import LabelForm, LoginForm, RegistrationForm

from flask import request, url_for, render_template, flash, redirect
from flask_login import current_user, login_user, logout_user, login_required

from werkzeug.urls import url_parse

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/label', methods=['GET', 'POST'])
@login_required
def label():
    relevant_goal = 200
    irrelevant_goal = 600
    current_relevant = 54
    current_irrelevant = 189
    relevant_perc = round(current_relevant / relevant_goal * 100, 1)
    irrelevant_perc = round(current_irrelevant / irrelevant_goal * 100, 1)
    rand_dec = np.random.random()
    if rand_dec >= 0.5:
        primary_keys = db.session.query(Abstract.id).filter(Abstract.relevance_classification == 'NaN').filter_by(has_corros=1).all()
    elif rand_dec < 0.5:
        primary_keys = db.session.query(Abstract.id).filter(Abstract.relevance_classification == 'NaN').filter_by(has_corros=0).all()
    random_key = primary_keys[int(np.random.choice(np.arange(len(primary_keys)), size=1))][0]
    abstract = Abstract.query.get(random_key)
    form = LabelForm()
    if form.validate_on_submit():
        if form.radio.data == 'relevant':
            relevance_classification = 1
            current_relevant += 1
            relevant_perc = round(current_relevant / relevant_goal * 100, 1)
        elif form.radio.data == 'irrelevant':
            relevance_classification = 0
            current_irrelevant += 1
            irrelevant_perc = round(current_irrelevant / irrelevant_goal * 100, 1)
        else:
            return render_template('label.html', title='Label', abstract=abstract, form=form,
                                   rel_perc=relevant_perc, irrel_perc=irrelevant_perc)
        e = Edit(abstract_id=random_key,
                 user_id=current_user.id,
                 edit_type='tfidf_classification',
                 old_val=np.nan,
                 new_val=relevance_classification)
        abstract.relevance_classification = relevance_classification
        db.session.add(e)
        db.session.commit()

        return render_template('label.html', title='Label', abstract=abstract, form=form,
                               rel_perc=relevant_perc, irrel_perc=irrelevant_perc)
    return render_template('label.html', title='Label', abstract=abstract, form=form,
                           rel_perc=relevant_perc, irrel_perc=irrelevant_perc)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('label'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('label')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('label'))
    form = RegistrationForm()
    if form.validate_on_submit():
        print(form.username.data, form.email.data)
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('label'))
