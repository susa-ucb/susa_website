if __name__ == '__main__':
    try:
        from susa_website import db

        db.drop_all()

        db.create_all()

    except ImportError:
        print("Something went wrong when importing the Flask app.\nYou probably didn't activate your venv.")
