import { Schema, model, models } from "mongoose";

export interface IWishlist {
  id: string;
  userId: string;
  productId: string;
  lidColorId?: string;
  quantity: number;
  note?: string;
  promoAppliedId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    productId: { type: String, required: true },
    lidColorId: { type: String, default: null },
    quantity: { type: Number, required: true, default: 1 },
    note: { type: String, default: "" },
    promoAppliedId: { type: String, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

WishlistSchema.index(
  { userId: 1, productId: 1, lidColorId: 1 },
  { unique: true }
);

export const Wishlist =
  models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
