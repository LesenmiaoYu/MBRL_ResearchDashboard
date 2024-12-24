import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function StackedGraph() {
    const [dataset, setDataset] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                // Transform the backend data to the format expected by the LineChart
                const formattedData = data.map((item) => ({
                    date: new Date(item.timestamp),
                    mor: item.aggregate_mor_hours,
                    mkt: item.aggregate_mkt_hours,
                    comp: item.aggregate_comp_hours,
                }));
                setDataset(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <LineChart
            dataset={dataset}
            xAxis={[
                {
                    id: "Months",
                    dataKey: "date",
                    scaleType: "time",
                    valueFormatter: (date) => {
                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                        const day = date.getDate().toString().padStart(2, "0");
                        return `${month}/${day}`;
                    },
                },
            ]}
            series={[
                {
                    id: "MKT",
                    label: "Marketing Subject Pool",
                    dataKey: "mkt",
                    stack: "total",
                    area: true,
                    showMark: true,
                    color: "#92C5F9",
                },
                {
                    id: "MOR",
                    label: "Management Subject Pool",
                    dataKey: "mor",
                    stack: "total",
                    area: true,
                    showMark: true,
                    color: "#AFDC8F",
                },
                {
                    id: "COMP",
                    label: "Compensated Subject Pool",
                    dataKey: "comp",
                    stack: "total",
                    area: true,
                    showMark: true,
                    color: "#B6A6E9",
                },
            ]}
            tooltip={{
                valueFormatter: (value, dataKey, datum) => {
                    const timestamp = datum.date.toLocaleString();
                    return `Value: ${value} (${timestamp})`;
                },
            }}
            width={600}
            height={400}
            margin={{ left: 70 }}
        />
    );
}
