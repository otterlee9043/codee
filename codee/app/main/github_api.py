from flask import session, g
from flask_login import current_user
import requests, json


def request_header(token, additional_header=None):
    header = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }
    if additional_header:
        header.update(additional_header)
    return header


def create_blob_api(content):
    return requests.post(
        f"https://api.github.com/repos/{current_user.username}/{g.repo}/git/blobs",
        data=json.dumps({"content": content, "encoding": "utf-8"}),
        headers=request_header(session["access_token"]),
    )


def get_contents_api(owner, repo, ref, path):
    return requests.get(
        f"https://api.github.com/repos/{owner}/{repo}/contents/{path}",
        params={"ref": ref},
        headers=request_header(session["access_token"]),
    )


def create_contents_api(body, path):
    print("body")
    print(body)
    print("path")
    print(path)
    print("current_user.username")
    print(current_user.username)
    print("g.repo")
    return requests.put(
        f"https://api.github.com/repos/{current_user.username}/{g.repo}/contents/{path}",
        data=json.dumps(body),
        headers=request_header(session["access_token"]),
    )


def delete_contents_api(repo, path, body):
    return requests.delete(
        f"https://api.github.com/repos/{current_user.username}/{repo}/contents/{path}",
        data=json.dumps(body),
        headers=request_header(session["access_token"]),
    )


def get_commit_list_api(repo, file_path, param={}):
    return requests.get(
        f"https://api.github.com/repos/{current_user.username}/{repo}/commits",
        params=dict({"path": file_path}, **param),
        headers=request_header(session["access_token"]),
    )


def get_commit_api(owner, repo, ref):
    return requests.get(
        f"https://api.github.com/repos/{owner}/{repo}/commits/{ref}",
        headers=request_header(session["access_token"]),
    )


def get_tree_api(owner, repo, sha):
    return requests.get(
        f"https://api.github.com/repos/{owner}/{repo}/git/trees/{sha}",
        params={"recursive": 1},
        headers=request_header(session["access_token"]),
    )
