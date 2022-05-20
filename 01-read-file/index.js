const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let content = '';

stream.on('data', (chunk) => (content += chunk));
stream.on('error', (error) => console.log('Error', error.message));
stream.on('end', () => console.log(content));
