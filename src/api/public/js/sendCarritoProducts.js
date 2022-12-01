const socket = io.connect();

async function renderProductsInCarrito(productos) {
  let html = productos
    .map(product => {
      return `
        <div class="producto">
          <h3>Id: ${product._id}</h3>
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
  document.querySelector("#productInCarritoList").innerHTML = html;
}

socket.on("carrito-server", productos => {
  renderProductsInCarrito(productos);
});
