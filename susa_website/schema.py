# Not a schema in the traditional SQL sense
# This is to define all the models for SQLAlchemy
from . import db

class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_date = db.Column(db.Date, nullable=False)
    event_name = db.Column(db.String(80), nullable=False)
    fb_link = db.Column(db.String(120), nullable=False, default='TBA')
    location = db.Column(db.String(120), nullable=False, default='TBA')

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
    past_classes = db.Column(db.String(500), nullable=False)
    semester = db.Column(db.String(80), nullable=False)

class Resources(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    label = db.Column(db.String(80), nullable=False)
    link = db.Column(db.String(100), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    group_position = db.Column(db.Integer, nullable=False)

class Contents(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    area = db.Column(db.String(50), nullable=False)
    text = db.Column(db.String(10000), nullable=False)
