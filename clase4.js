const fs = require("fs");

class Container {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }

  startDocument() {
    fs.readFile(this.filePath, (err, data) => {
      if (data.length === 0) {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), err => {
          if (err) throw err;
        });
      }
    });
  }

  async save(object) {
    fs.readFile(this.filePath, (err, data) => {
      data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
      let newId = 1;
      data.forEach(() => {
        newId = data[data.length - 1].id + 1;
      });
      let newObj = { id: newId, ...object };
      data.push(newObj);

      fs.writeFile(this.filePath, JSON.stringify(data, null, 2), err => {
        if (err) throw err;
        return newObj.id;
      });
    });
  }

  getById(objectId) {
    try {
      let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
      let found = false;

      fileData.forEach(element => {
        if (objectId === element.id) {
          found = true;
          console.log(element);
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

  async deleteById(objectId) {
    let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    let index = fileData.findIndex(object => object.id == objectId);

    try {
      fileData.splice(index, 1);
      fs.writeFileSync(this.filePath, JSON.stringify(fileData, null, 2));
    } catch (error) {
      if (index === -1) {
        return "Objeto no encontrado";
      }
      throw error;
    }
  }

  deleteAll() {
    fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
  }
}

const container = new Container("./productos.txt");

container.startDocument();

container.save({ title: "Product", price: 100, thumbnail: "url" });

// Descomentar metodos una vez el array este populado
// container.getById(2);

// container.getAll();

// container.deleteById(1);
