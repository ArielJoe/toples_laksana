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
  }
);

UserSchema.methods.isAdmin = function (): boolean {
  return this.role === "admin" || this.role === "super_admin";
};

UserSchema.methods.isSuperAdmin = function (): boolean {
  return this.role === "super_admin";
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
    let updated = false;
    if (fullName && user.fullName !== fullName) {
      user.fullName = fullName;
      updated = true;
    }
    if (photoUrl && user.photoUrl !== photoUrl) {
      user.photoUrl = photoUrl;
      updated = true;
    }
    if (updated) {
      await user.save();
    }
    return user;
  }

  user = await this.findOne({ email });

  if (user) {
    user.firebaseUid = firebaseUid;
    user.authProvider = "firebase";
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
  });
};

UserSchema.statics.findAdminByEmail = function (email: string) {
  return this.findOne({
    email,
    role: { $in: ["admin", "super_admin"] },
  }).select("+password");
};

export const User = models.User || model<IUser>("User", UserSchema);

export default User;
