// 1)
class Usuario {
  // 2)
  constructor(nombre, apellido, libros, mascotas) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;
  }

  // 3)
  getFullName() {
    return `${this.nombre} ${this.apellido}`;
  }

  addMascota(petName) {
    this.mascotas.push(petName);
  }

  countMascotas() {
    return this.mascotas.length;
  }

  addBook(nombre, autor) {
    this.libros.push({ nombre, autor });
  }

  getBookNames() {
    let bookNames = this.libros.map((libro) => {
      return libro.nombre;
    });
    return bookNames;
  }
}

// 4)
const usuario = new Usuario("Lucas", "Pirito", [], []);
usuario.getFullName();
usuario.addMascota("Carlitooos");
usuario.countMascotas();
usuario.addBook("Clean Code", "Uncle Bob");
usuario.addBook("El Principito", "Antoine");
usuario.getBookNames();

// Console logs para testear
console.log("-------------------------------------------------------");
console.log(usuario);
console.log("-------------------------------------------------------");
console.log(usuario.getFullName());
console.log("-------------------------------------------------------");
console.log(usuario.getBookNames());
console.log("-------------------------------------------------------");
console.log(usuario.countMascotas());
