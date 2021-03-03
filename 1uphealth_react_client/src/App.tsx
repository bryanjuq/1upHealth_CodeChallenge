import React, { useEffect, useState } from 'react';
import EHRPatient from './EHRPatient';
import './App.css';

const config = require("./config")();
const accessTokenURL = `http://localhost:${config.node_server_port}/access_token`;
const patientURL = `http://localhost:${config.node_server_port}/patient`;
const patientSpecificURL = `http://localhost:${config.node_server_port}/patient/{patientId}`;

export default function App() {
    let [patient, setPatient]: any = useState([]);
    let [access_token, setAccessToken]: any =  useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            const token = await (await fetch(accessTokenURL)).json();
            setAccessToken(token.token);
            const patientEntry = await (await fetch(patientURL)).json();
            const patientId = await patientEntry.entry[0].resource.id;
            const patientData = await (await fetch(patientSpecificURL.replace("{patientId}", patientId))).json();
            setPatient([patientData]);
        };
        fetchPatient();
    }, []);

    const connectHealthSystemURL = `https://api.1up.health/connect/system/clinical/${config.system_id}?client_id=${config.client_id}&access_token=${access_token}`;
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