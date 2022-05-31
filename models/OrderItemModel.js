const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemModel = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "order" },
  count: { type: Number, default: 0 },
  productId: { type: Schema.Types.ObjectId, ref: "product" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["ACCEPT", "PENDING", "DELIVERY"],
    default: "ACCEPT",
  },
  createdAt: { type: Date, default: Date.now() },
});

const orderItem = mongoose.model("orderItem", orderItemModel);

module.exports = orderItem;
