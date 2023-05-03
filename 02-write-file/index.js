const fs = require('fs')
const path = require('path');
const readline = require('readline')

const filePath = path.join(__dirname, 'text.txt')

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})
rl.on('error', err => {
	if(err) {
		console.log(`Ошибка чтения ввода: ${err}`)
	}
})
const writeStream = fs.createWriteStream(filePath)
writeStream.on('error', err => {
	if(err) {
		console.log(`Ошибка записи в файл ${err}`)
	}
})

rl.write('Привет, введи текст!\n');
rl.on('line', (data) => {
	const str = data.toString()
	if (str === 'exit') {
		rl.close()
  } else {
		writeStream.write(str)
	}
})
rl.on('close', function() {
	console.log('Пока...!')
});