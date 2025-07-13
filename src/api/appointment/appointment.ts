import { Document, Schema, model, Model } from 'mongoose';
import { BasicPatientSchema, IBasicPatient } from '../patient/patient';
import {
  BasicProfessionalSchema,
  IBasicProfessional,
} from '../professional/professional';

export interface IAppointment {
  _id?: any;
  start: Date;
  end: Date;
  professional: IBasicProfessional;
  patient?: IBasicPatient;
  status?: string;
  createdAt?: Date;
}

export interface IAppointmentDocument extends IAppointment, Document {}

export const AppointmentSchema = new Schema<
  IAppointmentDocument,
  Model<IAppointmentDocument>,
  IAppointmentDocument
>({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  professional: { type: BasicProfessionalSchema, required: true },
  patient: BasicPatientSchema,
  status: { type: String, required: true, default: 'Open' },
  createdAt: { type: Date, default: new Date() },
});

const Appointment = model<IAppointmentDocument>(
  'Appointment',
  AppointmentSchema,
);
Appointment.ensureIndexes();
Appointment.syncIndexes();
export default Appointment;
