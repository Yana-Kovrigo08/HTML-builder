const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const process = require("process");
const { stdin, stdout } = process;
let writeableStream = fs.createWriteStream(path.join(__dirname, "text.txt"));
console.log("Введите текст!");

stdin.on("data", (data) => {
  if (data.toString().trim() == "exit") {
    endFunc();
  }
  console.log("Введите текст!");
  writeableStream.write(data);
});

process.on('SIGINT', endFunc);

function endFunc(){
    stdout.write('До свидания!');
    exit();
}
