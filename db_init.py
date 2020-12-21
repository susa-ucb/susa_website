# This script drops all tables then recreates them
# DO NOT run this somehow run this if you are looking to just modify one tables
# Manually drop a table through sqlite3 then modify this to only use .create_all()

if __name__ == '__main__':
    try:
        from susa_website import db
        from scrape_catalogue import course_df

        # db.drop_all()
        # db.create_all()
        # course_df.to_sql(name='catalogue', con=db.engine, index=False)


    except ImportError:
        print("Something went wrong when importing the Flask app.\nYou probably didn't activate your venv.")
