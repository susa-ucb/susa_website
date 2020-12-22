# A scraper for catalogue information for the SUSA course map

# for getting webcontent
from requests import get
from bs4 import BeautifulSoup
# convenience of data structuring
from collections import namedtuple
# for data frame construction
from pandas import DataFrame

############# SETUP
# relevant department codes to our course map
departments = ['compsci', 'math', 'stat']

# where to break our catalogue searching
# choose by highest relevant course num
break_courses = ['STAT 159', 'MATH 55', 'COMPSCI 61A']
#############

Course = namedtuple('Course', 'num code title units desc details')

catalogue = {}

# function to add our courses to COURSES based on department code
def add_courses(department):
    url = 'http://guide.berkeley.edu/courses/{}/index.html'.format(department)
    r = get(url, allow_redirects = True)
    soup = BeautifulSoup(r.content, 'html.parser')

    anchors = soup.findAll('a')
    for anchor in anchors:
        anchor.replaceWithChildren()

    courseblocks = soup.find_all(attrs = {'class': 'courseblock'})

    for courseblock in courseblocks:
        code = courseblock.find(attrs = {'class': ('code')}).text.replace('\xa0', ' ')
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
        details = ''.join([str(detail) for detail in details])
        catalogue[num] = Course(num, code, title, units, desc, details)
        # break it just so that we don't do more than neccessary
        if code in break_courses:
            break

# call function on all our department codes
for department in departments:
    add_courses(department)

catalogue['Statistics'] = Course('Statistics', 'STAT', 'Statistics', None, 'These are statistics courses.', None)
catalogue['Data'] = Course('Data', 'DATA', 'Data Science', None, 'These are data science courses.', None)
catalogue['Math'] = Course('Math', 'MATH', 'MATHEMATICS', None, 'These are math courses.', None)

catalogue['CoreClass'] = Course('CoreClass', None, 'Core Statistics Classes', None, 'These are core classes for the statistics major.', None)
catalogue['LowerDivReq'] = Course('LowerDivReq', None, 'Statistics Major Lower Division Requirements', None, 'These are lower division requirements for the statistics major.', None)
catalogue['Elective'] = Course('Elective', None, 'Statistics Major 15X Electives', None, 'These are math courses related to statistics.', None)
catalogue['Programming'] = Course('Programming', None, 'Programming Courses', None, 'These are programming courses related to statistics.', None)

catalogue['LinearAlgebra'] = Course('LinearAlgebra', None, 'Linear Algebra Courses', None, 'These are linear algebra courses.', None)
catalogue['UpperDivisionProbability'] = Course('UpperDivisionProbability', None, 'Statistics Upper-Division Probability Courses', None, 'These are upper-div probability courses.', None)

# convert our dictionary to a pandas dataframe
course_df = DataFrame.from_dict(data=catalogue, orient='index')
