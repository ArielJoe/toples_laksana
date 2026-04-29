import { Schema, model, models } from "mongoose";

export interface ILidColor {
  id: string;
  color: string;
  colorCode?: string;
  order?: number;
  createdAt?: Date;
}

const LidColorSchema = new Schema<ILidColor>(
  {
    id: { type: String, required: true, unique: true },
    color: { type: String, required: true, unique: true },
    colorCode: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const LidColor =
  models.LidColor || model<ILidColor>("LidColor", LidColorSchema);

export default LidColor;
