const fs = require("fs");

class Container {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async startDocument() {
    const readFile = fs.readFileSync(this.filePath, "utf-8");
    if (readFile.length === 0) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
    } else {
      return;
    }
  }

  async save(object) {
    try {
      let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
      await fileData.push(object);

      fileData.forEach((element, index) => {
        element.id = index;
      });

      await fs.promises.writeFile(this.filePath, JSON.stringify(fileData, null, 2), "utf-8");
    } catch (error) {
      throw error;
    }
  }

  getById(objectId) {
    let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    fileData.forEach(element => {
      if (element.id === objectId) {
        console.log(element);
        return element;
      }
    });
  }

  getAll() {
    return fs.readFileSync(this.filePath, "utf-8");
  }

  deleteById(objectId) {
    let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));

    fileData.forEach(element => {
      if (element.id === objectId) {
        fileData.splice(objectId, 1);
        fs.writeFileSync(this.filePath, JSON.stringify(fileData, null, 2));
      }
    });
  }

  deleteAll() {
    fs.writeFileSync(this.filePath, "", "utf-8");
  }
}

const container = new Container("./productos.txt");
container.startDocument();
container.save({ title: "Product", price: 100, thumbnail: "url" });
setTimeout(() => {
  container.getAll();
}, 500);

// Correr solo este metodo para encontrar un elemento
// container.getById(6);

// Correr solo este metodo para borrar un elemento
// container.deleteById(2);

// Correr solo este metodo para limpiar el documento
// container.deleteAll();
