import { Schema } from "mongoose";

import ContainerMongo from "../service/ContainerMongo.js";

const sesionSchema = new Schema({
  user: { type: String, require: true, max: 1000 },
});

class SesionesMongoDAO extends ContainerMongo {
  constructor() {
    super("sessions", sesionSchema);
  }
}

export default SesionesMongoDAO;
