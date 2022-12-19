const ContainerMongo = require("../containers/ContainerMongo.js");
const MensajeModel = require("../models/MensajeModel.js");

class MensajesMongoDAO extends ContainerMongo {
  constructor() {
    super("mensajes", MensajeModel.messageSchema);
  }
}

module.exports = MensajesMongoDAO;
