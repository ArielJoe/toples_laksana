import { Schema, model, models } from "mongoose";

export interface IUser {
  id: string;
  firebaseUid?: string;
  email: string;
  fullName?: string;
  photoUrl?: string;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    firebaseUid: { type: String, unique: true, sparse: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
  }
);

// Find an existing user or create a new user from Firebase Auth payload
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
    if (fullName) user.fullName = fullName;
    if (photoUrl) user.photoUrl = photoUrl;
    await user.save();
    return user;
  }

  return this.create({
    firebaseUid,
    email,
    fullName: fullName || email?.split("@")[0] || "",
    photoUrl: photoUrl || "",
  });
};

export const User = models.User || model<IUser>("User", UserSchema);

export default User;
