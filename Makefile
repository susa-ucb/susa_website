SHELL := /bin/bash

.PHONY: init
.SILENT:
init:
	( \
	python3 -m venv venv; \
	venv/bin/python -m pip install --upgrade pip; \
	venv/bin/pip install -r requirements.txt; \
	venv/bin/python db_init.py; \
	echo "venv, requirements.txt, and susa.db has been set up"; \
	)

.PHONY: run
.SILENT:
run:
	( \
	source venv/bin/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=0 FLASK_ENV=development flask run; \
	)

.PHONY: debug
.SILENT:
debug:
	( \
	source venv/bin/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=1 FLASK_ENV=development flask run; \
	)

.PHONY: production
.SILENT:
production:
	( \
	source venv/bin/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=0 FLASK_ENV=production flask run; \
	)

.PHONY: clean
clean:
	find -name '__pycache__' | xargs rm -rf
	find . -iname '*.pyc' | xargs rm -f
	rm -rf ./venv
