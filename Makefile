.PHONY: init
.SILENT:
init:
	( \
	python -m venv venv; \
	source venv/Scripts/activate; \
	pip install -r requirements.txt; \
	python db_init.py; \
	deactivate; \
	echo "venv, requirements.txt, and susa.db has been set up"; \
	)

.PHONY: run
.SILENT:
run:
	( \
	source venv/Scripts/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=0 FLASK_ENV=development flask run; \
	)

.PHONY: debug
.SILENT:
debug:
	( \
	source venv/Scripts/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=1 FLASK_ENV=development flask run; \
	)

.PHONY: production
.SILENT:
production:
	( \
	source venv/Scripts/activate; \
	FLASK_APP=susa_website FLASK_DEBUG=0 FLASK_ENV=production flask run; \
	)

.PHONY: clean
clean:
	find -name '__pycache__' | xargs rm -r
	rm -rf ./venv
