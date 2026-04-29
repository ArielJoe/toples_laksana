import { Schema, model, models } from "mongoose";

export interface IUser {
  id: string;
  authProvider: "firebase" | "local";
  firebaseUid?: string;
  email: string;
  password?: string;
  fullName?: string;
  photoUrl?: string;
  phoneNumber?: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  deviceId?: string;
  isGuest: boolean;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    authProvider: {
      type: String,
      enum: ["firebase", "local"],
      required: true,
      default: "firebase",
    },
    firebaseUid: { type: String, unique: true, sparse: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    fullName: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    deviceId: { type: String, default: null },
    isGuest: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    lastActiveAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.methods.isAdmin = function (): boolean {
  return this.role === "admin" || this.role === "super_admin";
};

UserSchema.methods.isSuperAdmin = function (): boolean {
  return this.role === "super_admin";
};

UserSchema.methods.softDelete = async function () {
  this.deletedAt = new Date();
  this.isActive = false;
  await this.save();
};

UserSchema.methods.restore = async function () {
  this.deletedAt = null;
  this.isActive = true;
  await this.save();
};

UserSchema.statics.findOrCreateFromFirebase = async function (payload: {
  firebaseUid: string;
  email: string;
  fullName?: string;
  photoUrl?: string;
}) {
  const { firebaseUid, email, fullName, photoUrl } = payload;

  let user = await this.findOne({ firebaseUid });

  if (user) {
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    user.isGuest = false;
    if (fullName) user.fullName = fullName;
    if (photoUrl) user.photoUrl = photoUrl;
    await user.save();
    return user;
  }

  user = await this.findOne({ email });

  if (user) {
    user.firebaseUid = firebaseUid;
    user.authProvider = "firebase";
    user.isGuest = false;
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    if (fullName) user.fullName = fullName;
    if (photoUrl) user.photoUrl = photoUrl;
    await user.save();
    return user;
  }

  return this.create({
    authProvider: "firebase",
    firebaseUid,
    email,
    fullName: fullName || email?.split("@")[0] || "",
    photoUrl: photoUrl || "",
    role: "user",
    isActive: true,
    isGuest: false,
    lastLoginAt: new Date(),
    lastActiveAt: new Date(),
  });
};

UserSchema.statics.findAdminByEmail = function (email: string) {
  return this.findOne({
    email,
    role: { $in: ["admin", "super_admin"] },
    isActive: true,
    deletedAt: null,
  }).select("+password");
};

export const User = models.User || model<IUser>("User", UserSchema);

export default User;
