from flask import redirect, request, url_for, flash, session
from flask_login import login_user, logout_user, login_required
from . import auth
from .. import db
from .github_api import *
from ..models import User
from flask_login import logout_user


@auth.route("/access-token", methods=["GET"])
def get_access_token():
    code = request.args.get("code")
    token_resp = call_token_exchange_api(code)
    if token_resp.ok:
        token_resp_data = token_resp.json()
        session["access_token"] = token_resp_data["access_token"]
        user_resp = call_user_api()
        if user_resp.ok:
            account_info = user_resp.json()
            user = save_or_update(account_info)
            login_user(user, remember=False)
    return redirect(url_for("main.index"))


def save_or_update(user_info):
    username = user_info["login"]
    user = User.query.filter_by(username=username).first()
    if user:
        user.email = user_info["email"]
    else:
        user = User(username=username, email=user_info["email"])
    db.session.add(user)
    db.session.commit()
    return user


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    revoke_access_token()
    flash("You have been logged out.")
    return redirect(url_for("main.index"))
