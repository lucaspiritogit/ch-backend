import admin from "firebase-admin";
import serviceAccount from "../db/certificateFirebase/coderhouse-backend-lp-firebase-adminsdk-56jxd-1dc3e4d9d1.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

  async updateById(id, obj) {
    try {
      const doc = this.col.doc(`${id}`);

      await doc.update({ obj });
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

export default ContainerFirebase;
