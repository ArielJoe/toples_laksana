import Category from "./Category";
import ProductType from "./ProductType";
import Unit from "./Unit";
import LidColor from "./LidColor";
import PriceType from "./PriceType";
import Promo from "./Promo";
import Product from "./Product";
import User from "./User";
import Wishlist from "./Wishlist";
import Interaction from "./Interaction";
import WhatsAppLog from "./WhatsAppLog";

export { Category } from "./Category";
export type { ICategory } from "./Category";

export { ProductType } from "./ProductType";
export type { IProductType } from "./ProductType";

export { Unit } from "./Unit";
export type { IUnit } from "./Unit";

export { LidColor } from "./LidColor";
export type { ILidColor } from "./LidColor";

export { PriceType } from "./PriceType";
export type { IPriceType } from "./PriceType";

export { Promo } from "./Promo";
export type { IPromo } from "./Promo";

export { Product } from "./Product";
export type {
  IDimension,
  IPackaging,
  IProduct,
  IProductImage,
  IProductPrice,
} from "./Product";

export { User } from "./User";
export type { IUser } from "./User";

export { Wishlist } from "./Wishlist";
export type { IWishlist } from "./Wishlist";

export { Interaction } from "./Interaction";
export type { IInteraction } from "./Interaction";

export { WhatsAppLog } from "./WhatsAppLog";
export type { IWhatsAppLog, IWhatsAppLogDetail } from "./WhatsAppLog";

const databaseModels = {
  Category,
  ProductType,
  Unit,
  LidColor,
  PriceType,
  Promo,
  Product,
  User,
  Wishlist,
  Interaction,
  WhatsAppLog,
};

export default databaseModels;
