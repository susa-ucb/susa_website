# SUSA Website

This repository contains the source code for the Statistics Undergraduate Student Association at the University of California, Berkeley website.

## Requirements

Install Python 3.8+ for compatibility insurance

Install the `virtualenv` package in Python

The command `pip install virtualenv` should work for most OS's.

## Convenience

The code in this repo was developed on Linux, I haven't made any adjustments for the make commands as a result of this. The make commands most likely won't work in a Windows environment because of differing paths. Change up the paths in the Makefile so that the references to bin are Scripts.

### Makefile

Before you can run anything, you have to set up the venv and fulfill all requirements; run `make init`.

To run the app, simply run `make run`.

To run in debug mode, run `make debug`.

To clear the venv and cache, run `make clean`.

### config.yaml

To ensure all features work properly, create a `config.yaml` file in the same directory and format as the `susa_website/config.yaml.template` file.

NEVER add/commit/put `config.yaml` to GitHub since it contains sensitive information (API, user, password, etc.)

For the secret key, you can use any random string; an easy way to do this would be to enter the Python interpreter and enter

```py
import os
os.urandom(any_length)
```

with any_length being literary any length that you want the key to be
