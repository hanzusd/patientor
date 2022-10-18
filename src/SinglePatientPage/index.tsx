import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient, Entry } from "../types";

import { updatePatient } from "../state/reducer";

const SinglePatientPage = ( ) => {
    const [{ patients }, dispatch] = useStateValue();

    const { id } = useParams<{ id: string }>();

    if(!id) {
        throw new Error ("No id");
    }
    const patient = patients[id];

    console.log('rendering', patient);
    console.log('patients', patients);

    React.useEffect(() => {
        const fetchPatient = async () => {
          try {
            const { data: patientFromApi } = await axios.get<Patient>(
              `${apiBaseUrl}/patients/${id}`
            );
            dispatch(updatePatient(patientFromApi));
          } catch (e) {
            console.error(e);
          }
        };
        if (!patient || !patient.ssn) {
            void fetchPatient();
        }
    }, [patient, dispatch]);

    if (!patient) {
        return null;
    }

    let genderIcon = "\u2640";
    if (patient.gender === "male") {
        genderIcon = "\u2642";
    }
    if (patient.gender === "other") {
        genderIcon = "\u26A5";
    }

    const getEntries = (entries:Array<Entry>) => {
      
      const printDiagnoses = (entry:Entry) => {
        if(entry.diagnosisCodes!==undefined) {
          return (entry.diagnosisCodes.map(d => <li key={d}>{d}</li>));
        }
      };

      const printEntry = (entries:Array<Entry>) => {
        return(entries.map(e =>
          <div key={e.id} style={{marginBottom: "1rem"}}>
            <div >{e.date} <i>{e.description}</i></div>
            <div style={{marginTop: "1rem", marginLeft: "1rem"}}>{printDiagnoses(e)}</div>
          </div>));
          };


      return (
      <div>
        {printEntry(entries)}
      </div>);
    };

    return(
        <div style= {{fontSize:21}}>
            <h2 style= {{fontSize:36}}>{patient.name}{genderIcon}</h2>
            <div>ssn: {patient.ssn}</div>
            <div style={{marginBottom: "1rem"}}>occupation: {patient.occupation}</div>
            <div style={{fontWeight:"bold", fontSize:25}}>entries</div>
            <div style={{marginTop: "1rem"}}>{getEntries(patient.entries)}</div>
        </div>);
};

export default SinglePatientPage;