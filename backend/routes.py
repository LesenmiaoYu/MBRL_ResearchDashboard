from flask import jsonify
from app import app, db
from flask import jsonify
from models import MetaInfo, PastProgress
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from pytz import timezone

# API pool information
API_INFO = {
    'mkt': {
        'url': "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc",
        'key': "38311-Hreg9h7SZdmH"
    },
    'mor': {
        'url': "https://marshall-mor.sona-systems.com/services/SonaAPI.svc",
        'key': "37312-sXnXTHAp6dXa"
    },
    'comp': {
        'url': "https://marshall-research.sona-systems.com/services/SonaAPI.svc",
        'key': "20937-sBjkuZGG89A6"
    }
}


@app.route('/get-meta', methods=['GET'])
def get_meta():
    try:
        meta = MetaInfo.query.first()
        if meta:
            return jsonify({
                "goal_mkt": meta.goal_mkt,
                "goal_mor": meta.goal_mor,
                "goal_comp": meta.goal_comp,
                "admin_id": meta.admin_id,
                "admin_key": meta.admin_key
            }), 200
        else:
            return jsonify({"error": "Meta information not found"}), 404
    except Exception as e:
        print(f"Error fetching meta info: {e}")
        return jsonify({"error": "An error occurred"}), 500

@app.route('/aggregate-durations', methods=['GET'])
def aggregate_durations():
    aggregate_data = {
        "aggregate_mkt_hours": 0,
        "aggregate_mor_hours": 0,
        "aggregate_comp_hours": 0
    }

    for location, info in API_INFO.items():
        studies = fetch_studies(info['url'], info['key'])
        unique_studies = {study['id']: study for study in studies}  # Ensure unique studies

        total_duration = 0
        for study_id, study in unique_studies.items():
            stats = fetch_id_stats(study_id, info['url'], info['key'])
            study.update(stats)

            if 'participated_amount' in study and 'duration' in study:
                participated = int(study['participated_amount'])
                duration = int(study['duration'])
                total_duration += participated * duration / 60  # Convert to hours

        if location == 'mkt':
            aggregate_data["aggregate_mkt_hours"] = round(total_duration, 2)
        elif location == 'mor':
            aggregate_data["aggregate_mor_hours"] = round(total_duration, 2)
        elif location == 'comp':
            aggregate_data["aggregate_comp_hours"] = round(total_duration, 2)

    # Add timestamp
    aggregate_data["timestamp"] = datetime.utcnow()

    # Insert into PastProgress table
    past_progress_entry = PastProgress(
        timestamp=aggregate_data["timestamp"],
        aggregate_mkt_hours=aggregate_data["aggregate_mkt_hours"],
        aggregate_mor_hours=aggregate_data["aggregate_mor_hours"],
        aggregate_comp_hours=aggregate_data["aggregate_comp_hours"]
    )
    db.session.add(past_progress_entry)
    db.session.commit()

    return jsonify({
        "message": "Aggregated durations added to past_progress table",
        "data": aggregate_data
    }), 200


# Fetch All Studies for a Pool
def fetch_studies(api_url, api_key):
    full_url = f"{api_url}/SonaGetStudyScheduleList"
    params = {
        "api_key": api_key,
        "location_id": -2,
        "start_date": "2024-06-01",
        "end_date": "2024-12-31",
        "lab_only": 0
    }
    response = requests.get(full_url, params=params)
    return parse_listxml_to_json(response.text) if response.status_code == 200 else []

# Fetch Detailed Stats for a Study
def fetch_id_stats(id, api_url, api_key):
    full_url = f"{api_url}/SonaGetStudyStats"
    params = {
        "api_key": api_key,
        "experiment_id": id
    }
    response = requests.get(full_url, params=params)
    return parse_statsxml_to_json(response.text) if response.status_code == 200 else {}

# Parse Study List XML to JSON
def parse_listxml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    return [
        {
            "id": schedule.find('a:experiment_id', namespaces=namespace).text,
            "study_name": schedule.find('a:study_name', namespaces=namespace).text,
            "location": schedule.find('a:location', namespaces=namespace).text,
            "duration": schedule.find('a:duration', namespaces=namespace).text
        }
        for schedule in root.findall('.//a:APIStudySchedule', namespaces=namespace)
    ]

# Parse Stats XML to JSON
def parse_statsxml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    result = root.find('.//a:Result', namespaces=namespace)
    if result:
        participated = result.find('a:participated_count', namespaces=namespace).text
        return {"participated_amount": participated}
    return {}

@app.route('/get-past-progress', methods=['GET'])
def get_past_progress():
    pst = timezone('US/Pacific')
    entries_by_date = {}

    # Fetch all entries ordered by timestamp descending
    progress_entries = PastProgress.query.order_by(PastProgress.timestamp.desc()).all()

    for entry in progress_entries:
        # Convert timestamp to PST
        pst_timestamp = entry.timestamp.astimezone(pst) - timedelta(hours=8)
        date_key = pst_timestamp.date()  # Use only the date part for grouping

        # Keep only the first entry for each date (most recent in descending order)
        if date_key not in entries_by_date:
            entries_by_date[date_key] = {
                "timestamp": pst_timestamp.isoformat(),
                "aggregate_mkt_hours": entry.aggregate_mkt_hours,
                "aggregate_mor_hours": entry.aggregate_mor_hours,
                "aggregate_comp_hours": entry.aggregate_comp_hours
            }

    # Return the filtered results as a list
    result = list(entries_by_date.values())
    return jsonify(result), 200


@app.route('/fetch-live-studies', methods=['GET'])
def fetch_live_studies():
    live_studies = {}

    for pool, api_info in API_INFO.items():
        studies = fetch_studies(api_info['url'], api_info['key'])  # Fetch basic study info
        unique_studies = {study["id"]: study for study in studies}  # Ensure unique studies by id

        live_studies[pool] = []

        for study_id, study in unique_studies.items():
            # Fetch detailed stats for the study
            stats = fetch_id_stats(study_id, api_info['url'], api_info['key'])
            participated_amount = int(stats.get("participated_amount", 0))

            # Discard the study if participated_amount is 0
            if participated_amount > 0:
                live_studies[pool].append({
                    "study_name": study["study_name"],
                    "location": "online" if "online" in study["location"].lower() else "in-person",
                    "duration": int(study["duration"]),
                    "participated_amount": participated_amount,
                })

    return jsonify(live_studies), 200

