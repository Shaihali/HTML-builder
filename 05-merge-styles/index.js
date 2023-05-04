const fs = require('fs');
const path = require('path');

const inputFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const assemblyFile = path.join(outputFolder, 'bundle.css');

const bundletFile = fs.createWriteStream(assemblyFile);

(async () => {
  const files = await fs.promises.readdir(inputFolder, { withFileTypes: true });

  for(const file of files) {
    const filePath = path.join(inputFolder, file.name);
    if (file.isFile() && path.extname(file.name) === '.css') {
       fs.createReadStream(filePath).pipe(bundletFile);
    }
  }
})();
