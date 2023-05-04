const fs = require('fs');
const path = require('path');

const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder')
const directoryPath = path.join(__dirname, '/secret-folder')

fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
	if(err) {
		console.log(`Вывод ошибки чтения дириктории: ${err}`)
	}
	files.forEach((file) => {
		if(file.isFile()) {
			const filePath = path.join(directoryPath, file.name)
				fs.stat(filePath, (err, stats) => {
					if(err) throw err
					const fileName = path.parse(filePath)
					const fileExtension = path.extname(filePath).substring(1)
					const fileSize = `${(stats.size / 1024).toFixed(2)}kb`
					stdout.write(`${fileName.name} - ${fileExtension} - ${fileSize}\n`)
				})
		}
	})
})