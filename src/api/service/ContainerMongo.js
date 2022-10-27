import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const URL = process.env.MONGO_CONNECTION_URL;
let rta = await mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

await mongoose.connect(URL, rta);

console.log("Connected with MongoDB");
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
    }
  }

  async deleteById(id) {
    try {
      await this.col.deleteOne({ id: id });
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      return await this.col.findOne({ id: id });
    } catch (error) {
      throw error;
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

export default ContainerMongo;
