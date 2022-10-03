import { Schema } from "mongoose";

import ContainerMongo from "../service/ContainerMongo.js";

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

class MensajesMongoDAO extends ContainerMongo {
  constructor() {
    super("mensajes", messageSchema);
  }
}

export default MensajesMongoDAO;
