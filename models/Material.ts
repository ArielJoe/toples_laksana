import { Schema, model, models } from "mongoose";

export interface IMaterial {
  id: string;
  name: string;
  usage: "body" | "lid" | "both";
}

const MaterialSchema = new Schema<IMaterial>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    usage: {
      type: String,
      enum: ["body", "lid", "both"],
      required: true,
      default: "both",
    },
  }
);

export const Material =
  models.Material || model<IMaterial>("Material", MaterialSchema);

export default Material;
