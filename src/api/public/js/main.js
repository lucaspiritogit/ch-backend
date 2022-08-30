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

socket.on("nuevo-mensaje-server", mensajes => {
  console.log(mensajes);
  render(mensajes);
});

function render(mensajes) {
  const html = mensajes
    .map(msj => {
      return `
         <h3>Usuario: ${msj.usuario}</h3>
          <h3>Mensaje: ${msj.mensaje}</h3>                        
         `;
    })
    .join("<br>");

  document.getElementById("chatLog").innerHTML = html;
}

const enviarMensaje = () => {
  const inputUsuario = document.getElementById("usuario");
  const inputMensaje = document.getElementById("mensaje");

  const mensaje = {
    usuario: inputUsuario.value,
    mensaje: inputMensaje.value,
  };
  socket.emit("nuevo-mensaje-cliente", mensaje);
};
