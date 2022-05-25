const mongoose = require("mongoose"),
  { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permit: [{ type: Schema.Types.ObjectId, ref: "permit" }],
  role: [{ type: Schema.Types.ObjectId, ref: "role" }],
  createdAt: { type: Date, default: Date.now() },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
