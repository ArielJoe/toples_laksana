import { Schema, model, models } from "mongoose";

export interface IPriceType {
  id: string;
  name: string;
}

const PriceTypeSchema = new Schema<IPriceType>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  }
);

export const PriceType =
  models.PriceType || model<IPriceType>("PriceType", PriceTypeSchema);

export default PriceType;
