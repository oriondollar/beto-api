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
    return render_template('home.html')

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
    title = 'Monolithic capillary columns for liquid chromatography - Electrospray ionization mass spectrometry in proteomic and genomic research'
    doi = '10.1016/S1570-0232(02)00667-0'
    text = 'Peptides, proteins, single-stranded oligonucleotides, and double-stranded DNA fragments were separated with high resolution in micropellicular, monolithic capillary columns prepared by in situ radical copolymerization of styrene and 1,2-bis(ethenyl)benzene. Miniaturized chromatography both in the reversed-phase and the ion-pair reversed-phase mode could be realized in the same capillary column because of the nonpolar character of the poly-(styrene/divinylbenzene) stationary phase. The high chromatographic performance of the monolithic stationary phase facilitated the generation of peak capacities for the biopolymers in the range of 50-140 within 10 min under gradient elution conditions. Employing volatile mobile phase components, separations in the two chromatographic separation modes were on-line hyphenated to electrospray ionization (tandem) mass spectrometry, which yielded intact accurate molecular masses as well as sequence information derived from collision-induced fragmentation. The inaccuracy of mass determination in a quadrupole ion trap mass spectrometer was in the range of 0.01-0.02% for proteins up to a molecular mass of 20 000, and 0.02-0.12% for DNA fragments up to a molecular mass of 310 000. High-performance liquid chromatography-electrospray ionization mass spectrometry utilizing monolithic capillary columns was applied to the identification of proteins by peptide mass fingerprinting, tandem mass spectrometric sequencing, or intact molecular mass determination, as well as to the accurate sizing of double-stranded DNA fragments ranging in size from 50 to 500 base pairs, and to the detection of sequence variations in DNA fragments amplified by the polymerase chain reaction.'
    test_entities = [['entity mol', 36, 52],
                     ['entity cpt', 144, 172],
                     ['entity cpt', 193, 217],
                     ['entity mol', 221, 228],
                     ['entity mol', 233, 256],
                     ['entity cpt', 380, 396],
                     ['entity mol', 438, 467],
                     ['entity cpt', 468, 484],
                     ['entity cpt', 530, 557],
                     ['entity cpt', 647, 660],
                     ['entity cpt', 667, 683],
                     ['entity cpt', 715, 727],
                     ['entity cpt', 763, 789],
                     ['entity cpt', 823, 846],
                     ['entity cpt', 856, 873],
                     ['entity cpt', 905, 921],
                     ['entity cpt', 1042, 1061],
                     ['entity cpt', 1062, 1079],
                     ['entity cpt', 1132, 1146],
                     ['entity cpt', 1199, 1213],
                     ['entity cpt', 1243, 1277],
                     ['entity cpt', 1278, 1306],
                     ['entity cpt', 1317, 1345],
                     ['entity cpt', 1403, 1422],
                     ['entity cpt', 1424, 1449],
                     ['entity cpt', 1472, 1486],
                     ['entity cpt', 1600, 1610],
                     ['entity cpt', 1690, 1715]]
    offset = 0
    for entity in test_entities:
        if entity[0] == 'entity mol':
            text = text[:entity[1]+offset] + '<span class="entity mol" data-highlight>' + text[entity[1]+offset:entity[2]+offset] + '</span>' + text[entity[2]+offset:]
            offset += 47
        elif entity[0] == 'entity cpt':
            text = text[:entity[1]+offset] + '<span class="entity cpt" data-highlight>' + text[entity[1]+offset:entity[2]+offset] + '</span>' + text[entity[2]+offset:]
            offset += 47
    return render_template('label.html', title=title, doi=doi, text=text)

@app.route('/react', methods=['GET', 'POST'])
@login_required
def react():
    title = 'Monolithic capillary columns for liquid chromatography - Electrospray ionization mass spectrometry in proteomic and genomic research'
    doi = '10.1016/S1570-0232(02)00667-0'
    text = 'Peptides, proteins, single-stranded oligonucleotides, and double-stranded DNA fragments were separated with high resolution in micropellicular, monolithic capillary columns prepared by in situ radical copolymerization of styrene and 1,2-bis(ethenyl)benzene. Miniaturized chromatography both in the reversed-phase and the ion-pair reversed-phase mode could be realized in the same capillary column because of the nonpolar character of the poly-(styrene/divinylbenzene) stationary phase. The high chromatographic performance of the monolithic stationary phase facilitated the generation of peak capacities for the biopolymers in the range of 50-140 within 10 min under gradient elution conditions. Employing volatile mobile phase components, separations in the two chromatographic separation modes were on-line hyphenated to electrospray ionization (tandem) mass spectrometry, which yielded intact accurate molecular masses as well as sequence information derived from collision-induced fragmentation. The inaccuracy of mass determination in a quadrupole ion trap mass spectrometer was in the range of 0.01-0.02% for proteins up to a molecular mass of 20 000, and 0.02-0.12% for DNA fragments up to a molecular mass of 310 000. High-performance liquid chromatography-electrospray ionization mass spectrometry utilizing monolithic capillary columns was applied to the identification of proteins by peptide mass fingerprinting, tandem mass spectrometric sequencing, or intact molecular mass determination, as well as to the accurate sizing of double-stranded DNA fragments ranging in size from 50 to 500 base pairs, and to the detection of sequence variations in DNA fragments amplified by the polymerase chain reaction.'
    return render_template('react.html', title=title, doi=doi, text=text)

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
            next_page = url_for('classify')
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
    return redirect(url_for('classify'))
