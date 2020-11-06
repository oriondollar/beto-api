from app import app, db
from app.models import Abstract, User, Edit

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Abstract': Abstract, 'User': User, 'Edit': Edit}
