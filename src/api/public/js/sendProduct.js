/* --------------------------- Products ---------------------------------- */

const sendProduct = () => {
  const title = document.getElementById("title");
  const price = document.getElementById("price");
  const thumbnail = document.getElementById("thumbnail");
  const stock = document.getElementById("stock");
  const code = document.getElementById("code");
  const description = document.getElementById("description");

  const prod = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
    stock: stock.value,
    code: code.value,
    description: description.value,
  };
  socket.emit("productos-cliente", prod);
  return false;
};

function renderProducts(productos) {
  const html = productos
    .map(product => {
      if (product.price == null) {
        product.price = `Valor no ingresado`;
      }
      return `
    <div class="producto">
      <h3>Id: ${product.id}</h3> 
      <h3>Titulo:${product.title}</h3>
      <h3>Precio:${product.price}</h3>
      <div class="productoThumbnail">
        <h3>Image:</h3><img  src="${product.thumbnail}"/>
      </div>
      <h3>Stock: ${product.stock}</h3>
      <h3>Code: ${product.code}</h3>
      <h3>Description: ${product.description}</h3>
    </div>
    `;
    })
    .join("");
  document.querySelector("#listadoProductos").innerHTML = html;
}

// When products are received, render them in HTML format.
socket.on("productos-server", productos => {
  renderProducts(productos);
});
