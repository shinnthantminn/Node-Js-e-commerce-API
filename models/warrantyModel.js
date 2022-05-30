const mongoose = require("mongoose"),
  { Schema } = mongoose;

const warrantySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  remark: Array,
});

const warranty = mongoose.model("warranty", warrantySchema);

module.exports = warranty;
