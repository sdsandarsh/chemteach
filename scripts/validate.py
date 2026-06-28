import json
import os
import html
import re

def validate_project():
    print("Starting validation of ChemTeach project...\n")
    
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schedule_path = os.path.join(project_root, 'SCHEDULE.json')
    
    if not os.path.exists(schedule_path):
        print(f"[ERROR] SCHEDULE.json not found at {schedule_path}")
        return False

    with open(schedule_path, 'r', encoding='utf-8') as f:
        try:
            schedule = json.load(f)
        except json.JSONDecodeError as e:
            print(f"[ERROR] SCHEDULE.json is not valid JSON. {e}")
            return False

    sessions = schedule.get('sessions', [])
    if not sessions:
        print("[ERROR] No sessions found in SCHEDULE.json")
        return False

    errors = 0
    warnings = 0
    files_checked = 0

    # Pre-compile regex patterns for efficiency
    session_id_pattern = re.compile(r"const\s+SESSION_ID\s*=\s*['\"]([^'\"]+)['\"];")
    last_opened_pattern = re.compile(r"ChemProgress\.setLastOpened\(\s*(\d+)\s*,\s*(\d+)\s*,\s*['\"]([^'\"]+)['\"]\s*\)")
    data_config_pattern = re.compile(r"data-config\s*=\s*'([^']+)'")

    for session_data in sessions:
        session_id = session_data.get('sessionId')
        file_path_rel = session_data.get('file')
        chapter = session_data.get('chapter')
        week = session_data.get('week')
        session_lbl = session_data.get('session')

        if not all([session_id, file_path_rel, chapter, week, session_lbl]):
            print(f"[ERROR] Missing required fields in SCHEDULE.json for session: {session_id}")
            errors += 1
            continue

        file_path_abs = os.path.join(project_root, os.path.normpath(file_path_rel))
        
        # 1. File exists check
        if not os.path.exists(file_path_abs):
            print(f"[ERROR] File not found: {file_path_rel}")
            errors += 1
            continue

        with open(file_path_abs, 'r', encoding='utf-8') as f:
            content = f.read()
            files_checked += 1

        # 2. SESSION_ID check
        match_id = session_id_pattern.search(content)
        if not match_id:
            print(f"[ERROR] In {file_path_rel}: SESSION_ID const not found.")
            errors += 1
        elif match_id.group(1) != session_id:
            print(f"[ERROR] In {file_path_rel}: SESSION_ID mismatch. Expected '{session_id}', found '{match_id.group(1)}'")
            errors += 1

        # 3. setLastOpened check
        match_opened = last_opened_pattern.search(content)
        if not match_opened:
            print(f"[ERROR] In {file_path_rel}: ChemProgress.setLastOpened not found.")
            errors += 1
        else:
            file_chapter = int(match_opened.group(1))
            file_week = int(match_opened.group(2))
            file_session_lbl = match_opened.group(3)
            if file_chapter != chapter or file_week != week or file_session_lbl != session_lbl:
                print(f"[ERROR] In {file_path_rel}: setLastOpened arguments mismatch. "
                      f"Expected ({chapter}, {week}, '{session_lbl}'), "
                      f"found ({file_chapter}, {file_week}, '{file_session_lbl}')")
                errors += 1

        # 4. JSON data-config check
        configs = data_config_pattern.findall(content)
        for idx, config_str in enumerate(configs):
            # Unescape HTML entities (e.g. &#39; -> ')
            json_str = html.unescape(config_str)
            try:
                json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"[ERROR] In {file_path_rel}: Invalid JSON in data-config (Index {idx}).\n"
                      f"Details: {e}\nRaw String: {config_str[:100]}...")
                errors += 1

    print(f"\n--- Validation Summary ---")
    print(f"Files Checked: {files_checked}")
    if errors == 0:
        print("[SUCCESS] No errors found. All configurations, paths, and identifiers are valid.")
        return True
    else:
        print(f"[FAILED] Found {errors} error(s).")
        return False

if __name__ == '__main__':
    validate_project()
