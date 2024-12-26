import React, { useState, useEffect } from "react";
import Loader from "./components/Loader";
import './styles.css';
import StackedGraph from "./components/StackedGraph";
import ProgressBar from "./components/ProgressBar";


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

    const [displayMode, setDisplayMode] = useState("chart");
    const [selectedPool, setSelectedPool] = useState("mkt"); // Default to MKT pool


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
                setLoading((prev) => ({...prev, aggregateDurations: false}));
            })
            .catch((error) => {
                console.error("Error calling aggregate-durations:", error);
                setError("Error aggregating durations.");
                setLoading((prev) => ({...prev, aggregateDurations: false}));
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
                setLoading((prev) => ({...prev, currentStudies: false}));
            })
            .catch((error) => {
                console.error("Error fetching live studies:", error);
                setError("Error fetching current studies.");
                setLoading((prev) => ({...prev, currentStudies: false}));
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
                setLoading((prev) => ({...prev, pastProgress: false}));

            })
            .catch((error) => console.error("Error fetching past progress:", error));
        setError("Error fetching past progress.");
        setLoading((prev) => ({...prev, pastProgress: false}));

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
                setLoading((prev) => ({...prev, metaData: false}));

            })
            .catch((error) => {
                console.error("Error fetching Meta Data:", error);
                setError("Error fetching meta data.");
                setLoading((prev) => ({...prev, metaData: false}));
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
        <div className="dashboard-container">
            {/* First Column */}
            <div className="first-column">
                {/* Header */}
                <div className="header">
                    <div className="header-card">
                        <div>SPRING 2025</div>
                    </div>
                    <div
                        className="header-card"
                        onClick={() => window.location.reload()}
                    >
                        <div>Last updated: {new Date().toLocaleString()}</div>
                    </div>

                </div>

                {/* Stacked Graph Card */}
                <div
                    className="chart-card"
                    onClick={() => setDisplayMode(displayMode === "chart" ? "table" : "chart")} // Switch between chart and table
                    style={{cursor: "pointer"}} // Indicates that the card is clickable
                >
                    {displayMode === "chart" ? (
                        <div className = "chart-container">
                            <StackedGraph/>
                        </div>
                    ) : (
                        <>
                            <h3>Past Progress Table</h3>
                            <table style={{width: "100%", borderCollapse: "collapse", textAlign: "left"}}>
                                <thead>
                                <tr>
                                    <th style={{borderBottom: "1px solid #ddd", padding: "8px"}}>Timestamp</th>
                                    <th style={{borderBottom: "1px solid #ddd", padding: "8px"}}>MKT Hours</th>
                                    <th style={{borderBottom: "1px solid #ddd", padding: "8px"}}>MOR Hours</th>
                                    <th style={{borderBottom: "1px solid #ddd", padding: "8px"}}>COMP Hours</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pastProgress.map((entry, index) => (
                                    <tr key={index}>
                                        <td style={{padding: "8px"}}>{new Date(entry.timestamp).toLocaleString()}</td>
                                        <td style={{padding: "8px"}}>{entry.aggregate_mkt_hours.toFixed(2)}</td>
                                        <td style={{padding: "8px"}}>{entry.aggregate_mor_hours.toFixed(2)}</td>
                                        <td style={{padding: "8px"}}>{entry.aggregate_comp_hours.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>


                {/* Overview Card */}
                <div className="overview-card">
                    {/* Aggregate Hours with Increase */}
                    <div className="overview-item">
                        <h1>
                            {pastProgress.length > 0 ? pastProgress[pastProgress.length - 1].aggregate_mkt_hours : 0} Hours
                        </h1>
                        <p style={{color: "green"}}>
                            {pastProgress.length > 1
                                ? `+${
                                    pastProgress[pastProgress.length - 1].aggregate_mkt_hours -
                                    pastProgress[pastProgress.length - 2].aggregate_mkt_hours
                                } hours increase from ${new Date(pastProgress[pastProgress.length - 2].timestamp).toLocaleDateString()}`
                                : "+0 hours increase"}
                        </p>
                    </div>

                    {/* List of Hour Increases */}
                    <div className="overview-list">
                        <ul>
                            <li>
                                +
                                {pastProgress.length > 1
                                    ? pastProgress[pastProgress.length - 1].aggregate_mkt_hours -
                                    pastProgress[pastProgress.length - 2].aggregate_mkt_hours
                                    : 0}{" "}
                                hours (MKT)
                            </li>
                            <li>
                                +
                                {pastProgress.length > 1
                                    ? pastProgress[pastProgress.length - 1].aggregate_mor_hours -
                                    pastProgress[pastProgress.length - 2].aggregate_mor_hours
                                    : 0}{" "}
                                hours (MOR)
                            </li>
                            <li>
                                +
                                {pastProgress.length > 1
                                    ? pastProgress[pastProgress.length - 1].aggregate_comp_hours -
                                    pastProgress[pastProgress.length - 2].aggregate_comp_hours
                                    : 0}{" "}
                                hours (COMP)
                            </li>
                        </ul>
                    </div>
                </div>


            </div>

            {/* Second Column */}
            <div className="second-column">
                {/* Progress for MKT */}
                <div className="progress-card" onClick={() => setSelectedPool("mkt")}>
                    <h3 className="progress-title">Progress for MKT</h3>
                    <ProgressBar
                        goal={metaData.goal_mkt}
                        actual={pastProgress.length > 0 ? pastProgress[pastProgress.length - 1].aggregate_mkt_hours : 0}
                    />
                </div>

                <div className="progress-card" onClick={() => setSelectedPool("mor")}>
                    <h3 className="progress-title">Progress for MOR</h3>
                    <ProgressBar
                        goal={metaData.goal_mor}
                        actual={pastProgress.length > 0 ? pastProgress[pastProgress.length - 1].aggregate_mor_hours : 0}
                    />
                </div>

                <div className="progress-card" onClick={() => setSelectedPool("comp")}>
                    <h3 className="progress-title">Progress for COMP</h3>
                    <ProgressBar
                        goal={metaData.goal_comp}
                        actual={pastProgress.length > 0 ? pastProgress[pastProgress.length - 1].aggregate_comp_hours : 0}
                    />
                </div>


                {/* Study List */}
                <div className="study-list">
                    <h3 className="study-list-title">{selectedPool.toUpperCase()} Studies</h3>
                    <ul>
                        {currentStudies[selectedPool]?.map((study, index) => (
                            <li key={index} className="study-item">
                                <h4>{study.study_name}</h4>
                                <p>Location: {study.location}</p>
                                <p>Duration: {study.duration} minutes</p>
                                <p>Participants: {study.participated_amount}</p>
                            </li>
                        )) || <p>Select a pool to view study list.</p>}
                    </ul>
                </div>

            </div>


        </div>
    );
}

export default Studies;
