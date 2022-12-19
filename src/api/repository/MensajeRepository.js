const MensajesMongoDAO = require("../dao/MensajesMongoDAO.js");

const dao = new MensajesMongoDAO();

class MensajeRepository {
  async getAllMensajes() {
    return await dao.getAll();
  }
}

module.exports = MensajeRepository;
