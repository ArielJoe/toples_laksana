import { Schema, model, models } from "mongoose";

export interface ILidType {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LidTypeSchema = new Schema<ILidType>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const LidType =
  models.LidType || model<ILidType>("LidType", LidTypeSchema);

export default LidType;
