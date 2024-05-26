# myapp/__init__.py
from flask import Flask

app = Flask(__name__)

from myapp import routes  # Importer vos routes ici pour les enregistrer avec l'application
