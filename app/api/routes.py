import pytz
import numpy as np
import datetime as dt
from flask import jsonify, request
from flask_login import current_user, login_required
from app.api import bp, mongodb


@bp.route('/rand/')
def get_abstract():
    message = "Welcome to the API :)"
    # doi_fields = list(mongodb.Corpus.find({'_id': {'$regex': '10-*'}},
    #                                                    {'_id':1}))
    #
    # doi_ids = []
    # for doi in doi_fields:
    #     doi_ids.append(doi['_id'])
    # doi_idx = np.random.choice(np.arange(len(doi_ids)), size=1)[0]
    # rand_entry = mongodb.Corpus.find_one({'_id': doi_ids[doi_idx]})
    # rand_entities = mongodb.WebLabeling.find_one({'DOI': doi_ids[doi_idx]})['Entities']
    rand_entry = {
        'Title': 'Simple method for determination of paraquat in plasma and serum of human patients by high-performance liquid chromatography',
        'DOI': '10.1016/S1570-0232(02)00245-3',
        'Abstract': "A simple and fast HPLC system is presented for quantifying paraquat in human plasma and serum using 1,1′-diethyl-4,4′-bipyridyldiylium (diethyl paraquat) as an internal standard. An octadecyl-silica column is used with an eluent of 10% acetonitrile (v/v) containing sodium 1-octanesulphonic acid (3.0 mM) and a diethylamine-orthophosphoric acid buffer (pH 3). Unlike with other techniques, sample treatment requires only the precipitation of protein contents by 6% perchloric acid (v/v) in methanol. The method has a limit of detection of 0.1 μg/ml and is linear up to 10 μg/ml. The serum of four patients and the plasma of one patient with paraquat intoxication's were analysed and positive identification and quantification was readily achieved. One of those patients survived, partially given the rapid disclosure of his levels of paraquat. Therefore, this method is suitable for quantification of paraquat in toxicological samples. It may be used as a prognostic tool in critical case detoxification and to quickly identify potentially salvageable patients for enrolment in new hemofiltration studies."}
    rand_entities = [['entity chem', 59, 67], ['entity chem', 100, 134], ['entity chem', 136, 152],
                     ['entity cdsc', 160, 177], ['entity chem', 182, 198], ['entity chem', 236, 248],
                     ['entity chem', 266, 295], ['entity chem', 311, 344], ['entity chem', 465, 480],
                     ['entity chem', 490, 498], ['entity prop', 517, 535], ['entity chem', 641, 649],
                     ['entity chem', 834, 842], ['entity chem', 901, 909]]
    content = {
        "title": rand_entry['Title'],
        "doi": rand_entry['DOI'],
        "text": rand_entry['Abstract'],
        "entities": rand_entities
    }
    status_dict = {
        "status": 200,
        "success": True,
        "message": message,
        "contentType": 'application/json',
        "content": content
    }
    return jsonify(status_dict), status_dict['status']


@bp.route('/doi_suggestions/')
def get_doi_suggestions():
    dois = []
    with open('flame_retardant_dois.txt', 'r') as f:
        for line in f:
            dois.append(line)
    message = "Welcome to the API :)"
    content = {
        "dois": dois
    }
    status_dict = {
        "status": 200,
        "success": True,
        "message": message,
        "contentType": 'application/json',
        "content": content
    }
    return jsonify(status_dict), status_dict['status']


@bp.route('/vrel_dois/')
def get_vrel_dois():
    vrel = list(mongodb.Classifications.find({'Relevance': 2}, {'_id': 0, 'DOI': 1}))
    vrel_dois = []
    for i in range(len(vrel)):
        vrel_dois.append(vrel[i]['DOI'])
    content = {"dois": vrel_dois}
    message = "vrel dois"
    status_dict = {
        "status": 200,
        "success": True,
        "message": message,
        "contentType": 'application/json',
        "content": content
    }
    return jsonify(status_dict), status_dict['status']


@bp.route('/<doi>/')
def get_db_entry(doi):
    doi = doi.replace('*', '/')
    message = "You wanna DOI? Here's ya stinking DOI"
    entry = mongodb.Corpus.find_one({'_id': doi})
    title = entry['Title']
    abstract = entry['Abstract']
    try:
        fulltext = entry['FullText']
    except KeyError:
        fulltext = {'Body': [], 'RefCites': []}
    try:
        keywords = entry['Keywords']
    except KeyError:
        keywords = []
    metadata = entry['MetaData']
    content = {
        "title": title,
        "doi": doi,
        "abstract": abstract,
        "fulltext": fulltext,
        "keywords": keywords,
        "metadata": metadata
    }
    status_dict = {
        "status": 200,
        "success": True,
        "message": message,
        "contentType": 'application/json',
        "content": content
    }
    return jsonify(status_dict), status_dict['status']


@bp.route('/post_classify/', methods=['POST'])
@login_required
def get_classify():
    classify_data = request.get_json()
    doi = classify_data['doi']
    cat = classify_data['catSelect'].lower()
    rel = classify_data['relSelect']
    if rel == 'zero':
        rel = 0
    elif rel == 'one':
        rel = 1
    elif rel == 'two':
        rel = 2
    timestamp = classify_data['timeStamp']
    utc_datetime = dt.datetime.utcfromtimestamp(timestamp / 1000.)
    timestamp = utc_datetime.replace(tzinfo=pytz.timezone('UTC')).astimezone(pytz.timezone('US/Pacific'))
    classifications = mongodb.Classifications
    entry = {'doi': doi,
             'category': cat,
             'relevance': rel,
             'user': current_user.username,
             'timeStamp': timestamp}
    classifications.insert_one(entry)
    return "Success", 201


@bp.route('/post_entities/', methods=['POST'])
@login_required
def get_entities():
    entities = request.get_json()
    doi = entities['doi']
    names = entities['types']
    surface_form = entities['surfaceForm']
    start_spans = entities['startSpans']
    end_spans = entities['endSpans']
    timestamp = entities['timeStamp']
    user = current_user.username
    spans = []
    for i in range(len(start_spans)):
        spans.append([start_spans[i], end_spans[i]])
    utc_datetime = dt.datetime.utcfromtimestamp(timestamp / 1000.)
    timestamp = utc_datetime.replace(tzinfo=pytz.timezone('UTC')).astimezone(pytz.timezone('US/Pacific'))
    entry = {'doi': doi,
             'names': names,
             'surfaceForms': surface_form,
             'spans': spans,
             'user': user,
             'timeStamp': timestamp}
    entities = mongodb.Entities
    entities.update_one({'user': user, 'doi': doi}, {"$set": entry}, upsert=True)
    return "Success", 201


@bp.route('/post_relations/', methods=['POST'])
@login_required
def get_relations():
    relations_data = request.get_json()
    doi = relations_data['doi']
    single_rel = relations_data['connectors']
    multi_rel = relations_data['multiTokenConnectors']
    timestamp = relations_data['timeStamp']
    utc_datetime = dt.datetime.utcfromtimestamp(timestamp / 1000.)
    user = current_user.username
    timestamp = utc_datetime.replace(tzinfo=pytz.timezone('UTC')).astimezone(pytz.timezone('US/Pacific'))
    entry = {'doi': doi,
             'singleRel': single_rel,
             'multiRel': multi_rel,
             'user': user,
             'timeStamp': timestamp}
    entities = mongodb.Entities
    entities.update_one({'user': user, 'doi': doi}, {"$set": entry}, upsert=True)
    print(single_rel)
    return "Success", 201
