const mongoose = require("mongoose");
const MongoDBClient = require("../config/MongoDBClient.js");
const mongo = new MongoDBClient();
mongo.connect();

class ContainerMongo {
  constructor(collectionName, scheme) {
    this.col = mongoose.model(collectionName, scheme);
  }
  async save(obj) {
    try {
      const prodModel = new this.col(obj);
      return await prodModel.save();
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async deleteById(id) {
    try {
      await this.col.findByIdAndDelete({ _id: id });
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async getById(id) {
    try {
      return await this.col.findById({ _id: id });
    } catch (error) {
      throw error;
    } finally {
    }
  }

  async findUser(username) {
    try {
      return await this.col.findOne({ username: username });
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return await this.col.find({});
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContainerMongo;
