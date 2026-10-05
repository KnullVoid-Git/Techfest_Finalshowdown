#!/usr/bin/env python3
"""
BREACH — Final Showdown CTF Server
Provides static asset serving along with secure server-side Round 1 validation
and team progress tracking. Zero third-party dependencies (pure Python 3 stdlib).
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.parse
import datetime
import threading

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
HOST = "127.0.0.1"

# Secure server-side password configuration
# Can be overridden via ROUND1_PASSWORD environment variable.
# NEVER exposed to clients or in API responses.
ROUND1_PASSWORD = os.environ.get("ROUND1_PASSWORD", "PrachetRay2005")

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "teams_db.json")
DB_LOCK = threading.Lock()

DEFAULT_TEAMS = {
    "team-alpha": {
        "teamId": "team-alpha",
        "teamName": "Team Alpha",
        "round1": {
            "completed": False,
            "attempts": 0,
            "completedAt": None
        }
    },
    "team-beta": {
        "teamId": "team-beta",
        "teamName": "Team Beta",
        "round1": {
            "completed": False,
            "attempts": 0,
            "completedAt": None
        }
    },
    "team-gamma": {
        "teamId": "team-gamma",
        "teamName": "Team Gamma",
        "round1": {
            "completed": False,
            "attempts": 0,
            "completedAt": None
        }
    }
}


def load_db():
    with DB_LOCK:
        if not os.path.exists(DB_FILE):
            save_db_unlocked(DEFAULT_TEAMS)
            return dict(DEFAULT_TEAMS)
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return dict(DEFAULT_TEAMS)


def save_db_unlocked(data):
    try:
        temp_file = DB_FILE + ".tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(temp_file, DB_FILE)
    except Exception as e:
        print(f"[ERROR] Failed to save DB: {e}", file=sys.stderr)


def save_db(data):
    with DB_LOCK:
        save_db_unlocked(data)


def get_or_create_team(team_id, team_name=None):
    clean_id = team_id.strip().lower()
    data = load_db()
    if clean_id not in data:
        data[clean_id] = {
            "teamId": clean_id,
            "teamName": team_name.strip() if team_name else f"Team {clean_id.replace('-', ' ').title()}",
            "round1": {
                "completed": False,
                "attempts": 0,
                "completedAt": None
            }
        }
        save_db(data)
    return data[clean_id]


class BreachHandler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, status_code, data):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API: Get list of teams
        if path == "/api/teams":
            data = load_db()
            teams_list = [
                {"teamId": t["teamId"], "teamName": t["teamName"]}
                for t in data.values()
            ]
            self.send_json(200, {"teams": teams_list})
            return

        # API: Get Round 1 status for a specific team
        if path == "/api/round1/status":
            team_id = query.get("teamId", ["team-alpha"])[0]
            team = get_or_create_team(team_id)
            r1 = team.get("round1", {})
            self.send_json(200, {
                "teamId": team["teamId"],
                "teamName": team["teamName"],
                "completed": bool(r1.get("completed", False)),
                "attempts": int(r1.get("attempts", 0)),
                "completedAt": r1.get("completedAt")
            })
            return

        # API: Admin overview of all teams
        if path == "/api/admin/teams":
            data = load_db()
            teams_status = []
            for t in data.values():
                r1 = t.get("round1", {})
                teams_status.append({
                    "teamId": t["teamId"],
                    "teamName": t["teamName"],
                    "completed": bool(r1.get("completed", False)),
                    "attempts": int(r1.get("attempts", 0)),
                    "completedAt": r1.get("completedAt")
                })
            self.send_json(200, {"teams": teams_status})
            return

        # Fallback to static file server
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Read JSON body
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            body = json.loads(body_bytes.decode("utf-8"))
        except Exception:
            body = {}

        # API: Create / Switch Team
        if path == "/api/team/create":
            team_id = body.get("teamId", "").strip().lower()
            team_name = body.get("teamName", "").strip()
            if not team_id:
                self.send_json(400, {"error": "teamId is required"})
                return
            team = get_or_create_team(team_id, team_name)
            self.send_json(200, {
                "success": True,
                "teamId": team["teamId"],
                "teamName": team["teamName"]
            })
            return

        # API: Verify Round 1 Password Server-Side
        if path == "/api/round1/verify":
            team_id = body.get("teamId", "team-alpha").strip().lower()
            submitted = body.get("password", "")

            # Server-side validation rules:
            # 1. Trim leading and trailing spaces
            # 2. Case-insensitive comparison
            trimmed_submitted = submitted.strip().lower()
            correct_normalized = ROUND1_PASSWORD.strip().lower()

            data = load_db()
            if team_id not in data:
                get_or_create_team(team_id)
                data = load_db()

            team = data[team_id]
            r1 = team.setdefault("round1", {"completed": False, "attempts": 0, "completedAt": None})

            if trimmed_submitted == correct_normalized:
                # Correct password
                r1["completed"] = True
                if not r1.get("completedAt"):
                    r1["completedAt"] = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC")
                save_db(data)
                self.send_json(200, {
                    "success": True,
                    "completed": True,
                    "attempts": r1["attempts"],
                    "completedAt": r1["completedAt"]
                })
            else:
                # Incorrect password
                r1["attempts"] = r1.get("attempts", 0) + 1
                save_db(data)
                self.send_json(200, {
                    "success": False,
                    "completed": False,
                    "attempts": r1["attempts"],
                    "error": "INCORRECT PASSWORD\nTRY AGAIN"
                })
            return

        # API: Admin Reset Team
        if path == "/api/admin/reset-team":
            team_id = body.get("teamId", "").strip().lower()
            data = load_db()
            if team_id in data:
                data[team_id]["round1"] = {
                    "completed": False,
                    "attempts": 0,
                    "completedAt": None
                }
                save_db(data)
                self.send_json(200, {"success": True, "teamId": team_id})
            elif team_id == "all":
                for t in data.values():
                    t["round1"] = {
                        "completed": False,
                        "attempts": 0,
                        "completedAt": None
                    }
                save_db(data)
                self.send_json(200, {"success": True, "reset": "all"})
            else:
                self.send_json(404, {"error": "Team not found"})
            return

        self.send_json(404, {"error": "Endpoint not found"})


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with ReusableTCPServer((HOST, PORT), BreachHandler) as httpd:
        print(f"==================================================")
        print(f"BREACH — Final Showdown Server active")
        print(f"URL: http://{HOST}:{PORT}/")
        print(f"Secure Server-Side Password Auth: ACTIVE")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")


if __name__ == "__main__":
    run_server()
