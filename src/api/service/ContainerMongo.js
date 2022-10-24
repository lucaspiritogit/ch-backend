import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/ecommerce";
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
<<<<<<< HEAD
      return await this.col.findOne({ _id: id });
=======
      return await this.col.findOne({ id: id });
>>>>>>> clase24
    } catch (error) {
      throw error;
    }
  }
<<<<<<< HEAD

  async updateById(id, obj) {
    try {
      return await this.col.updateOne({ _id: id }, [{ $set: { obj } }]);
    } catch (error) {}
  }

=======
>>>>>>> clase24
  async getAll() {
    try {
      return await this.col.find({});
    } catch (error) {
      throw error;
    }
  }
}

export default ContainerMongo;
