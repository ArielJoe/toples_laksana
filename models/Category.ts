import { Schema, model, models } from "mongoose";

export interface ICategory {
  id: string;
  name: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
  }
);

export const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
