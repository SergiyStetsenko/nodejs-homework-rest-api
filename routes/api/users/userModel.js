const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryptjs = require("bcryptjs");

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: [true, "Email is required"], unique: true },
  passwordHash: { type: String, required: [true, "Password is required"] },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: { type: String, default: null },
});
userSchema.statics.hashPassword = async (password) => {
  return bcryptjs.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
};

userSchema.statics.isPasswordCorrect = async (password, passwordHash) => {
  return bcryptjs.compare(password, passwordHash);
};

exports.UserModel = mongoose.model("User", userSchema);
