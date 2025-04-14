import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import config from "../config";
import { UserInterface, UserModel } from "./auth.interface";
import config from "../../config";
import { UserStatus } from "./auth.constant";
// import { UserInterface, UserModel } from "./user.Interface";

const UserSchema = new mongoose.Schema<UserInterface, UserModel>(
  {
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Ensure password is not retrieved by default
    },
   
    Profileimage: {
      type: String,
      required: true 
      // default:
      //   "https://media-hosting.imagekit.io//da3192128fbf47ba/icon-7797704_1280.png?Expires=1837355766&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Isi7PB56px8a8YHL36sD-mGFswYDO~JEbKjUzJ7gP~sbSg0tvkuqrHUlt-R71yjeaLw9gEqgsIBDejosr8AyMp~B2n3Z4FDnsTvLeqsue26m7kfNvg3al7OnDpGaTIYztBC3I~F0gg2i3zygw~vhIa2hP8BZp0nOoMTFyzUXq6V0a2zsm0AELELl62VSsHZ-fJV7aItA0D6DRQjMaU0xTfYmbtjszjagi51VuK9MrZou2-2DqqtxA0IkJv83PUMlrjPQS~FCoDowLPoQOkPK17lAazSFv4Bx8Ft6SHKpAPqDbwLgXOqabC6vRa7YOhKa14uBZQxOeL2Bc8L~RBgAZg__",
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'tutor'],
        default: 'student',
      },
      status: {
        type: String,
        enum: UserStatus,
        default: 'in-progress',
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
      is_blocked: {
        type: Boolean,
        default: false,
      },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  // Hash password only if it's new or modified
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Ensure bcrypt_salt_rounds is a valid number
    const saltRounds = Number(config.bcrypt_salt_rounds);
    if (!saltRounds) {
      throw new Error("bcrypt_salt_rounds is not a valid number");
    }

    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
  }
});


// set '' after saving password


// Check if user exists
UserSchema.statics.isUserExists = async function (email: string) {
  return await Users.findOne({ email }).select("+password");
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

UserSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};
export const Users = mongoose.model<UserInterface, UserModel>("Users", UserSchema);