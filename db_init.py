if __name__ == '__main__':
    try:
        from susa_website import db

        option = input("Drop all tables? (Y/N)\nIf Y, then the databases will be overwritten with new tables.\nIf N, then something could go wrong.\n")

        if option == 'Y':
            db.drop_all()

        db.create_all()

    except ImportError:
        print("Something went wrong when importing the Flask app.\nYou probably didn't activate your venv.")
