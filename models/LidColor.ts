import { Schema, model, models } from "mongoose";

export interface ILidColor {
  id: string;
  color: string;
  colorCode?: string;
}

const LidColorSchema = new Schema<ILidColor>(
  {
    id: { type: String, required: true, unique: true },
    color: { type: String, required: true, unique: true },
    colorCode: { type: String, default: "" },
  }
);

export const LidColor =
  models.LidColor || model<ILidColor>("LidColor", LidColorSchema);

export default LidColor;
