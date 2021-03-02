import React from 'react';
import './App.css';

export default function EHRPatient(props: any) {
    let patient = props.patient;
    return (
        <div>
            {
                patient.length > 0 &&
                <div>
                    <h1>Patient Information</h1>
                    <table className="patient-table">
                        <tbody>
                            <tr>
                                <td><label>Name</label></td>
                                <td><span>{patient[0].name[0].text}</span></td>
                            </tr>
                            <tr>
                                <td><label>Information</label></td>
                                <td>
                                    <div className="">
                                        <label>Gender</label>
                                        <span>{patient[0].gender}</span>
                                        <label>DOB</label>
                                        <span>{patient[0].birthDate}</span>
                                        <label>Marital Status</label>
                                        <span>{patient[0].maritalStatus.text}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Care Provider(s)</label></td>
                                <td>
                                    <div>
                                        {
                                            patient[0].careProvider.map((p: any) => {
                                                return <span>{p.display}</span>
                                            })
                                        }
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Address</label></td>
                                <td>
                                    <div>
                                        {patient[0].address[0].text}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Contact Info</label></td>
                                <td>
                                    <div className="contanct-info-wrapper">
                                        {
                                            patient[0].telecom.map((record: any) => {
                                                return <div className="contanct-info">
                                                    <label>Type</label>
                                                    <span>{record.system}</span>
                                                    <label>Value</label>
                                                    <span>{record.value}</span>
                                                    <label>Usage</label>
                                                    <span>{record.use}</span>
                                                </div>
                                            })
                                        }
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Emergency Contact (s)</label></td>
                                <td>
                                    <div>
                                        {
                                            patient[0].contact.map((c: any) => {
                                                return <div>
                                                    <div>
                                                        <label>Name</label>
                                                        <span>{c.name.text}</span>
                                                        {
                                                            c.telecom.map((record: any) => {
                                                                return <div className="contanct-info">
                                                                    <label>Type</label>
                                                                    <span>{record.system}</span>
                                                                    <label>Value</label>
                                                                    <span>{record.value}</span>
                                                                    <label>Usage</label>
                                                                    <span>{record.use}</span>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

