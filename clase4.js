const fs = require("fs");
const { runInContext } = require("vm");

class Container {
  filePath;
  constructor(filePath) {
    this.filePath = filePath;
  }

  async startDocument() {
    fs.readFile(this.filePath, (err, data) => {
      if (data.length === 0) {
        fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), err => {
          if (err) throw err;
        });
      } else if (err) {
        throw err;
      }
    });
  }

  async save(object) {
    await this.startDocument();
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

  deleteById(objectId) {
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

  async getAll() {
    let fileData = fs.readFileSync(this.filePath, "utf-8", err => {
      if (err) throw err;
    });
    console.log("Obteniendo todos los objetos", fileData);
    return await JSON.parse(fileData);
  }
}

const container = new Container("./productos.txt");
container.save({ title: "Product", price: 100, thumbnail: "url" });

//  Descomentar metodos una vez este populado el array

//  container.getById(1);
//  container.deleteById(1);
// container.deleteAll();

setTimeout(() => {
  container.getAll();
}, 300);
