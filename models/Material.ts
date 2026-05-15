import { Schema, model, models } from "mongoose";

export interface IMaterial {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Material =
  models.Material || model<IMaterial>("Material", MaterialSchema);

export default Material;
