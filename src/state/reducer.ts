import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSE_LIST";
      payload: Diagnosis[];
  };

export const setPatientList = (patientList:Patient[]):Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patientList
  };
};

export const addPatient = (patient:Patient):Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const updatePatient = (patient:Patient):Action => {
  return {
    type: "UPDATE_PATIENT",
    payload: patient
  };
};

export const setDiagnoseList = (diagnoses:Diagnosis[]):Action => {
  return {
    type: "SET_DIAGNOSE_LIST",
    payload: diagnoses,
  };
};


export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
      case "UPDATE_PATIENT" :
        state.patients[action.payload.id]=action.payload;
        return {...state};
      case "SET_DIAGNOSE_LIST" :
        return {
          ...state,
          diagnoses: {
            ...action.payload.reduce(
              (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
              {}
            ),
            ...state.diagnoses
          }
        };
      break;
    default:
      return state;
  }
};
