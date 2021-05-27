import numpy as np
from app import app
from app.models import User
from app.forms import LabelForm, LoginForm, RegistrationForm

from flask import request, url_for, render_template, flash, redirect
from flask_login import current_user, login_user, logout_user, login_required

from werkzeug.urls import url_parse

@app.route('/')
def index():
    return redirect(url_for('home'))

@app.route('/home')
def home():
    print('hey')
    return render_template('home.html')

@app.route('/explore', methods=['GET'])
@login_required
def explore():
    return render_template('explore.html')

@app.route('/classify', methods=['GET', 'POST'])
@login_required
def classify():
    relevant_goal = 50
    irrelevant_goal = 150
    # current_relevant = len(Edit.query.filter_by(new_val = '1').all())
    # current_irrelevant = len(Edit.query.filter_by(new_val = '0').all())
    current_relevant = 8
    current_irrelevant = 23
    relevant_perc = round(current_relevant / relevant_goal * 100, 1)
    irrelevant_perc = round(current_irrelevant / irrelevant_goal * 100, 1)
    # rand_dec = np.random.random()
    # if rand_dec >= 0.5:
    #     primary_keys = db.session.query(Abstract.id).filter(Abstract.relevance_classification == -1).filter_by(has_corros=1).all()
    # elif rand_dec < 0.5:
    #     primary_keys = db.session.query(Abstract.id).filter(Abstract.relevance_classification == -1).filter_by(has_corros=0).all()
    # random_key = primary_keys[int(np.random.choice(np.arange(len(primary_keys)), size=1))][0]
    # abstract = Abstract.query.get(random_key)
    abstract_title = 'Transport of corrosion products in the steam-water cycle of supercritical power plant'
    abstract_doi = 'doi:10.1016/j.applthermaleng.2016.11.119'
    abstract_text = 'The operational reliability of thermal power plant boilers is significantly influenced by corrosion processes and by the formation of deposits on heat transfer surfaces. The basis of this problem is the transport of corrosion products in the steam-water cycle. In this study, the source of corrosion products was discussed. The effect of the water parameters on the transport of corrosion products was analysed. The generation (or deposition) ratio of corrosion products on the main components was evaluated. The corrosion of carbon steel was found to be the main source of transported corrosion products, wherein about 85% of the corrosion products transferred in the fluid was derived from the feed-water train and about 90% of the corrosion products deposited on the boiler tubes. Consequently, a micro-oxygenated treatment method for supercritical power plant was proposed to restrain the transport of corrosion products.'
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
            return render_template('classify.html', title='Classify', abstract_title=abstract_title,
                                   abstract_doi=abstract_doi, abstract_text=abstract_text, form=form,
                                   rel_perc=relevant_perc, irrel_perc=irrelevant_perc)
        # e = Edit(abstract_id=random_key,
        #          user_id=current_user.id,
        #          edit_type='tfidf_classification',
        #          old_val=np.nan,
        #          new_val=relevance_classification)
        # abstract.relevance_classification = relevance_classification
        # db.session.add(e)
        # db.session.commit()

        return render_template('classify.html', title='Classify', abstract_title=abstract_title,
                               abstract_doi=abstract_doi, abstract_text=abstract_text, form=form,
                               rel_perc=relevant_perc, irrel_perc=irrelevant_perc)
    return render_template('classify.html', title='Classify', abstract_title=abstract_title,
                           abstract_doi=abstract_doi, abstract_text=abstract_text, form=form,
                           rel_perc=relevant_perc, irrel_perc=irrelevant_perc)

@app.route('/label', methods=['GET', 'POST'])
@login_required
def label():
    return render_template('label.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('classify'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User(form.username.data)
        if not user.exists or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('explore')
        return redirect(next_page)
        # user = User.query.filter_by(username=form.username.data).first()
        # if user is None or not user.check_password(form.password.data):
        #     flash('Invalid username or password')
        #     return redirect(url_for('login'))
        # login_user(user, remember=form.remember_me.data)
        # next_page = request.args.get('next')
        # if not next_page or url_parse(next_page).netloc != '':
        #     next_page = url_for('classify')
        # return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('classify'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data)
        user.add(form.email.data, form.password.data)
        # user.set_password(form.password.data)
        # db.session.add(user)
        # db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('home'))
