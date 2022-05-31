const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user", required: true },
  item: [{ type: Schema.Types.ObjectId, ref: "orderItem" }],
  count: { type: Number, required: true },
  total: { type: Number, required: true },
  created: { type: Date, default: Date.now() },
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
