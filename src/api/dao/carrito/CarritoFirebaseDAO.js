/* --------------------------- Firebase ---------------------------------- */

var admin = require("firebase-admin");

var serviceAccount = require("../../db/certificateFirebase/coderhouse-backend-lp-firebase-adminsdk-56jxd-1dc3e4d9d1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


async function Crud() {
  try {
    const db = admin.firestore();
    const carrito = db.collection("carrito");
  } catch (error) {}
}
