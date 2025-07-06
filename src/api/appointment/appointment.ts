import { Document, Schema, model, Model } from "mongoose";

export interface IAppointment extends Document {
  title: string;
  start: Date;
  end: Date;
  professional: any;
  patient: any;
  status: string;
  createdAt: Date;
}

export const AppointmentSchema = new Schema<
  IAppointment,
  Model<IAppointment>,
  IAppointment
>({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  professional: { type: Schema.Types.Mixed, required: true },
  patient: { type: Schema.Types.Mixed },
  status: { type: String, required: true, default: "Open" },
  createdAt: { type: Date, default: new Date() },
});

const Appointment = model<IAppointment>("Appointment", AppointmentSchema);
Appointment.ensureIndexes();
Appointment.syncIndexes();
export default Appointment;
