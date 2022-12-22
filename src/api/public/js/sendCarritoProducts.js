async function getProductsFromCarrito() {
  try {
    let response = await fetch(`${window.location.href}`);
    let products = await response.json();

    return products.productsInCarrito;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function renderProductsInCarrito() {
  let products = await getProductsFromCarrito();
  let html = products
    .map(product => {
      return `
    <div class="producto">
      <h3>Id: ${product._id}</h3>
          <h3>Titulo: ${product.title}</h3>
          <h3>Precio: ${product.price}</h3>
          <div class="productoThumbnail">
            <h3>Image:</h3><img src="${product.thumbnail}"/>
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
renderProductsInCarrito();
