const DBClient = require("./DBClient.js");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

let instance = null;
class MongoDBClient extends DBClient {
  async connect() {
    try {
      const URL = process.env.MONGOATLAS_CONNECTION_URL;
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      logger.logError(error);
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
    } catch (error) {
      throw error;
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new MongoDBClient();
    }

    return instance;
  }
}

module.exports = MongoDBClient;
