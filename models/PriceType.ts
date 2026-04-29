import { Schema, model, models } from "mongoose";

export interface IPriceType {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

const PriceTypeSchema = new Schema<IPriceType>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const PriceType =
  models.PriceType || model<IPriceType>("PriceType", PriceTypeSchema);

export default PriceType;
