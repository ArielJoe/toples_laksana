import { Schema, model, models } from "mongoose";

export interface IProductType {
  id: string;
  name: string;
}

const ProductTypeSchema = new Schema<IProductType>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  }
);

export const ProductType =
  models.ProductType || model<IProductType>("ProductType", ProductTypeSchema);

export default ProductType;
