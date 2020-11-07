import pandas as pd

from app import db
from app.models import Abstract

def populate_database(df):
    for i, row in df.iterrows():
        abs = Abstract(pub_year=int(row.pub_year),
                       pii=row.pii,
                       doi=row.doi,
                       title=row.title,
                       text=row.abstract,
                       journal_name=row.journal_name,
                       has_corros=row.has_corros,
                       relevance_classification=-1)
        db.session.add(abs)
        db.session.commit()
