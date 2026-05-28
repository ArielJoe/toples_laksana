import { Schema, model, models } from "mongoose";

export interface IDimension {
  heightCm: number;
  diameterCm: number;
  volumeMl: number;
  weightGram: number;
}

export interface IPackaging {
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightKg?: number;
}

export interface IProductImage {
  imageUrl: string;
  isPrimary: boolean;
}

export interface IProductPrice {
  lidColorId: string;
  priceTypeId: string;
  price: number;
  quantity?: number;
}

export interface IProduct {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  productTypeId?: string;
  lidMaterial: string;
  lidVariant: string;
  bodyMaterial: string;
  isAvailable: boolean;
  description?: string;
  dimension?: IDimension;
  packaging?: IPackaging[];
  images?: IProductImage[];
  prices?: IProductPrice[];
  deletedAt?: Date | null;
  createdAt?: Date;
}

const DimensionSchema = new Schema<IDimension>(
  {
    heightCm: { type: Number, required: true, default: 0 },
    diameterCm: { type: Number, required: true, default: 0 },
    volumeMl: { type: Number, required: true, default: 0 },
    weightGram: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const PackagingSchema = new Schema<IPackaging>(
  {
    lengthCm: { type: Number, default: null },
    widthCm: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    imageUrl: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductPriceSchema = new Schema<IProductPrice>(
  {
    lidColorId: { type: String, required: true },
    priceTypeId: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categoryId: { type: String, required: true },
    productTypeId: { type: String, default: null },
    lidMaterial: { type: String, required: true, default: "" },
    lidVariant: { type: String, required: true, default: "" },
    bodyMaterial: { type: String, required: true, default: "" },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    description: { type: String, default: "" },
    dimension: { type: DimensionSchema, default: null },
    packaging: { type: [PackagingSchema], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    prices: { type: [ProductPriceSchema], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ productTypeId: 1 });
ProductSchema.index({ isAvailable: 1 });
ProductSchema.index({ bodyMaterial: 1 });
ProductSchema.index({ lidMaterial: 1 });
ProductSchema.index({ lidVariant: 1 });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
