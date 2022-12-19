class ProductDTO {
  constructor(id, title, price, description) {
    (this.id = id), (this.title = title), (this.price = price), (this.description = description);
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getTitle() {
    return this.title;
  }

  setTitle(title) {
    this.title = title;
  }

  getPrice() {
    return this.price;
  }

  setPrice(price) {
    this.price = price;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = description;
  }
}

module.exports = ProductDTO;
