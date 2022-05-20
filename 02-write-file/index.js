const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);
stdout.write('Enter some text to write in file text.txt please\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  output.write(data.toString());
});
process.on('exit', () => stdout.write('Goodbye! This session is over.')); // exit
process.on('SIGINT', exit); //Ctrl + C
