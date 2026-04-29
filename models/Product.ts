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
  quantityPerPack: number;
}

export interface IProductImage {
  imageUrl: string;
  order: number;
  isPrimary: boolean;
  createdAt?: Date;
}

export interface IProductPrice {
  lidColorId: string;
  priceTypeId: string;
  price: number;
  validFrom: Date;
  validUntil?: Date;
}

export interface IProduct {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  productTypeId?: string;
  unitId: string;
  lidMaterial: string;
  lidVariant: string;
  bodyMaterial: string;
  lidType: string;
  description?: string;
  dimension?: IDimension;
  packaging?: IPackaging[];
  images?: IProductImage[];
  prices?: IProductPrice[];
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
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
    quantityPerPack: { type: Number, required: true },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductPriceSchema = new Schema<IProductPrice>(
  {
    lidColorId: { type: String, required: true },
    priceTypeId: { type: String, required: true },
    price: { type: Number, required: true },
    validFrom: { type: Date, required: true, default: Date.now },
    validUntil: { type: Date, default: null },
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
    unitId: { type: String, required: true },
    lidMaterial: { type: String, required: true, default: "" },
    lidVariant: { type: String, required: true, default: "" },
    bodyMaterial: { type: String, required: true, default: "" },
    lidType: { type: String, required: true, default: "" },
    description: { type: String, default: "" },
    dimension: { type: DimensionSchema, default: null },
    packaging: { type: [PackagingSchema], default: [] },
    images: { type: [ProductImageSchema], default: [] },
    prices: { type: [ProductPriceSchema], default: [] },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ productTypeId: 1 });

export const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
