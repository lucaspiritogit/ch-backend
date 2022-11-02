console.log("child created", process.pid);

process.on("message", message => {
  console.log(message);
  process.send("test");
});
// let arrOfNumbers = [];
// for (let i = 1; i <= message; i++) {
//   arrOfNumbers.push({
//     num: i,
//   });
// }
