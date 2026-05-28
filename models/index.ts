import Category from "./Category";
import ProductType from "./ProductType";
import Unit from "./Unit";
import LidColor from "./LidColor";
import Material from "./Material";
import LidType from "./LidType";
import LidVariant from "./LidVariant";
import PriceType from "./PriceType";
import Product from "./Product";
import User from "./User";
import Wishlist from "./Wishlist";
import InquiryCart from "./InquiryCart";
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

export { Material } from "./Material";
export type { IMaterial } from "./Material";

export { LidType } from "./LidType";
export type { ILidType } from "./LidType";

export { LidVariant } from "./LidVariant";
export type { ILidVariant } from "./LidVariant";

export { PriceType } from "./PriceType";
export type { IPriceType } from "./PriceType";


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

export { InquiryCart } from "./InquiryCart";
export type { IInquiryCart, IInquiryCartItem } from "./InquiryCart";

export { Interaction } from "./Interaction";
export type { IInteraction } from "./Interaction";

export { WhatsAppLog } from "./WhatsAppLog";
export type { IWhatsAppLog, IWhatsAppLogDetail } from "./WhatsAppLog";

const databaseModels = {
  Category,
  ProductType,
  Unit,
  LidColor,
  Material,
  LidType,
  LidVariant,
  PriceType,
  Product,
  User,
  Wishlist,
  InquiryCart,
  Interaction,
  WhatsAppLog,
};

export default databaseModels;
