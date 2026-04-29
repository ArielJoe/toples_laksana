import { Schema, model, models } from "mongoose";

export interface IProductType {
  id: string;
  name: string;
  createdAt?: Date;
}

const ProductTypeSchema = new Schema<IProductType>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export const ProductType =
  models.ProductType || model<IProductType>("ProductType", ProductTypeSchema);

export default ProductType;
