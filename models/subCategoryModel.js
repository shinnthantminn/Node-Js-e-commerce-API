const mongoose = require("mongoose"),
  { Schema } = mongoose;

const subCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  childCategory: [{ type: Schema.Types.ObjectId, ref: "childCategory" }],
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

const subCategory = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategory;
