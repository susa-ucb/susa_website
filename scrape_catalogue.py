from pathlib import Path
from requests import get

from bs4 import BeautifulSoup

from collections import namedtuple

import pandas as pd

Course = namedtuple('Course', 'id code title units desc details')

courses = {}

def add_courses(department):
    url = 'http://guide.berkeley.edu/courses/{}/index.html'.format(department)
    r = get(url, allow_redirects = True)
    soup = BeautifulSoup(r.content, 'html.parser')

    courseblocks = soup.find_all(attrs = {'class': 'courseblock'})

    for courseblock in courseblocks:
        code = courseblock.find(attrs = {'class': ('code')}).text.replace('\xa0', ' ')
        print(code)
        num = code.split()[1]
        title = courseblock.find(attrs = {'class': ('title')}).text
        units = courseblock.find(attrs = {'class': ('hours')}).text
        desc1 = courseblock.find(attrs = {'class': ('descshow')}).contents
        terms = desc1[0]
        desc = desc1[2][1:]
        desc2_in = courseblock.find(attrs = {'class': ('deschide')})
        if desc2_in:
            desc += courseblock.find(attrs = {'class': ('deschide')}).text
        details = courseblock.find_all(attrs = {'class': 'course-section'})
        courses[num] = Course(num, code, title, units, desc, details)
        if code == 'STAT 159' or code == 'MATH 55' or code == 'COMPSCI 61A':
            break

for department in ['compsci', 'math', 'stat']:
    add_courses(department)

course_df = pd.DataFrame.from_dict(data=courses, orient='index')
