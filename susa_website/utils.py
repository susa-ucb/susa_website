from collections import namedtuple


# Parse date strings into a more readable format
mon_num = range(1,13)
mon_str = ['Jan.', 'Feb.', 'Mar', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
mon_dic = dict(zip(mon_num, mon_str))

def format_date(date):
    date = date.split('-')
    return '{year} {month} {day}'.format(year=date[0], month=mon_dic[int(date[1])], day=date[2])

def format_time(time):
    hour, minute, am = int(time[:2]), time[3:5], True
    if hour >= 12:
        am = False
        if hour > 12:
            hour -= 12
    return ''.join([str(hour), ':', minute, ' AM' if am else ' PM'])


# Parse error codes into a better format
Error = namedtuple('Error', 'code desc exp')

error_codes = {
    403 : Error('403', 'Error 403: Forbidden', 'You are currently not logged in.'),
    404 : Error('404', 'Error 404: Page Not Found', 'Either you entered an invalid URL, or our web developer did something wrong.'),
    500 : Error('500', 'Error 500: Internal Server Error', 'Something happened :(')
}

def conv_error_code(code):
    return error_codes[code]

# Get groupings for resources
Group = namedtuple('Group', 'category link_list')
Link = namedtuple('Link', 'label link')

def get_groupings(table):
    groups = []
    grouped = []
    for row in table:
        if not row['category'] in grouped:
            curr_group = Group(row['category'], [])
            groups.append(curr_group)
            grouped.append(row['category'])
        curr_group.link_list.append(Link(row['label'], row['link']))
    return groups

# Parse a list to a better format
def conv_list(list_string, type):
    if not list_string:
        return None
    return [type(pair[0], pair[1]) for pair in [linked.split(': ') for linked in list_string.split(', ')]]


# Parse footer_email string to a better format
Email = namedtuple('Email', 'role email')

def conv_email_list(list_string):
    return conv_list(list_string, Email)

# Parse event resources to a better format
Resource = namedtuple('Resource', 'label link')

def conv_resource_list(list_string):
    return conv_list(list_string, Resource)
