const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();

const FIREBASE_CERTIFICATE = JSON.parse(process.env.FIREBASE_CERTIFICATE);

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CERTIFICATE),
});

console.log("Connected with firebase");
const db = admin.firestore();
class ContainerFirebase {
  constructor(collectionName) {
    this.col = db.collection(collectionName);
  }

  async save(obj) {
    try {
      await this.col.add({ obj });
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const doc = await this.col.doc(id).get();

      if (!doc.exists) throw new Error("Carrito not found");

      const carrito = doc.data();
      return { ...carrito, id };
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const result = [];
      const carrito = await this.col.get();
      carrito.forEach(doc => result.push(doc.data()));
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateById(obj) {
    try {
      const updatedDoc = await this.col.doc(obj.id).set(obj);
      return updatedDoc;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const doc = this.col.doc(id);
      await doc.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContainerFirebase;
