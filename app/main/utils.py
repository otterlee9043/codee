import json, base64


def init_codee(ref_path, last_commit_sha):
    codee_content = json.dumps(
        {
            "referenced_file": ref_path,
            "last_commit_sha": last_commit_sha,
            "data": json.dumps({}),
        }
    )
    return base64.b64encode(codee_content.encode("utf-8")).decode("utf-8")
