from flask import render_template
from app import app
import requests
import xml.etree.ElementTree as ET

@app.route('/')
@app.route('/index')
def index():
    # Fetch studies when the page loads
    study_data = fetch_studies()
    return render_template('index.html', study_data=study_data)

def fetch_studies():
    api_url = "https://marshall-mkt.sona-systems.com/services/SonaAPI.svc/SonaGetStudyScheduleList"
    api_key = "38311-Hreg9h7SZdmH"  # Ensure your API key is handled securely
    params = {
        "api_key": api_key,
        "location_id": -2,
        "start_date": "2024-06-01",
        "end_date": "2024-12-31",
        "lab_only": 0
    }

    response = requests.get(api_url, params=params)
    if response.status_code == 200:
        return parse_xml_to_json(response.text)
    else:
        return []

def parse_xml_to_json(xml_data):
    namespace = {'a': 'http://schemas.datacontract.org/2004/07/emsdotnet.sonasystems'}
    root = ET.fromstring(xml_data)
    schedules = []
    for schedule in root.findall('.//a:APIStudySchedule', namespaces=namespace):
        study_name = schedule.find('a:study_name', namespace).text
        location = schedule.find('a:location', namespace).text
        schedules.append({"study_name": study_name, "location": location})
    return schedules
