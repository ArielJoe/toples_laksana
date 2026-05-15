import { Schema, model, models } from "mongoose";

export interface IInquiryCartItem {
  productId: string;
  lidColorId?: string;
  priceTypeId?: string;
  quantity: number;
  note?: string;
  promoAppliedId?: string;
}

export interface IInquiryCart {
  id: string;
  userId: string;
  items: IInquiryCartItem[];
  status: "draft" | "sent" | "archived";
  createdAt?: Date;
  updatedAt?: Date;
}

const InquiryCartItemSchema = new Schema<IInquiryCartItem>(
  {
    productId: { type: String, required: true },
    lidColorId: { type: String, default: null },
    priceTypeId: { type: String, default: null },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    note: { type: String, default: "" },
    promoAppliedId: { type: String, default: null },
  },
  { _id: false }
);

const InquiryCartSchema = new Schema<IInquiryCart>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    items: { type: [InquiryCartItemSchema], required: true, default: [] },
    status: {
      type: String,
      enum: ["draft", "sent", "archived"],
      required: true,
      default: "draft",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

InquiryCartSchema.index({ userId: 1, status: 1, updatedAt: -1 });
InquiryCartSchema.index({ "items.productId": 1 });

export const InquiryCart =
  models.InquiryCart || model<IInquiryCart>("InquiryCart", InquiryCartSchema);

export default InquiryCart;
