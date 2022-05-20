const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

async function getInfoAboutFiles() {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileName = path.parse(filePath).name;
        const fileExtname = path.extname(filePath).slice(1);

        stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
          }
          const fileSize = stats.size / 1024;
          console.log(`${fileName} - ${fileExtname} - ${fileSize}kb`);
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}
getInfoAboutFiles();
