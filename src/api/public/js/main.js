const socket = io();

socket.on("productos", productos => {
  const listado = productos
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
                        <h3>Imagen representativa:</h3><img  src="${product.thumbnail}"/>
                    </div>
                </div>
            `;
    })
    .join("");
  document.querySelector("#listadoProductos").innerHTML = listado;
});

function render(mensajes) {
  const html = mensajes
    .map(msj => {
      return `
      <div class="mensajes">
        <h3 class="usuario">${msj.usuario}:</h3>
        <h3 class="mensaje">&nbsp${msj.mensaje}&nbsp</h3>
        <h3 class="timestamp">| [${msj.timestamp}]</h3>                        
       </div
        `;
    })
    .join("<br>");

  document.getElementById("chatLog").innerHTML = html;
}

socket.on("nuevo-mensaje-server", data => {
  console.log(data);
  render(data);
});

const enviarMensaje = () => {
  const inputEmail = document.getElementById("email");
  const inputMensaje = document.getElementById("mensaje");
  const time = new Date();

  const mensaje = {
    usuario: inputEmail.value,
    mensaje: inputMensaje.value,
    timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
  };

  socket.emit("nuevo-mensaje-cliente", mensaje);
  return false;
};
