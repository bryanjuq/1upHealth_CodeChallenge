import React from 'react';
import './App.css';

export default function EHRPatient(props: any) {
    let patient = props.patient;
    return (
        <div>
            {
                patient.length > 0 &&
                patient[0].entry.map((entry: any, index: number) => {
                    return <section key={index} className={"data-section"} dangerouslySetInnerHTML={{ __html: entry.resource.text.div }}></section>
                })
            }
        </div>
    );
}

