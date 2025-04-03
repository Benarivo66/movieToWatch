const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    country: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    sex: { type: String, enum: ["Male", "male", "Female", "female"], required: true },
    phone: { type: String, required: true, unique: true, trim: true },
    watchlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Watchlist" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
