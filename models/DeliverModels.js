const mongoose = require("mongoose"),
  { Schema } = mongoose;

const deliverSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  remark: Array,
  createdAt: { type: Date, default: Date.now() },
});

const delivery = mongoose.model("delivery", deliverSchema);

module.exports = delivery;
