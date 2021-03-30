import numpy as np
from pymongo import MongoClient
from flask import jsonify
from app.api import bp

@bp.route('/test/')
def get_abstract():
    message = "Welcome to the API :)"
    client = MongoClient('mongodb+srv://orion:Sa1ss2y3?@beto-corpora.cljbt.mongodb.net/Corpus?retryWrites=true&w=majority')
    doi_fields = list(client.beto_corpora.Corpus.find({'_id': {'$regex': '10-*'}},
                                                      {'_id':1}))
    doi_ids = []
    for doi in doi_fields:
        doi_ids.append(doi['_id'])
    doi_idx = np.random.choice(np.arange(len(doi_ids)), size=1)[0]
    rand_entry = client.beto_corpora.Corpus.find_one({'_id': doi_ids[doi_idx]})
    rand_entities = client.beto_corpora.WebLabeling.find_one({'DOI': doi_ids[doi_idx]})['Entities']
    content = {
        "title": rand_entry['Title'],
        "doi": rand_entry['DOI'],
        "text": rand_entry['Abstract'],
        "entities": rand_entities
    }
    test_content = {
        "title": "Monolithic capillary columns for liquid chromatography - Electrospray ionization mass spectrometry in proteomic and genomic research",
        "doi": "10.1016/S1570-0232(02)00667-0",
        "text": "Peptides, proteins, single-stranded oligonucleotides, and double-stranded DNA fragments were separated with high resolution in micropellicular, monolithic capillary columns prepared by in situ radical copolymerization of styrene and 1,2-bis(ethenyl)benzene. Miniaturized chromatography both in the reversed-phase and the ion-pair reversed-phase mode could be realized in the same capillary column because of the nonpolar character of the poly-(styrene/divinylbenzene) stationary phase. The high chromatographic performance of the monolithic stationary phase facilitated the generation of peak capacities for the biopolymers in the range of 50-140 within 10 min under gradient elution conditions. Employing volatile mobile phase components, separations in the two chromatographic separation modes were on-line hyphenated to electrospray ionization (tandem) mass spectrometry, which yielded intact accurate molecular masses as well as sequence information derived from collision-induced fragmentation. The inaccuracy of mass determination in a quadrupole ion trap mass spectrometer was in the range of 0.01-0.02% for proteins up to a molecular mass of 20 000, and 0.02-0.12% for DNA fragments up to a molecular mass of 310 000. High-performance liquid chromatography-electrospray ionization mass spectrometry utilizing monolithic capillary columns was applied to the identification of proteins by peptide mass fingerprinting, tandem mass spectrometric sequencing, or intact molecular mass determination, as well as to the accurate sizing of double-stranded DNA fragments ranging in size from 50 to 500 base pairs, and to the detection of sequence variations in DNA fragments amplified by the polymerase chain reaction.",
        "entities": [['entity mol', 36, 52],
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
    }
    status_dict = {
        "status": 200,
        "success": True,
        "message": message,
        "contentType": 'application/json',
        "content": content
    }
    return jsonify(status_dict), status_dict['status']
