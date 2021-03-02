import React, { useEffect, useState } from 'react';
import EHRPatient from './EHRPatient';
import './App.css';

const config = require("./config")();
const patientURL = "http://localhost:3200/patient";
const patientSpecificURL = "http://localhost:3200/patient/{patientId}";

export default function App() {
    let [patient, setPatient]: any = useState([]);
    useEffect(() => {
        const fetchPatient = async () => {
            const patientEntry = await (await fetch(patientURL)).json();
            const patientId = await patientEntry.entry[0].resource.id;
            const patientData = await (await fetch(patientSpecificURL.replace("{patientId}", patientId))).json();
            setPatient([patientData]);
        };
        fetchPatient();
    }, []);

    let connectHealthSystemURL = "https://api.1up.health/connect/system/clinical/{system_id}?client_id={client_id}&access_token={access_token}";
    connectHealthSystemURL = connectHealthSystemURL
        .replace("{system_id}", config.system_id)
        .replace("{client_id}", config.client_id)
        .replace("{access_token}", config.access_token);
    return (
        <div className="App">
            <div className="oneUp-container">
                <p>
                    <button className="connect-button" onClick={() => { window.location.href = connectHealthSystemURL; return null; }}>Connect to Health System</button>
                </p>
                <EHRPatient patient={patient} />
            </div>
        </div>
    );
}