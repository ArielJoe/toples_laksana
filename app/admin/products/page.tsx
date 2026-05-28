import connectDB from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import CategoryModel from "@/models/Category";
import ProductTypeModel from "@/models/ProductType";
import LidColorModel from "@/models/LidColor";
import PriceTypeModel from "@/models/PriceType";
import MaterialModel from "@/models/Material";
import LidVariantModel from "@/models/LidVariant";
import ProductsPageContent from "./ProductsPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Produk - Admin",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();

  const [
    rawProducts,
    rawCategories,
    rawProductTypes,
    rawLidColors,
    rawPriceTypes,
    rawMaterials,
    rawLidVariants,
  ] = await Promise.all([
    ProductModel.find({ deletedAt: null }).sort({ createdAt: -1 }).lean(),
    CategoryModel.find().sort({ name: 1 }).lean(),
    ProductTypeModel.find().sort({ name: 1 }).lean(),
    LidColorModel.find().sort({ color: 1 }).lean(),
    PriceTypeModel.find().sort({ name: 1 }).lean(),
    MaterialModel.find().sort({ name: 1 }).lean(),
    LidVariantModel.find().sort({ name: 1 }).lean(),
  ]);

  return (
    <ProductsPageContent
      initialProducts={JSON.parse(JSON.stringify(rawProducts))}
      masterData={{
        categories: JSON.parse(JSON.stringify(rawCategories)),
        productTypes: JSON.parse(JSON.stringify(rawProductTypes)),
        lidColors: JSON.parse(JSON.stringify(rawLidColors)),
        priceTypes: JSON.parse(JSON.stringify(rawPriceTypes)),
        materials: JSON.parse(JSON.stringify(rawMaterials)),
        lidVariants: JSON.parse(JSON.stringify(rawLidVariants)),
      }}
    />
  );
}
