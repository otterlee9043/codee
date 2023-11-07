from . import main
from .. import db

from .filter import is_cd
from .merge import *
from .github_api import *
from .utils import *
import json, os, re, time, requests, base64
from flask import abort, render_template, g, request, session, current_app
from flask_login import current_user, login_required


@main.route("/", methods=["GET", "POST"])
def index():
    if current_user.is_authenticated:
        headers = {
            "Authorization": f"Bearer {session['access_token']}",
            "Accept": "application/vnd.github+json",
        }

        repos_resp = requests.get("https://api.github.com/user/repos", headers=headers)

        repos = None
        if repos_resp.ok:
            repo_list = repos_resp.json()
            repos = [
                {
                    "name": repo["name"],
                    "default_branch": repo["default_branch"],
                    "pushed_at": repo["pushed_at"],
                    "visibility": repo["visibility"],
                }
                for repo in repo_list
            ]
        return render_template("main/repos.html", repos=repos)
    else:
        return render_template("main/first.html")


@login_required
@main.route("/<path:filepath>", methods=["GET"])
def show_file(filepath):
    start = time.time()
    path_parts = filepath.split("/")
    if len(path_parts) >= 4:
        owner, repo, ref, content = filepath.split("/", maxsplit=3)
        g.owner = owner
        g.repo = repo
        tree = get_tree_of_repository(owner, repo, ref)
        if is_cd(content):
            ref_path, ref_content, codee_content = show_codee_file(
                owner, repo, ref, content
            )
            return render_template(
                "main/cd.html",
                ref_path=ref_path,
                ref_content=ref_content,
                codee_content=codee_content,
                tree=tree,
            )
        else:
            end = time.time()
            return render_template(
                "main/index.html",
                file_content=get_content_of_file(owner, repo, ref, content),
                tree=tree,
            )
    elif len(path_parts) == 3:
        owner, repo, ref = filepath.split("/", maxsplit=2)
        return render_template(
            "main/root.html", tree=get_tree_of_repository(owner, repo, ref), ref=ref
        )
    return "Illegal URL", 400


@login_required
@main.route("/update_codee", methods=["POST"])
def update_codee():
    json_data = request.get_json(force=True)
    codee_path = json_data["codee_path"]
    codee_content = json_data["codee_content"]
    g.repo = json_data["repo"]
    g.ref = json_data["ref"]
    owner = current_user.username

    resp = get_contents_api(owner, g.repo, g.ref, codee_path)
    resp_json = resp.json()

    if not resp_json.ok:
        return "Failed to get previous file content", 500

    blob_resp = create_blob_api(codee_content)
    if blob_resp.ok:
        contents_resp = create_contents_api(resp_json["sha", codee_content, codee_path])
        if contents_resp.ok:
            return "Codee file updated successfully", 200

    return "codee file updated", 200


@login_required
@main.route("/create_codee", methods=["POST"])
def create_codee():
    json_data = request.get_json(force=True)
    repo = json_data["repo"]
    save_location = json_data["save_location"]
    codee_name = json_data["codee_name"]
    ref_path = json_data["ref_path"]

    g.repo = repo

    last_commit_sha = None
    commit_list_resp = get_commit_list_api(repo, ref_path)
    if commit_list_resp.ok:
        commit_list_json = commit_list_resp.json()
        last_commit_sha = commit_list_json[0]["sha"]

        codee_content = init_codee(ref_path, last_commit_sha)
        request_body = {
            "message": "Codee 파일 생성",
            "content": codee_content,
        }

        resp = create_contents_api(request_body, f"{save_location}/{codee_name}.cd")
        if resp.ok:
            return "created codee file", 200

    return "Failed to create codee file", 500


@login_required
@main.route("/delete_codee", methods=["POST"])
def delete_codee():
    json_data = request.get_json()
    repo = json_data["repo"]
    ref = json_data["ref"]

    codee_path = json_data["codee_path"]
    owner = current_user.username

    blob_resp = get_contents_api(owner, repo, ref, codee_path)
    if blob_resp.ok:
        blob_resp_json = blob_resp.json()
        blob_sha = blob_resp_json["sha"]

        request_body = {"message": "Codee 파일 삭제", "sha": blob_sha}
        resp = delete_contents_api(repo, codee_path, request_body)
        if resp.ok:
            return "deleted codee file", 200
        else:
            return "fail to delete", 500
    else:
        return "wrong codee path", 500
