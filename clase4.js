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

setInterval(() => {
  container.save({ title: "Product", price: 100, thumbnail: "url" });
}, 1500);

setInterval(() => {
  console.log("Obteniendo todos los objetos: ");
  console.log(container.getAll());
  container.getAll();
}, 5000);

setInterval(() => {
  console.log("Obteniendo un solo objeto");
  container.getById(0);
}, 2500);

setInterval(() => {
  container.deleteAll();
  console.log("Borrando todos los objetos");
}, 8000);

setInterval(() => {
  container.deleteById(1);
  console.log("Borrando Id 1");
}, 6500);
