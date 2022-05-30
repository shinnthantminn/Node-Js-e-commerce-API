const mongoose = require("mongoose"),
  { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  subCategory: [{ type: Schema.Types.ObjectId, ref: "subCategory" }],
  createdAt: { type: Date, default: Date.now() },
});

const category = mongoose.model("category", categorySchema);

module.exports = category;
