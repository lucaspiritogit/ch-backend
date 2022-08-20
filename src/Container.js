const fs = require("fs");

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
      try {
        data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
        let newId;

        if (data.length) {
          newId = data[data.length - 1].id + 1;
        } else {
          newId = 1;
        }

        let newObj = { id: newId, ...object };
        data.push(newObj);
        data.sort((firstObj, secondObj) => firstObj.id - secondObj.id);

        fs.writeFile(this.filePath, JSON.stringify(data, null, 2), err => {
          if (err) throw err;
          return newObj.id;
        });
      } catch (error) {
        throw new Error(`
        ${error.message}
        
        Verificar si hay algun error de sintaxis en el txt.
        Por ejemplo: Alguna ',' (coma) que no antecede a un '{}'(objeto)        
        `);
      }
    });
  }

  getById(objectId) {
    try {
      let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));

      if (!fileData[objectId - 1]) {
        throw "Objeto no encontrado";
      }

      const foundObject = fileData.find(object => object.id === parseInt(objectId));

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  deleteById(objectId) {
    try {
      let fileData = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
      let index = fileData.findIndex(object => object.id == objectId);

      if (index == -1) {
        throw new Error({ error: "Objeto no encontrado" });
      }

      fileData.splice(index, 1);
      fs.writeFileSync(this.filePath, JSON.stringify(fileData, null, 2));
    } catch (error) {
      throw error;
    }
  }

  deleteAll() {
    fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
  }

  getAll() {
    let fileData = fs.readFileSync(this.filePath, "utf-8", err => {
      if (err) throw err;
    });
    return JSON.parse(fileData);
  }
}

module.exports = Container;
