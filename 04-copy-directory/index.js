const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

async function copyFolder(dir, dirCopy) {
  try {
    const files = await readdir(dir, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        await copyFile(
          path.join(dir, file.name),
          path.join(dirCopy, file.name)
        );
      } else if (file.isDirectory()) {
        await mkdir(path.join(dirCopy, file.name));
        await copyFolder(
          path.join(dir, file.name),
          path.join(dirCopy, file.name)
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

(async function () {
  await rm(folderCopyPath, { recursive: true, force: true });
  await mkdir(folderCopyPath);
  await copyFolder(folderPath, folderCopyPath);
})();
