const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;


const createFolder = () => {
    const folderPath = path.join(__dirname, 'project-dist');
    fs.mkdir(folderPath, { recursive: true }, (err) => {
			if(err) {
				console.log(`Ошибка в создании папки project-dist`)
			}
		})
}
createFolder()


const readTemplateFile = async () => {
	const templateFilePath = path.join(__dirname, 'template.html')
  let templateFileHtml = await fs.promises.readFile(templateFilePath, 'utf-8');
	const regex = /{{(\w+)}}/g;
  let matches = templateFileHtml.matchAll(regex)

	const folderPath = path.join(__dirname, 'project-dist');
	const indexHtmlFilePath = path.join(folderPath, 'index.html')
	

	for (let match of matches) {
    const tagName = match[1];
    const componentFilePath = path.join(__dirname, 'components', `${tagName}.html`)
		const componentFileHtml = await fs.promises.readFile(componentFilePath, 'utf-8')
		templateFileHtml = templateFileHtml.replace(match[0], componentFileHtml)
		fs.writeFile(indexHtmlFilePath, templateFileHtml, (err) => {
			if(err) {
				console.log(`Ошибка записи данных в файл: ${err.message}`)
			}
		})
  }
}
readTemplateFile()




const bundlCssFiles = async () => {

const inputFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const assemblyFile = path.join(outputFolder, 'style.css');

const bundletFile = fs.createWriteStream(assemblyFile);
  const files = await fs.promises.readdir(inputFolder, { withFileTypes: true });

  for(const file of files) {
    const filePath = path.join(inputFolder, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
       fs.createReadStream(filePath).pipe(bundletFile);
    }
  }
}
bundlCssFiles();



const copy = async () => {
	const pathNewFolderAssets = path.join(__dirname, 'project-dist', 'assets');
	const assetsFolderPath = path.join(__dirname, 'assets');
	
		try {
			await fsPromises.mkdir(pathNewFolderAssets, { recursive: true });
	
			const dataEssetsFolder = await fsPromises.readdir(assetsFolderPath, { withFileTypes: true });
			const dataNewFolderAssets = await fsPromises.readdir(pathNewFolderAssets, { withFileTypes: true })
	
			for (const folders of dataNewFolderAssets) {
				const removeFolder = path.join(pathNewFolderAssets, folders.name)
				if(!folders.isFile()) {
					fs.readdir(removeFolder, (err, files) => {
						if(err) {
							console.log(`Ошибка чтения: ${err.message}`)
						};
						if(files.length === 0) {
							fs.rmdir(removeFolder, (err) => {
								if (err) throw err;
								console.log('Папка удалена');
							});
						} else {
							for(const elem of files) {
								fs.unlink(path.join(removeFolder, elem), err => {
									if(err) {
										console.log(`Ошибка удаления файлов в папках project-dist/assets/[fonts, img, svg]: ${err.message}`)
									}
								})
							}
						}
					})
				} else {
					fs.unlink(path.join(removeFolder), err => {
						if(err) {
							console.log(`Ошибка удаления файлов в папке project-dist/assets: ${err.message}`)
						}
					})
				}
			}


			for (const folder of dataEssetsFolder) {
				if(!folder.isFile()) {
					const folders = path.join(pathNewFolderAssets, folder.name)
					const foldersAssets = path.join(assetsFolderPath, folder.name)
	
					await fsPromises.mkdir(folders, { recursive: true });
					const readContent = await fsPromises.readdir(foldersAssets)
	
					for(const elem of readContent) {
						await fsPromises.copyFile(path.join(foldersAssets, elem), path.join(folders, elem));
					}
				} else {
					await fs.promises.copyFile(path.join(__dirname, 'assets', folder.name), path.join(__dirname, 'project-dist', 'assets', folder.name));
				}
			}
		} catch (err) {
			console.error(err);
		}
	}
	copy();