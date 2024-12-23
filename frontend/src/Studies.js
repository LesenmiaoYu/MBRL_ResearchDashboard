import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import './styles.css';


function Studies() {
    const [currentStudies, setCurrentStudies] = useState({});
    const [pastProgress, setPastProgress] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [loading, setLoading] = useState({
        aggregateDurations: true,
        currentStudies: true,
        pastProgress: true,
        metaData: true,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        // Call each API endpoint separately
        callAggregateDurations();
        fetchPastProgress();
        fetchCurrentStudies();
        fetchMetaData();
    }, []);

    const callAggregateDurations = () => {
    fetch("http://127.0.0.1:5000/aggregate-durations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to aggregate durations: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            //console.log("Aggregated Durations:", data);
            setLoading((prev) => ({ ...prev, aggregateDurations: false }));
        })
        .catch((error) => {
            console.error("Error calling aggregate-durations:", error);
            setError("Error aggregating durations.");
            setLoading((prev) => ({ ...prev, aggregateDurations: false }));
        });
    };

    const fetchCurrentStudies = () => {
    fetch("http://127.0.0.1:5000/fetch-live-studies", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch studies: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            //console.log("Fetched Current Studies:", data);
            setCurrentStudies(data);
            setLoading((prev) => ({ ...prev, currentStudies: false }));
        })
        .catch((error) => {
            console.error("Error fetching live studies:", error);
            setError("Error fetching current studies.");
            setLoading((prev) => ({ ...prev, currentStudies: false }));
        });
    };

    const fetchPastProgress = () => {
    fetch("http://127.0.0.1:5000/get-past-progress", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch past progress: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            //console.log("Fetched Past Progress:", data);
            setPastProgress(data); // Assuming you have a state variable `pastProgress`
            setLoading((prev) => ({ ...prev, pastProgress: false }));

        })
        .catch((error) => console.error("Error fetching past progress:", error));
         setError("Error fetching past progress.");
        setLoading((prev) => ({ ...prev, pastProgress: false }));

    };

    // Fetch Meta Data
    const fetchMetaData = () => {
        fetch("http://127.0.0.1:5000/get-meta", {
            method: "GET",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Meta Data fetch failed: ${response.status}`);
                }
                //console.log(response)
                return response.json(); // Directly parse JSON if API is expected to return valid JSON
            })
            .then((result) => {
                //console.log("Fetched Meta Data:", result);

                // Validate and map the data
                const data = {
                    admin_id: result.admin_id || "N/A",
                    admin_key: result.admin_key || "N/A",
                    goal_mkt: result.goal_mkt || "Unknown",
                    goal_mor: result.goal_mor || "Unknown",
                    goal_comp: result.goal_comp || "Unknown"
                };

                //console.log("Parsed Meta Data:", data);
                setMetaData(data);
                setLoading((prev) => ({ ...prev, metaData: false }));

            })
            .catch((error) => {
                console.error("Error fetching Meta Data:", error);
                setError("Error fetching meta data.");
                setLoading((prev) => ({ ...prev, metaData: false }));
            });
    };

    const isLoading = Object.values(loading).some((status) => status);


    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full height of the viewport
            }}>
                <Loader/>
            </div>
        );
    }

 return (
        <div>

            <div className="card-container">

                {/*META INFO*/}

                {/*<div className="card">*/}
                {/*    <h2>Meta Information</h2>*/}
                {/*    <p>Goal MKT: {metaData.goal_mkt}</p>*/}
                {/*    <p>Goal MOR: {metaData.goal_mor}</p>*/}
                {/*    <p>Goal COMP: {metaData.goal_comp}</p>*/}
                {/*</div>*/}

                {/*EACH OF THREE POOLS*/}

                {/*{Object.keys(currentStudies).map((pool) => (*/}
                {/*    <div key={pool} className="card">*/}
                {/*        <h3>{pool.toUpperCase()} Studies</h3>*/}
                {/*        {currentStudies[pool].map((study, index) => (*/}
                {/*            <div key={index}>*/}
                {/*                <h4>{study.study_name} ({study.location})</h4>*/}
                {/*                <p>Duration: {study.duration} minutes</p>*/}
                {/*                <p>Participated Amount: {study.participated_amount}</p>*/}
                {/*            </div>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*))}*/}

                <div className="table-card">
                    <h2>Past Progress</h2>
                    <table>
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
                </div>
            </div>
        </div>
    );
}

export default Studies;
