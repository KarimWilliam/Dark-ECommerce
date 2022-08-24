import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  qty: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  default: {
    type: Boolean,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    cartItems: [cartSchema],
    addressList: [addressSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export const Address = mongoose.model("Address", addressSchema);

export default User;
