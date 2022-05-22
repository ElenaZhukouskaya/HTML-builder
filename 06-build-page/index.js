const path = require('path');
const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const fs = require('fs');

const templatePath = path.join(__dirname, 'template.html');
const folderComponentsPath = path.join(__dirname, 'components');
const folderStylesPath = path.join(__dirname, 'styles');
const folderAssetsPath = path.join(__dirname, 'assets');
const folderProjectDistPath = path.join(__dirname, 'project-dist');

async function createFolder(folderName) {
  await rm(folderName, { recursive: true, force: true });
  await mkdir(folderName);
}

async function createHTML(source, template) {
  try {
    const templateStream = fs.createReadStream(template, 'utf-8');
    let templateContent = '';

    templateStream.on('data', (chunk) => (templateContent += chunk));
    templateStream.on('error', (error) => console.log('Error', error.message));
    templateStream.on('end', () => readComponents(source, templateContent));
  } catch (err) {
    console.error(err);
  }
}

async function readComponents(source, templateContent) {
  try {
    const components = await readdir(source, {
      withFileTypes: true,
    });
    for (let component of components) {
      const componentsStream = fs.createReadStream(
        path.join(source, component.name),
        'utf-8'
      );
      const fileComponentName = path.basename(
        path.join(source, component.name),
        '.html'
      );
      let componentsContent = '';
      componentsStream.on('data', (chunk) => (componentsContent += chunk));
      componentsStream.on('error', (error) =>
        console.log('Error', error.message)
      );

      componentsStream.on('end', () => {
        let regexp = new RegExp(`{{${fileComponentName}}}`, 'g');

        templateContent = templateContent.replace(regexp, componentsContent);

        const output = fs.createWriteStream(
          path.join(folderProjectDistPath, 'index.html')
        );
        output.write(templateContent);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

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

async function createBundle(sourceDir, targetDir) {
  try {
    const files = await readdir(sourceDir, { withFileTypes: true });
    const output = fs.createWriteStream(path.join(targetDir, 'style.css'));
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

(async function () {
  await createFolder(folderProjectDistPath);
  await createFolder(folderProjectDistPath + '\\assets');
  createHTML(folderComponentsPath, templatePath);
  createBundle(folderStylesPath, folderProjectDistPath);
  copyFolder(folderAssetsPath, path.join(folderProjectDistPath, 'assets'));
})();
