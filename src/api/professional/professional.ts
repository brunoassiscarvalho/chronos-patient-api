import { Document, Schema, model, Model } from 'mongoose';
import { enumPositions, Positions } from '../../enums/EnumPositions';
import {
  enumProfessionalStatus,
  ProfessionalStatus,
} from '../../enums/EnumProfessionalStatus';
import { enumRoles, Roles } from '../../enums/EnumRoles';

export interface IProfessional extends Document {
  name: string;
  email: string;
  image: string;
  phone: string;
  cep: string;
  status: ProfessionalStatus;
  role: Roles;
  position: Positions;
  createdAt: Date;
}

export type IBasicProfessional = Pick<
  IProfessional,
  '_id' | 'name' | 'position' | 'image' | 'email'
>;

export type ILoggedProfessional = Pick<
  IProfessional,
  'email' | 'name' | 'role' | 'position'
> & { userId: IProfessional['_id'] };

export const BasicProfessionalSchema = new Schema<
  IBasicProfessional,
  Model<IBasicProfessional>,
  IBasicProfessional
>({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  position: { type: String, enum: enumPositions, required: true },
  email: { type: String, required: true },
  image: { type: String },
});

export const ProfessionalSchema = new Schema<
  IProfessional,
  Model<IProfessional>,
  IProfessional
>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  cep: { type: String, required: true },
  role: { type: String, enum: enumRoles, required: true },
  position: { type: String, enum: enumPositions, required: true },
  image: { type: String },
  status: { type: String, enum: enumProfessionalStatus, default: 'active' },
  createdAt: { type: Date, default: new Date() },
});

const Professional = model<IProfessional>('Professional', ProfessionalSchema);
Professional.ensureIndexes();
Professional.syncIndexes();
export default Professional;
