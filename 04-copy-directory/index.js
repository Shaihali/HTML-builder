const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const pathNewDir = path.join(__dirname, 'files-copy');
const dirPath = path.join(__dirname, 'files');

(async () => {
  try {
    await fsPromises.mkdir(pathNewDir, { recursive: true });

    const dataOldFile = await fsPromises.readdir(dirPath);
		const dataCopyFile = await fsPromises.readdir(pathNewDir)

		for (const elem of dataCopyFile) {
			fs.unlink(path.join(pathNewDir, elem), err => {
				if(err) throw err
			})
		}
    for (const elem of dataOldFile) {
      await fsPromises.copyFile(path.join(dirPath, elem), path.join(pathNewDir, elem));
    }
  } catch (err) {
    console.error(err);
  }
})();


	