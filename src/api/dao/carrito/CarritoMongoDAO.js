import mongoose from "mongoose";
import ContainerMongo from "../../service/ContainerMongo.js";

const carritoSchema = new mongoose.Schema({
  products: [String],
  timestamp: { type: String, require: true, max: 10000 },
});

class CarritoMongoDAO extends ContainerMongo {
  constructor() {
    super("carrito", carritoSchema);
  }
}

export default CarritoMongoDAO;
