import mongoose, { Schema } from "mongoose";

/**
 * Sub-Schemas for Product Structure
 */

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: Number, required: true },
    type: { type: String, default: "number" },
  },
  { _id: false }
);

const RetailPricingSchema = new Schema(
  {
    price: { type: Number, required: true },
    min_qty: { type: Number, default: 1 },
  },
  { _id: false }
);

const WholesalePricingSchema = new Schema(
  {
    price: { type: Number, required: true },      // per pcs (wholesale)
    unit_type: { type: String, required: true },   // "carton" | "bundle" | "shrink"
    qty_per_unit: { type: Number, required: true }, // pieces per unit
  },
  { _id: false }
);

const VariantPricingSchema = new Schema(
  {
    retail: { type: RetailPricingSchema, required: true },
    wholesale: { type: WholesalePricingSchema, required: true },
  },
  { _id: false }
);

const VariantSchema = new Schema(
  {
    sku_variant: { type: String, required: true },
    color: { type: String, required: true },
    pricing: { type: VariantPricingSchema, required: true },
  },
  { _id: false }
);

const DimensionsSchema = new Schema(
  {
    length_cm: { type: Number },
    width_cm: { type: Number },
    height_cm: { type: Number },
  },
  { _id: false }
);

const PackagingLogisticsSchema = new Schema(
  {
    box_weight_kg: { type: Number },
    dimensions: { type: DimensionsSchema },
  },
  { _id: false }
);

const MaterialsSchema = new Schema(
  {
    body: { type: String, required: true },
    lid_type: { type: String, required: true },
    lid_material: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Main Product Schema
 */

const ProductSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    materials: {
      type: MaterialsSchema,
      required: true,
    },
    specifications: {
      type: [SpecificationSchema],
      default: [],
    },
    variants: {
      type: [VariantSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => v.length > 0,
        message: "At least one variant is required.",
      },
    },
    packaging_logistics: {
      type: PackagingLogisticsSchema,
    },
    description: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    interaction_count: {
      type: Number,
      default: 0,
      index: -1, // Sort by most clicked by default
    },
    last_interacted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// Compound Indexes for Filter Performance
// ============================================================

ProductSchema.index({ category: 1, is_active: 1 });
ProductSchema.index({ "specifications.key": 1, "specifications.value": 1 });
ProductSchema.index({ "variants.color": 1 });
ProductSchema.index({ name: "text", sku: "text", "tags": "text" });

// ============================================================
// Export Model
// ============================================================
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
