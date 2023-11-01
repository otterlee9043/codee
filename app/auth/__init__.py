from flask import Blueprint

auth = Blueprint("auth", __name__)

from . import views, github_api
