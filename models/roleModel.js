const mongoose = require("mongoose"),
  { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permit: [{ type: Schema.Types.ObjectId, ref: "permit" }],
  createdAt: { type: Date, default: Date.now() },
});

const role = mongoose.model("role", roleSchema);

module.exports = role;
