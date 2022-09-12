const socket = io();

/* --------------------------- Messages ---------------------------------- */
const sendMessage = () => {
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

function renderMessages(mensajes) {
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

// When messages are received, render them in HTML format.
socket.on("nuevo-mensaje-server", messages => {
  renderMessages(messages);
});
