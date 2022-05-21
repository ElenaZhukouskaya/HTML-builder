const path = require('path');
const { readdir } = require('fs/promises');
const fs = require('fs');

const folderStylesPath = path.join(__dirname, 'styles');
const folderProjectDistPath = path.join(__dirname, 'project-dist');

async function createBundle(sourceDir, targetDir) {
  try {
    const files = await readdir(sourceDir, { withFileTypes: true });
    const output = fs.createWriteStream(path.join(targetDir, 'bundle.css'));
    for (let file of files) {
      const fileExtname = path.extname(file.name);
      if (file.isFile() && fileExtname === '.css') {
        const input = fs.createReadStream(
          path.join(sourceDir, file.name),
          'utf-8'
        );
        input.pipe(output);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

createBundle(folderStylesPath, folderProjectDistPath);
