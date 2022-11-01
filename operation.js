import { fork } from "child_process";

const forked = fork("operation.js");

forked.on("number", n => {
  console.log(n);
});

forked.send({ n: 1 });
