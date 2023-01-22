class ProductDTO {
  constructor(id, title, price, description, thumbnail, stock, code) {
    (this.id = id),
      (this.title = title),
      (this.price = price),
      (this.description = description),
      (this.thumbnail = thumbnail),
      (this.stock = stock),
      (this.code = code);
  }
}

module.exports = ProductDTO;
