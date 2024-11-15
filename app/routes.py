from flask import render_template
from app import app
import requests
import xml.etree.ElementTree as ET

api_info = {
    'mkt': {
        'url': "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc",
        'key': "38311-Hreg9h7SZdmH"
    },
    'mor': {
        'url': "https://marshall-mor.sona-systems.com/services/SonaAPI.svc",
        'key': "37312-sXnXTHAp6dXa"
    },
    'compensated': {
        'url': "https://marshall-research.sona-systems.com/services/SonaAPI.svc",
        'key': "20937-sBjkuZGG89A6"
    }
}

@app.route('/')
@app.route('/index')
def index():
    all_studies = {}
    location_data = {}

    for location, info in api_info.items():
        studies = fetch_studies(info['url'], info['key'])
        unique_studies = {study['id']: study for study in studies if study['id'] not in all_studies}  # Ensure global uniqueness
        all_studies.update(unique_studies)  # Update global dictionary to include newly added unique studies

        # Fetch stats and calculate total duration for unique studies
        total_duration = 0
        for study_id, study in unique_studies.items():
            stats = fetch_id_stats(study_id, info['url'], info['key'])
            study.update(stats)

            if 'participated_amount' in study and 'duration' in study:
                participated = int(study['participated_amount'])
                duration = int(study['duration'])
                total_duration += participated * duration / 60  # Convert to hours
        
        location_data[location] = {
            'studies': list(unique_studies.values()),
            'total_duration': round(total_duration, 2)
        }

    return render_template('index.html', location_data=location_data)

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

def fetch_id_stats(id, api_url, api_key):
    full_url = f"{api_url}/SonaGetStudyStats"
    params = {
        "api_key": api_key,
        "experiment_id": id
    }
    response = requests.get(full_url, params=params)
    return parse_statsxml_to_json(response.text) if response.status_code == 200 else {}

def parse_listxml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    return [{
        "id": schedule.find('a:experiment_id', namespaces=namespace).text,
        "study_name": schedule.find('a:study_name', namespaces=namespace).text,
        "duration": schedule.find('a:duration', namespaces=namespace).text,
        "participated_amount": schedule.find('a:participated_count', namespaces=namespace).text if schedule.find('a:participated_count', namespaces=namespace) else '0'
    } for schedule in root.findall('.//a:APIStudySchedule', namespaces=namespace)]

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
