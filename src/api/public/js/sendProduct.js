// /* --------------------------- Products ---------------------------------- */
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

const deleteAllProductsBtn = document.getElementById("deleteAllProducts");

async function deleteAllProducts() {
  let deleteAllProducts = await fetch(`${window.location.href}api/productos`, {
    method: "delete",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async r => {
    const response = await r.json();
    console.log("🚀 ~ file: sendProduct.js:31 ~ deleteAllProducts ~ response", response);
    return response;
  });
  return deleteAllProducts;
}

deleteAllProductsBtn.addEventListener("click", async () => {
  socket.emit("productos-cliente", {});
  await deleteAllProducts();
});

async function createCarrito() {
  let createCarrito = await fetch(`${window.location.href}api/carrito`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async r => {
    const response = await r.json();
    return response;
  });
  return createCarrito;
}

async function getCarritoId() {
  let carritoId = await fetch(`${window.location.href}api/carrito`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async r => {
    const response = await r.json();
    return await response.carrito._id;
  });
  return carritoId;
}

async function renderProducts(productos) {
  // Crear carrito por si no lo tiene antes de renderizar productos
  await createCarrito();
  // Obtener su id
  let carritoId = await getCarritoId();

  let html = productos
    .map(product => {
      return `
    <form action="/api/carrito/${carritoId}/productos/${product.id}" method="POST">
      <div class="producto">
        <h3>Id: ${product.id}</h3>
        <h3>Titulo:${product.title}</h3>
        <h3>Precio:${product.price}</h3>
        <h3>Description: ${product.description}</h3>
        <div class="productoThumbnail">
          <h3>Image:</h3><img src="${product.thumbnail}"/>
        </div>
        <h3>Stock: ${product.stock}</h3>
        <h3>Code: ${product.code}</h3>
        <button id="addToCartBtn" type="submit">Agregar al carrito</button>
      </div>
    </form>
    `;
    })
    .join("");

  document.querySelector("#listadoProductos").innerHTML = html;
}
socket.on("productos-server", productos => {
  renderProducts(productos);
});
