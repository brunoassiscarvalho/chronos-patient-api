import { Document, Schema, model, Model } from 'mongoose';

export type IPatientLogged = Pick<
  IPatient,
  'email' | 'name' | 'role' | 'image'
> & {
  userId: IPatient['_id'];
};

export type IBasicPatient = Pick<IPatient, '_id' | 'name' | 'image' | 'email'>;

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

export const BasicPatientSchema = new Schema<
  IBasicPatient,
  Model<IBasicPatient>,
  IBasicPatient
>({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  image: { type: String },
  email: { type: String, required: true },
});

export interface IPatientBase {
  _id?: any;
  name: string;
  email: string;
  birthDate: Date;
  gender: string;
  image?: string;
  phone?: string;
  zipCode?: string;
  role: string;
  status?: number;
  createdAt: Date;
}

export interface IPatientComplement {
  cancerType?: string;
  cancerStage?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  treatmentSite?: string;
  allergy?: string;
  ocologistName?: string;
}

export interface IPatient extends IPatientBase, IPatientComplement, Document {}

export const PatientSchema = new Schema<IPatient, Model<IPatient>, IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  zipCode: { type: String, required: true },
  image: { type: String },
  status: { type: Number, default: 0 },
  role: { type: String },
  cancerType: { type: String },
  cancerStage: { type: String },
  religion: { type: String },
  maritalStatus: { type: String },
  occupation: { type: String },
  treatmentSite: { type: String },
  allergy: { type: String },
  ocologistName: { type: String },
  createdAt: { type: Date, default: new Date() },
});

const Patient = model<IPatient>('Patient', PatientSchema);
Patient.ensureIndexes();
Patient.syncIndexes();
export default Patient;
