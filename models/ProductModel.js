const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "category" },
  subCategory: { type: Schema.Types.ObjectId, ref: "subCategory" },
  childCategory: { type: Schema.Types.ObjectId, ref: "childCategory" },
  tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  discount: { type: Number, default: 0 },
  features: { type: Array, required: true },
  desc: { type: String, required: true },
  detail: { type: String, required: true },
  status: { type: Boolean, default: true },
  delivery: [{ type: Schema.Types.ObjectId, ref: "delivery" }],
  warranty: [{ type: Schema.Types.ObjectId, ref: "warranty" }],
  colors: { type: Array, required: true },
  sizes: { type: Array, required: true },
  rating: { type: Number, default: 0 },
  images: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const product = mongoose.model("product", productSchema);

module.exports = product;
