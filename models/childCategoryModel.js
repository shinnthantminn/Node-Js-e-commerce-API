const mongoose = require("mongoose"),
  { Schema } = mongoose;

const childCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: "subCategory" },
  createdAt: { type: Date, default: Date.now() },
});

const childCategory = mongoose.model("childCategory", childCategorySchema);

module.exports = childCategory;