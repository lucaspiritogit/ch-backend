const socket = io();
/* --------------------------- Messages ---------------------------------- */
const sendMessage = () => {
  const inputEmail = document.getElementById("email");
  const inputMensaje = document.getElementById("mensaje");

  const time = new Date();

  const mensaje = {
    author: {
      id: inputEmail.value,
      timestamp: time.toLocaleDateString() + " " + time.toLocaleTimeString(),
    },
    message: inputMensaje.value,
  };

  socket.emit("nuevo-mensaje-cliente", mensaje);
  return false;
};

function renderMessages(mensajes) {
  const html = mensajes
    .map(msj => {
      return `
        <div class="mensajes">
          <h3 class="timestamp">[${msj.author.timestamp}]&nbsp</h3>
          <h3 class="usuario">${msj.author.id}:</h3>
          <h3 class="mensaje">&nbsp${msj.message}&nbsp</h3>
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
