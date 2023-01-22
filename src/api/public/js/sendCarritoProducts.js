const emptyCartBtn = document.querySelector('#emptyCartBtn');
let totalPriceHtml = document.getElementById('totalPrice');

async function getProductsFromCarrito() {
  try {
    let response = await fetch('/api/carrito').then(res => res.json());

    return response.carrito;
  } catch (error) {
    throw error;
  }
}

async function removeAllProductsFromCarrito() {
  let carritoId = await fetch(`/api/carrito`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async r => {
    const response = await r.json();
    return await response.carrito._id;
  });

  let response = await fetch(`/api/carrito/${carritoId}/productos`, {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });

  return response;
}

emptyCartBtn.addEventListener('click', async () => {
  await removeAllProductsFromCarrito();
  window.location.reload();
});

function getTotalPriceInCart(products) {
  let totalPrice = 0;
  products.forEach(product => {
    if (product == null) {
      totalPrice = 0;
    } else {
      totalPrice += product.price;
    }
  });
  totalPriceHtml.innerHTML = totalPrice;
}
async function renderProductsInCarrito() {
  let products = await getProductsFromCarrito();
  getTotalPriceInCart(products);
  let html = products
    .map(product => {
      if (product == null) {
        return;
      }
      return `
      <div class="producto">
      <h3>Id: ${product._id}</h3>
          <h3>Title: ${product.title}</h3>
          <h3>Price: ${product.price}</h3>
          <div class="productoThumbnail">
            <h3>Image:</h3><img src="${product.thumbnail}"/>
          </div>
          <h3>Stock: ${product.stock}</h3>
          <h3>Code: ${product.code}</h3>
          <h3>Description: ${product.description}</h3>
    </div>
        `;
    })
    .join('');
  document.querySelector('#productInCarritoList').innerHTML = html;
}

renderProductsInCarrito();
