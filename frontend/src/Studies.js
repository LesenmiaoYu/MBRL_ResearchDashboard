import React, { useState, useEffect } from "react";

function Studies() {
    const [currentStudies, setCurrentStudies] = useState({});
    const [pastProgress, setPastProgress] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [loadingProgress, setLoadingProgress] = useState(true);
    const [loadingStudies, setLoadingStudies] = useState(true);

    useEffect(() => {
        // Call each API endpoint separately
        fetchMetaData();
    }, []);

    // Fetch Meta Data
const fetchMetaData = () => {
    fetch("http://127.0.0.1:5000/get-meta", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Meta Data fetch failed: ${response.status}`);
            }
            console.log(response)
            return response.json(); // Directly parse JSON if API is expected to return valid JSON
        })
        .then((result) => {
            console.log("Fetched Meta Data:", result);

            // Validate and map the data
            const data = {
                admin_id: result.admin_id || "N/A",
                admin_key: result.admin_key || "N/A",
                goal_mkt: result.goal_mkt || "Unknown",
                goal_mor: result.goal_mor || "Unknown",
                goal_comp: result.goal_comp || "Unknown"
            };

            console.log("Parsed Meta Data:", data);
            setMetaData(data);

        })
        .catch((error) => {
            console.error("Error fetching Meta Data:", error);
        });
};



    return (
        <div>
            <h1>Studies Dashboard</h1>

            {/* Meta Information */}
            <section>
                <h2>Meta Information</h2>
                <p>Goal MKT: {metaData.goal_mkt}</p>
                <p>Goal MOR: {metaData.goal_mor}</p>
                <p>Goal COMP: {metaData.goal_comp}</p>
            </section>

            {/* Current Studies */}
            <section>
                <h2>Current Studies</h2>
                {Object.keys(currentStudies).map((pool) => (
                    <div key={pool}>
                        <h3>{pool.toUpperCase()} Studies</h3>
                        {currentStudies[pool].map((study, index) => (
                            <div key={index}>
                                <h4>{study.study_name}</h4>
                                <p>Location: {study.location}</p>
                                <p>Duration: {study.duration} minutes</p>
                                <p>Participated Amount: {study.participated_amount}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </section>

            {/* Past Progress Visualization */}
            <section>
                <h2>Past Progress</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Aggregate MKT Hours</th>
                            <th>Aggregate MOR Hours</th>
                            <th>Aggregate COMP Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pastProgress.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                                <td>{entry.aggregate_mkt_hours.toFixed(2)}</td>
                                <td>{entry.aggregate_mor_hours.toFixed(2)}</td>
                                <td>{entry.aggregate_comp_hours.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default Studies;
