import { Schema, model, models } from "mongoose";

export interface IUnit {
  id: string;
  name: string;
  symbol: string;
  createdAt?: Date;
}

const UnitSchema = new Schema<IUnit>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    symbol: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const Unit = models.Unit || model<IUnit>("Unit", UnitSchema);

export default Unit;
