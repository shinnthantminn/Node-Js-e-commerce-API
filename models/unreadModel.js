const mongoose = require("mongoose");
const { Schema } = mongoose;

const unreadSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "user", required: true },
  to: { type: Schema.Types.ObjectId, ref: "user", required: true },
  created: { type: Date, default: Date.now() },
});

const unread = mongoose.model("unread", unreadSchema);

module.exports = unread;
