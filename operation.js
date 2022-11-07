console.log("child created", process.pid);

process.on("message", message => {
  console.log(message);
  const response = calcularCantidad(message.cant);
  process.send(response);
});

function calcularCantidad(cant) {
  let arrOfNumbers = [];
  for (let i = 1; i <= cant; i++) {
    arrOfNumbers.push({
      num: i,
    });
  }
  console.log("🚀 ~ file: operation.js ~ line 19 ~ calcularCantidad ~ arrOfNumbers", arrOfNumbers);
  return arrOfNumbers;
}
