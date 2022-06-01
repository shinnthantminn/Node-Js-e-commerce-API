const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "user", required: true },
  to: { type: Schema.Types.ObjectId, ref: "user", required: true },
  type: { type: String, enum: ["text", "image"] },
  msg: { type: String, required: true },
  created: { type: Date, default: Date.now() },
});

const message = mongoose.model("message", messageSchema);

module.exports = message;
