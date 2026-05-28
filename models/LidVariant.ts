import { Schema, model, models } from "mongoose";

export interface ILidVariant {
  id: string;
  name: string;
}

const LidVariantSchema = new Schema<ILidVariant>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  }
);

export const LidVariant =
  models.LidVariant || model<ILidVariant>("LidVariant", LidVariantSchema);

export default LidVariant;
