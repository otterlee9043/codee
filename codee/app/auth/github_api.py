from flask import session
import os, requests, json


def call_token_exchange_api(code):
    query = {
        "client_id": os.environ.get("GITHUB_OAUTH_CLIENT_ID"),
        "client_secret": os.environ.get("GITHUB_OAUTH_CLIENT_SECRET"),
        "code": code,
    }
    headers = {"Accept": "application/json"}
    token_resp = requests.post(
        "https://github.com/login/oauth/access_token", params=query, headers=headers
    )
    return token_resp


def call_user_api():
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {session['access_token']}",
    }
    user_resp = requests.get("https://api.github.com/user", headers=headers)
    return user_resp


def revoke_access_token():
    resp = call_token_revocation_api()
    if resp.ok:
        session.pop("access_token", None)
    else:
        print(
            f"Failed to revoke access token: {resp.status_code} - {resp.json()['message']}"
        )


def call_token_revocation_api():
    access_token = session["access_token"]
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    }
    resp = requests.delete(
        f"https://api.github.com/applications/{os.environ.get('GITHUB_OAUTH_CLIENT_ID')}/token",
        headers=headers,
        data=json.dumps({"access_token": access_token}),
    )
    return resp
