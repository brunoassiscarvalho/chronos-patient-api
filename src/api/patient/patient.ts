import { Document, Schema, model, Model } from "mongoose";

export interface IPatient extends Document {
  name: string;
  email: string;
  image: string;
  phone: string;
  cep: string;
  status: number;
  role: string;
  createdAt: Date;
}

export const PatientSchema = new Schema<IPatient, Model<IPatient>, IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  cep: { type: String, required: true },
  image: { type: String },
  status: { type: Number, default: 0 },
  role: { type: String },
  createdAt: { type: Date, default: new Date() },
});

const Patient = model<IPatient>("Patient", PatientSchema);
Patient.ensureIndexes();
Patient.syncIndexes();
export default Patient;
