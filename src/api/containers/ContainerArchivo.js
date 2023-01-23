const { readFile, readFileSync, writeFileSync, writeFile } = require('fs');

class ContainerArchivo {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async startDocument() {
    await readFile(this.filePath, (err, data) => {
      data.length ? 0 : writeFileSync(this.filePath, JSON.stringify([], null, 2));
      if (err) {
        throw err;
      }
    });
  }

  async save(object) {
    await this.startDocument();
    await readFile(this.filePath, async (err, data) => {
      try {
        data = JSON.parse(readFileSync(this.filePath, 'utf-8'));
        let newId;

        if (data.length) {
          newId = data[data.length - 1].id + 1;
        } else {
          newId = 1;
        }

        let newObj = { id: newId, ...object };
        data.push(newObj);
        data.sort((firstObj, secondObj) => firstObj.id - secondObj.id);

        await writeFile(this.filePath, JSON.stringify(data, null, 2), err => {
          if (err) throw err;
        });

        return newObj.id;
      } catch (error) {
        throw new Error(
          `${error.message}
          
          Verificar si hay algun error de sintaxis en el txt.
          Por ejemplo: Alguna ',' (coma) que no antecede a un '{}'(objeto)`
        );
      }
    });
  }

  async getById(objectId) {
    try {
      let fileData = await JSON.parse(readFileSync(this.filePath, 'utf-8'));
      const foundObject = fileData.find(object => object.id === objectId);
      if (!foundObject) throw 'Objeto no encontrado';

      return foundObject;
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    await this.startDocument();
    try {
      let fileData = readFileSync(this.filePath, 'utf-8');
      return JSON.parse(fileData);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(objectId) {
    try {
      let fileData = JSON.parse(readFileSync(this.filePath, 'utf-8'));
      let index = fileData.findIndex(object => object.id == objectId);

      if (index == -1) {
        throw new Error({ error: 'Objeto no encontrado' });
      }

      fileData.splice(index, 1);
      writeFileSync(this.filePath, JSON.stringify(fileData, null, 2));
    } catch (error) {
      throw error;
    }
  }

  deleteAll() {
    writeFileSync(this.filePath, []);
  }

  async updateById(id, modifiedObj) {
    try {
      await this.deleteById(id);
      await this.save(modifiedObj);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContainerArchivo;
