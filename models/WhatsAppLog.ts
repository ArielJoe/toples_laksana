import { Schema, model, models } from "mongoose";

export interface IWhatsAppLogDetail {
  productId: string;
  lidColorId?: string;
  quantity: number;
  priceAtThatTime: number;
  subtotal: number;
}

export interface IWhatsAppLog {
  id: string;
  userId: string;
  message: string;
  destinationNumber: string;
  promoAppliedId?: string;
  totalDiscount: number;
  grandTotal: number;
  details: IWhatsAppLogDetail[];
  createdAt?: Date;
}

const WhatsAppLogDetailSchema = new Schema<IWhatsAppLogDetail>(
  {
    productId: { type: String, required: true },
    lidColorId: { type: String, default: null },
    quantity: { type: Number, required: true, default: 1 },
    priceAtThatTime: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const WhatsAppLogSchema = new Schema<IWhatsAppLog>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    message: { type: String, required: true },
    destinationNumber: { type: String, required: true },
    promoAppliedId: { type: String, default: null },
    totalDiscount: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    details: { type: [WhatsAppLogDetailSchema], required: true, default: [] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

WhatsAppLogSchema.index({ userId: 1, createdAt: -1 });

export const WhatsAppLog =
  models.WhatsAppLog || model<IWhatsAppLog>("WhatsAppLog", WhatsAppLogSchema);

export default WhatsAppLog;
