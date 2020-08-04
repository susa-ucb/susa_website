from flask import Flask, render_template, request, url_for, flash, redirect, session, Markup
from flask_login.utils import current_user

from . import app, db, secrets, retrieve_db
from .utils import get_groupings, conv_error_code, format_date, conv_email_list


def susa_render(template_name_or_list, **context):
    footer_emails = retrieve_db('SELECT text FROM contents WHERE area="footer_emails"', True)
    footer_emails = conv_email_list(footer_emails)
    context['footer_emails'] = footer_emails
    context['logged_in'] = current_user.is_authenticated
    context['Markup'] = Markup
    return render_template(template_name_or_list, **context)

# Home page view
@app.route('/')
def index():
    home_text = retrieve_db('SELECT text FROM contents WHERE area="home_text"', True)
    #names = retrieve_db('SELECT ')
    code_file = open("susa_website/static/scripts/landinganimation/curve_code.txt")
    code_text = code_file.read().format(
    names = ', '.join([x['name'] for x in retrieve_db('SELECT name FROM team ORDER BY position')])
    )
    code_file.close()
    gammas_file = open("susa_website/static/scripts/landinganimation/gammas_svg.txt")
    gammas_svg = gammas_file.read()
    gammas_file.close()
    landing_file = open("susa_website/static/scripts/landinganimation/landing_text.txt")
    landing_svg = landing_file.read()
    landing_file.close()
    return susa_render('index.html', home_text=home_text, code_text=code_text, gammas_svg=gammas_svg, landing_text=landing_svg)

# Team page view
@app.route('/team')
def team():
    team = retrieve_db('SELECT * FROM team ORDER BY position')
    about_team = retrieve_db('SELECT text FROM contents WHERE area="about_team"', True)
    apply_info = retrieve_db('SELECT text FROM contents WHERE area="apply_info"', True)
    return susa_render('team.html', team = team, about_team=about_team,
    apply_info=apply_info)

# Events page view
@app.route('/events')
def events():
    upcoming = retrieve_db('SELECT * FROM events WHERE event_date>=CURRENT_DATE  ORDER BY event_date ASC')
    past = retrieve_db('SELECT * FROM events WHERE event_date<CURRENT_DATE ORDER BY event_date DESC LIMIT 10')
    about_events = retrieve_db('SELECT text FROM contents WHERE area="about_events"', True)
    return susa_render('events.html', upcoming=upcoming, past=past, format_date=format_date,
    key=secrets['google_calendar_api'], about_events=about_events)

# Resources page view
@app.route('/resources')
def resources():
    courses = retrieve_db('SELECT * FROM resources WHERE type IS 1 ORDER BY group_position, position')
    useful_links = retrieve_db('SELECT * FROM resources WHERE type IS 2 ORDER BY group_position, position')
    other_links = retrieve_db('SELECT * FROM resources WHERE type IS 3 ORDER BY group_position, position')
    return susa_render('resources.html', courses=get_groupings(courses),
    useful_links=get_groupings(useful_links), other_links=get_groupings(other_links))

# Error pages
@app.errorhandler(403)
def not_authorized(e):
    return susa_render('error.html', error=conv_error_code(403)), 403

@app.errorhandler(404)
def page_not_found(e):
    return susa_render('error.html', error=conv_error_code(404)), 404

@app.errorhandler(500)
def server_error(e):
    return susa_render('error.html', error=conv_error_code(500)), 500
