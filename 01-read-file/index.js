const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const { stdout } = process;

const stream = fs.createReadStream(filePath, 'utf-8')
let result = ''
stream.on('data', data => result += data)
stream.on('end', () => stdout.write(result) )
stream.on('error', err => stdout.write(`Вывод ошибки: ${err.message}`))
