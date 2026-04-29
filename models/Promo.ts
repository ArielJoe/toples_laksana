import { Schema, model, models } from "mongoose";

export interface IPromo {
  id: string;
  promoCode?: string;
  promoName: string;
  description?: string;
  promoType: "percentage" | "nominal";
  promoValue: number;
  minQuantity: number;
  productId?: string;
  lidColorId?: string;
  categoryId?: string;
  validFrom: Date;
  validUntil?: Date;
  maxUsage?: number;
  usedCount?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PromoSchema = new Schema<IPromo>(
  {
    id: { type: String, required: true, unique: true },
    promoCode: { type: String, unique: true, sparse: true },
    promoName: { type: String, required: true },
    description: { type: String, default: "" },
    promoType: {
      type: String,
      enum: ["percentage", "nominal"],
      required: true,
      default: "percentage",
    },
    promoValue: { type: Number, required: true },
    minQuantity: { type: Number, required: true, default: 1 },
    productId: { type: String, default: null },
    lidColorId: { type: String, default: null },
    categoryId: { type: String, default: null },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, default: null },
    maxUsage: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

PromoSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export const Promo = models.Promo || model<IPromo>("Promo", PromoSchema);

export default Promo;
