import { Document, Schema, model, Model } from 'mongoose';

export interface ISymptom extends Document {
  title: string;
  description: string;
  icon: string;
  levels?: Array<ISymptomLevel>;
  endedAt?: Date;
  createdAt?: Date;
}

export interface ISymptomLevel extends Document {
  level: number;
  resume: string;
  advisement: string;
  endedAt?: Date;
  createdAt?: Date;
}

export const SymptomLevelSchema = new Schema<
  ISymptomLevel,
  Model<ISymptomLevel>,
  ISymptomLevel
>({
  level: { type: Number, required: true },
  resume: { type: String, required: true },
  advisement: { type: String, required: true },
  endedAt: { type: Date, default: new Date() },
  createdAt: { type: Date, default: new Date() },
});

export const SymptomSchema = new Schema<ISymptom, Model<ISymptom>, ISymptom>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  levels: { type: SymptomLevelSchema },
  endedAt: { type: Date, default: new Date() },
  createdAt: { type: Date, default: new Date() },
});

const Symptom = model<ISymptom>('Symptom', SymptomSchema);
Symptom.ensureIndexes();
Symptom.syncIndexes();
export default Symptom;
