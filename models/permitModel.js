const mongoose = require("mongoose"),
  { Schema } = mongoose;

const permitModel = new Schema({
  name: { type: String, required: true, unique: true },
  createAt: { type: Date, default: Date.now() },
});

const permit = mongoose.model("permit", permitModel);

module.exports = permit;
