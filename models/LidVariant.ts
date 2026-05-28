import { Schema, model, models } from "mongoose";

export interface ILidVariant {
  id: string;
  name: string;
  lidTypeId: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LidVariantSchema = new Schema<ILidVariant>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    lidTypeId: { type: String, required: true, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const LidVariant =
  models.LidVariant || model<ILidVariant>("LidVariant", LidVariantSchema);

export default LidVariant;
