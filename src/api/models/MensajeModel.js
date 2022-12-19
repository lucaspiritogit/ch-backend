const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const authorSchema = new Schema({
  id: { type: String, require: true, max: 1000 },
  timestamp: { type: String, require: true, max: 10000 },
  name: { type: String, require: true, max: 1000 },
  lastName: { type: String, require: true, max: 1000 },
  age: { type: Number, require: true, max: 1000 },
  alias: { type: String, require: true, max: 1000 },
  avatar: { type: String, require: true, max: 1000 },
});

const messageSchema = new Schema({
  author: authorSchema,
  message: { type: String, require: true, max: 1000 },
});

const MessageModel = mongoose.model("mensajes", messageSchema);

module.exports = MessageModel;
