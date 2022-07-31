const fs = require("fs");

class Container {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }

  startDocument() {
    try {
      const readFile = fs.readFileSync(this.filePath, "utf-8");
      if (readFile.length === 0) {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
      } else {
        return;
      }
    } catch (error) {
      throw error;
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
      return object.id;
    } catch (error) {
      throw error;
    }
  }

  getById(objectId) {
    try {
      let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
      let found = false;

      fileData.forEach((element, index) => {
        if (index === objectId) {
          console.log(element);
          found = true;
          return element;
        }
      });

      if (found === false) {
        throw new Error("No existe el Id");
      }
    } catch (error) {
      throw error;
    }
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
    fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
  }
}

const container = new Container("./productos.txt");
container.startDocument();
container.save({ title: "Product", price: 100, thumbnail: "url" });
setTimeout(() => {
  container.getAll();
}, 500);

// Correr solo este metodo para encontrar un elemento
// container.getById(5);

// Correr solo este metodo para borrar un elemento
// container.deleteById(2);

// Correr solo este metodo para limpiar el array
//container.deleteAll();
