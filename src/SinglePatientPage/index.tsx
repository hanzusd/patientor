import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Patient } from "../types";

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
            dispatch({ type: "UPDATE_PATIENT", payload: patientFromApi });
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let genderIcon = "\u2640";
    if (patient.gender === "male") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        genderIcon = "\u2642";
    }
    if (patient.gender === "other") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        genderIcon = "\u26A5";
    }

    return(
        <div>
            <h2><div style= {{fontSize:36}}>{patient.name}{genderIcon}</div></h2>
            <div style= {{fontSize:21}}>ssn: {patient.ssn}</div>
            <div style= {{fontSize:21}}>occupation: {patient.occupation}</div>
        </div>);
};

export default SinglePatientPage;