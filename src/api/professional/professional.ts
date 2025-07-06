import { Document, Schema, model, Model } from "mongoose";

export interface IProfessional extends Document {
  name: string;
  email: string;
  image: string;
  phone: string;
  cep: string;
  status: number;
  role: string;
  position: string;
  createdAt: Date;
}

export const ProfessionalSchema = new Schema<
  IProfessional,
  Model<IProfessional>,
  IProfessional
>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  cep: { type: String, required: true },
  image: { type: String },
  status: { type: Number, default: 0 },
  role: { type: String },
  position: { type: String },
  createdAt: { type: Date, default: new Date() },
});

const Professional = model<IProfessional>("Professional", ProfessionalSchema);
Professional.ensureIndexes();
Professional.syncIndexes();
export default Professional;
