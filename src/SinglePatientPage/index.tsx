import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient, Entry } from "../types";

import { updatePatient } from "../state/reducer";

const SinglePatientPage = ( ) => {
    const [{ patients, diagnoses }, dispatch] = useStateValue();

    const { id } = useParams<{ id: string }>();

    if(!id) {
        throw new Error ("No id");
    }
    const patient = patients[id];

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

    const assertNever = (value: never): never => {
      throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
      );
    };

    const userHealthIcon = (health: number) => {
      if (health === 0) {
        return ("\u{1F49A}");
      }
      if (health === 1) {
        return ("\u{1F49B}");
      }
      if (health === 2) {
        return ("\u{1F9E1}");
      }
      if (health === 3) {
        return ("\u{1F5A4}");
      }
    };

    const getEntries = (entries:Array<Entry>) => {
      const printDiagnoses = (entry:Entry) => {
        if (entry.diagnosisCodes!==undefined) {
          return (entry.diagnosisCodes.map(d => {
            let rtrn = d;
            if (diagnoses[d]) {
              rtrn = d + " " + diagnoses[d].name;
            }
            return (<li key={d}>{rtrn}</li>);
          }));
        }
      };

      const printEntry = (entries:Array<Entry>) => {
        return(entries.map(e =>
          <div key={e.id} style={{marginBottom: "1rem", borderStyle: "solid", padding:"10px"}}>
            <div>{e.date}</div>
            <div style = {{fontStyle:"italic"}}>{e.description}</div>
            <SpecialDiagnoseParts entry = {e} />
            <div style={{marginTop: "1rem", marginLeft: "1rem"}}>{printDiagnoses(e)}</div>
            <div>diagnose by {e.specialist}</div>
          </div>));
          };

      return (
      <div>
        {printEntry(entries)}
      </div>);
    };

    const SpecialDiagnoseParts = (props:{entry:Entry}) => {
      switch(props.entry.type) {
        case "Hospital":
          return (<div>
            <div>discharge date: {props.entry.discharge.date}</div>
            <div>criteria for discharge: {props.entry.discharge.criteria}</div>
          </div>);
        case "OccupationalHealthcare":
          return (<div>
            employer: {props.entry.employerName}
          </div>);
        case "HealthCheck":
          return (<div>
            <div>{userHealthIcon(props.entry.healthCheckRating)}</div>
          </div>);
        default:
          return assertNever(props.entry);
      }
    };

    return(
        <div style= {{fontSize:21}}>
            <h2 style= {{fontSize:36}}>{patient.name}{genderIcon}</h2>
            <div>ssn: {patient.ssn}</div>
            <div style={{marginBottom: "1rem"}}>occupation: {patient.occupation}</div>
            <div style={{fontWeight:"bold", fontSize:25}}>entries</div>
            <div style={{marginTop: "1rem"}} >{getEntries(patient.entries)}</div>
        </div>);
};

export default SinglePatientPage;