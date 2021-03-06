# Not a schema in the traditional SQL sense
# This is to define all the models for SQLAlchemy
from . import db

class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.Time, nullable=True)
    event_end = db.Column(db.Time, nullable=True)
    event_name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(1000), nullable=True)
    fb_link = db.Column(db.String(120), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    resources = db.Column(db.String(1000), nullable=True)

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    position = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(80), nullable=False)
    summary = db.Column(db.String(3000), nullable=False)
    portrait = db.Column(db.String(80), nullable=False)
    major = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(80), nullable=False)
    origin = db.Column(db.String(80), nullable=False)
    classes = db.Column(db.String(500), nullable=False)
    past_classes = db.Column(db.String(500), nullable=True)
    semester = db.Column(db.String(80), nullable=False)

class Resources(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.String(80), nullable=False)
    label = db.Column(db.String(80), nullable=False)
    link = db.Column(db.String(100), nullable=False)
    position = db.Column(db.Integer, nullable=False)

class ResourcesMapping(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.String(80), nullable=False)
    group_position = db.Column(db.Integer, nullable=False)
    type = db.Column(db.Integer, nullable=False)

class Contents(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    area = db.Column(db.String(50), nullable=False)
    text = db.Column(db.String(10000), nullable=False)

class Catalogue(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    num = db.Column(db.String(25), nullable=True)
    code = db.Column(db.String(25), nullable=True)
    title = db.Column(db.String(50), nullable=True)
    units = db.Column(db.String(10), nullable=True)
    desc = db.Column(db.String(10000), nullable=True)
    details = db.Column(db.String(10000), nullable=True)

class Shortcuts(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    website_link = db.Column(db.String(100), nullable=False, unique=True)
    desc = db.Column(db.String(100), nullable=True)
    external_link = db.Column(db.String(200), nullable=False)

class Pages(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    website_link = db.Column(db.String(100), nullable=False, unique=True)
    title = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(100), nullable=True)
    contents = db.Column(db.String(20000), nullable=False)
