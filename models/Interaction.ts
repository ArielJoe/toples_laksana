import { Schema, model, models } from "mongoose";

export interface IInteraction {
  id: string;
  userId: string;
  productId: string;
  interactionType: "view" | "detail_click" | "whatsapp_share" | "promo_click";
  createdAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    interactionType: {
      type: String,
      enum: ["view", "detail_click", "whatsapp_share", "promo_click"],
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

InteractionSchema.index({ productId: 1, interactionType: 1, createdAt: -1 });
InteractionSchema.index({ userId: 1, createdAt: -1 });

export const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
