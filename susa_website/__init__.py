import os
import yaml
import sqlite3

from flask import Flask, g
from flask_sqlalchemy import SQLAlchemy

# General Flask config.
CWD = os.getcwd()
ROOT = 'susa_website/'
CONFIG = 'susa_website/config.yaml'
DATABASE = 'susa_website/susa.db'

secrets = {}
with open(CONFIG, 'r') as config:
    secrets = yaml.load(config, Loader=yaml.BaseLoader)
SECRET_KEY = secrets['secret']
settings = {
'semester' : None,
'recruiting' : None
}

app = Flask(__name__)
app.config.from_object(__name__)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///susa.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.before_request
def before_request():
    g.db = sqlite3.connect(app.config['DATABASE'])
    g.db.row_factory = sqlite3.Row

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

def retrieve_db(query, unique=False):
    cur = g.db.execute(query)
    rv = cur.fetchall()
    cur.close()
    return (rv[0][0] if rv else None) if unique else rv

import susa_website.admin as admin
import susa_website.views as views
