const socket = io.connect();
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

const authorSchema = new normalizr.schema.Entity("author", {}, { idAttribute: "email" });
const messageSchema = new normalizr.schema.Entity(
  "message",
  { author: authorSchema },
  { idAttribute: "id" }
);
const messagesSchema = new normalizr.schema.Entity(
  "messages",
  {
    messages: [messageSchema],
  },
  { idAttribute: "id" }
);

socket.on("nuevo-mensaje-server", messages => {
  let mensajesNormalizedSize = JSON.stringify(messages).length;
  let denormalizedMessages = normalizr.denormalize(
    messages.result,
    messagesSchema,
    messages.entities
  );
  let denormalizedMessagesSize = JSON.stringify(denormalizedMessages).length;

  let percentage = parseInt((mensajesNormalizedSize * 100) / denormalizedMessagesSize);

  document.getElementById("compressionRate").innerHTML = `${percentage}%`;

  renderMessages(denormalizedMessages);
});

function renderMessages(mensajes) {
  try {
    const chatLog = mensajes.allMessages
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
    document.getElementById("chatLog").innerHTML = chatLog;
  } catch (error) {
    throw error;
  }
}
