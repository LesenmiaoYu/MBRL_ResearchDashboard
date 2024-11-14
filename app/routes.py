from flask import render_template
from app import app
import requests
import xml.etree.ElementTree as ET

@app.route('/')
@app.route('/index')
def index():
    study_data = fetch_studies()
    unique_studies = {study['id']: study for study in study_data}  # Use dictionary to ensure uniqueness by ID

    total_duration = 0
    # Fetch and update stats only for unique studies
    for study_id in unique_studies:
        stats = fetch_id_stats(study_id)
        unique_studies[study_id].update(stats)  # Merge stats into each unique study

        # Calculate total duration
        if 'participated_amount' in unique_studies[study_id] and 'duration' in unique_studies[study_id]:
            participated = int(unique_studies[study_id]['participated_amount'])
            duration = int(unique_studies[study_id]['duration'])
            total_duration += participated * duration / 60  # Convert to hours

    # Convert dictionary back to list for rendering
    final_data = list(unique_studies.values())
    total_duration = round(total_duration,2)
    return render_template('index.html', study_data=final_data, total_duration=total_duration)

def fetch_studies():
    api_url = "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc/SonaGetStudyScheduleList"
    api_key = "38311-Hreg9h7SZdmH"
    params = {
        "api_key": api_key,
        "location_id": -2,
        "start_date": "2024-06-01",
        "end_date": "2024-12-31",
        "lab_only": 0
    }
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        return parse_listxml_to_json(response.text)
    else:
        return []

def fetch_id_stats(id):
    api_url = "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc/SonaGetStudyStats"
    api_key = "38311-Hreg9h7SZdmH"
    params = {
        "api_key": api_key,
        "experiment_id": id
    }
    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        return parse_statsxml_to_json(response.text)
    else:
        return {}

def parse_listxml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    study_list = []
    for schedule in root.findall('.//a:APIStudySchedule', namespaces=namespace):
        exp_id = schedule.find('a:experiment_id', namespaces=namespace).text
        study_name = schedule.find('a:study_name', namespaces=namespace).text
        duration = schedule.find('a:duration', namespaces=namespace).text
        study_list.append({"id": exp_id, "study_name": study_name, "duration": duration})
    return study_list

def parse_statsxml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    result = root.find('.//a:Result', namespaces=namespace)
    if result:
        participated = result.find('a:participated_count', namespaces=namespace).text
        return {"participated_amount": participated}
    return {}

if __name__ == '__main__':
    app.run(debug=True)
