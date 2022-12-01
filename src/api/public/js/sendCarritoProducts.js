async function getProductsFromCarrito() {
  let productosFromCarrito = fetch(`${window.location.href}usuario`).then(async response => {
    let products = await response.json();

    return products.productsInCarrito;
  });

  return productosFromCarrito;
}

async function renderProductsInCarrito() {
  let products = await getProductsFromCarrito();
  let html = products
    .map(product => {
      return `
      <div class="producto">
        <h3>Id: ${product[0]._id}</h3>
        <h3>Titulo:${product[0].title}</h3>
        <h3>Precio:${product[0].price}</h3>
        <div class="productoThumbnail">
          <h3>Image:</h3><img  src="${product[0].thumbnail}"/>
        </div>
        <h3>Stock: ${product[0].stock}</h3>
        <h3>Code: ${product[0].code}</h3>
        <h3>Description: ${product[0].description}</h3>
      </div>
    `;
    })
    .join("");
  document.querySelector("#productInCarritoList").innerHTML = html;
}
renderProductsInCarrito();
