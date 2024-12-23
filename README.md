# Research Dashboard: Documentation & User Manual
## Overview
The Research Dashboard is a web-based platform designed to streamline and centralize the management and analysis of studies across multiple research pools (mkt, mor, and comp). It provides real-time insights, dynamic data fetching, and historical progress tracking.

#### Files referenced: 

Figma file: https://www.figma.com/design/BKe8LJxBNVQOdujUGLiIEF/MBRL-Dash?node-id=0-1&t=RI5nj6Pi4pLH5Ksd-1

SONA Api Doc: https://www.sona-systems.com/support/docs/sona_api_docs.pdf

## Core Features
- Dynamic Data Fetching: Fetch live study data directly from APIs without redundant database storage.
- Participation Insights: Display aggregated participation metrics and durations for all studies.
- Real-Time Display: Dynamically display study information grouped by location and participation mode (online or in-person).
- Historical Tracking: Track daily progress with timestamped entries for each pool's aggregated hours.
- User Validation: Integrate user validation and authentication mechanisms (planned for future iterations, utilizing the MetaInfo table for admin credentials).
## Key Functionalities
### 1. Real-Time Studies
Fetch and display study data dynamically from third-party APIs without storing unnecessary data in the database.

#### Workflow:
Studies are grouped by research pool (mkt, mor, comp).
Participation mode (online or in-person) is dynamically determined based on metadata.
Duplicate studies are filtered using unique identifiers (id).
Studies with zero participation are excluded to ensure meaningful data.
#### Implementation:
The frontend triggers API calls to fetch live data dynamically.
The backend ensures data integrity by fetching detailed participation stats for each unique study.
### 2. Past Data Aggregation & Tracking
Aggregate and store daily participation metrics for historical analysis and progress tracking.

#### Workflow:
Aggregate total participation hours for each research pool (mkt, mor, comp) daily.
Store aggregated data in the PastProgress table with a UTC timestamp.
Convert timestamps to PST on the frontend for user-friendly display.
#### Implementation:
Data is aggregated dynamically via backend logic.
The frontend fetches and displays progress metrics in a tabular format, showing daily trends for each pool.
## Database Schema
### 1. MetaInfo Table
Stores global system configurations.

**`MetaInfo` Table**

| **Column**  | **Type**  | **Description**                     |
|-------------|-----------|-------------------------------------|
| `goal_mkt`  | Integer   | Participation goal for `mkt`.      |
| `goal_mor`  | Integer   | Participation goal for `mor`.      |
| `goal_comp` | Integer   | Participation goal for `comp`.     |
| `admin_id`  | String    | Admin identifier.                  |
| `admin_key` | String    | Admin key for API access.          |


### 2. PastProgress Table
Tracks daily aggregated participation metrics.
**`PastProgress` Table**

| **Column**             | **Type**  | **Description**                                  |
|------------------------|-----------|-------------------------------------------------|
| `timestamp`            | DateTime  | UTC timestamp of the entry.                     |
| `aggregate_mkt_hours`  | Float     | Total participation hours for `mkt`.           |
| `aggregate_mor_hours`  | Float     | Total participation hours for `mor`.           |
| `aggregate_comp_hours` | Float     | Total participation hours for `comp`.          |

## Technical Workflow
1. Live Data Fetching
Frontend triggers /fetch-live-studies to fetch real-time data.
Backend queries the API, filters duplicates, and processes participation data.
2. Data Aggregation
Backend processes /aggregate-durations daily to store historical metrics.
Frontend queries /get-past-progress to display historical trends.
3. Meta Information
Fetches system-wide configurations via /get-meta.
## Setup Guide
### Prerequisites
Install Python 3.7+ and Node.js 16+.
Ensure pip and npm are installed.

1. Navigate to the backend directory:

   cd backend

   python -m venv venv

   venv\Scripts\activate (this puts everything into a virtual environment so you won't have to worry about it messing anything up)
   
   pip install -r requirements.txt

   python build_db.py

   flask run

2. Navigate to the frontend directory:
   
   cd frontend

   npm install

   npm start

Flask backend: http://127.0.0.1:5000/

React frontend: http://127.0.0.1:3000/


-----
## FAQ
1. *What happens if an API call fails?* The system handles failures gracefully by returning partial data for successful pools and logging errors for failed requests.
2. *How are duplicates handled?* Studies are deduplicated by their unique id.
3. *What happens if no participation is recorded?* Studies with participated_amount == 0 are excluded from the results.
-----
## Contact
For further questions or assistance, please reach out to me: dyu18149@usc.edu (OR on Teams)