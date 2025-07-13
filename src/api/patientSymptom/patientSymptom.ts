import { Document, Schema, model, Model } from 'mongoose';
import { IPatient } from '../patient/patient';
import { ISymptomLevel } from '../symptom/symptom';

export interface IPatientSymptom extends Document {
  patient: IPatient['_id'];
  level: ISymptomLevel['_id'];
  dateTime: Date;
  note: string;
  createdAt: Date;
}

export const PatientSymptomSchema = new Schema<
  IPatientSymptom,
  Model<IPatientSymptom>,
  IPatientSymptom
>({
  patient: { type: Schema.Types.ObjectId, required: true },
  level: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  note: { type: String },
  createdAt: { type: Date, default: new Date() },
});

const PatientSymptom = model<IPatientSymptom>(
  'PatientSymptom',
  PatientSymptomSchema,
);
PatientSymptom.ensureIndexes();
PatientSymptom.syncIndexes();
export default PatientSymptom;
