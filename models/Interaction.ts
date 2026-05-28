import { Schema, model, models } from "mongoose";

export interface IInteraction {
  id: string;
  userId: string;
  productId: string;
  createdAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

InteractionSchema.index({ productId: 1, createdAt: -1 });
InteractionSchema.index({ userId: 1, createdAt: -1 });

export const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
