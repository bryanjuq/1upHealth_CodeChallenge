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
        const getToken  = async () => {
            fetch(accessTokenURL)
            .then((tokenResponse) => {
                return tokenResponse.json();
            })
            .then((tokenJson) => {
                setAccessToken(tokenJson.token);
                fetchPatient();
            })
            .catch((error) => {
                console.log("Error getting token: " + error);
            });
        };

        const fetchPatient = async () => {
            fetch(patientURL)
            .then((patientResponse) => {
                return patientResponse.json();
            })
            .then((patientJson) => {
                return patientJson.entry[0].resource.id;
            })
            .then(patientId => {
                fetch(patientSpecificURL.replace("{patientId}", patientId))
                .then((patientResponse) => {
                    return patientResponse.json();
                })
                .then((patientDataJson) => {
                    setPatient([patientDataJson]);
                })
                .catch((error) => {
                    console.log("Error getting patient data: " + error);
                })
             })
             .catch(error => {
                console.log("Error getting patient: " + error);
             });
        };
         getToken();
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