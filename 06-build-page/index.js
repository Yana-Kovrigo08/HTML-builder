const path = require('path');
const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');

async function createDistFolder(path) {
  await fs.mkdir(path, { recursive: true });
}

async function bundleCSS(src, target) {
  const files = await fs.readdir(src, { withFileTypes: true });
  const output = createWriteStream(target);

  files.forEach(file => {
    if (!file.isFile() || path.parse(file.name).ext !== '.css') {
      return;
    }

    const input = createReadStream(path.join(src, file.name));
    input.pipe(output);
  });
}

async function copyDir(src, target) {
  await fs.rm(target, { recursive: true, force: true });
  await fs.mkdir(target, { recursive: true });

  const files = await fs.readdir(src, { withFileTypes: true });
  
  files.forEach(file => {
    const fileSrcPath = path.join(src, file.name);
    const fileTargetPath = path.join(target, file.name);

    if (file.isDirectory()) {
      copyDir(fileSrcPath, fileTargetPath);
    } else {
      fs.copyFile(fileSrcPath, fileTargetPath);
    }
  });
}

async function buildHTML(template, partialsPath, target) {
  let templateContent = await fs.readFile(template, 'utf8');

  while (true) {
    const [tag, partialName] = templateContent.match(/{{(.+?)}}/) ?? [];

    if (!tag) break;

    const replacer = await fs.readFile(
      path.join(partialsPath, partialName + '.html'),
      'utf-8'
    );

    templateContent = templateContent.replace(tag, replacer);
  }

  fs.writeFile(target, templateContent);
}

const PROJECT_DIST = path.join(__dirname, 'project-dist');
const CSS_SRC_DIR = path.join(__dirname, 'styles');
const CSS_BUNDLE = path.join(PROJECT_DIST, 'style.css');
const ASSETS_SRC_DIR = path.join(__dirname, 'assets');
const ASSETS_TARGET_DIR = path.join(PROJECT_DIST, 'assets');
const TEMPLATE = path.join(__dirname, 'template.html');
const PARTIALS_DIR = path.join(__dirname, 'components');
const HTML_FINAL = path.join(PROJECT_DIST, 'index.html');

createDistFolder(PROJECT_DIST)
  .then(() => bundleCSS(CSS_SRC_DIR, CSS_BUNDLE))
  .then(() => copyDir(ASSETS_SRC_DIR, ASSETS_TARGET_DIR))
  .then(() => buildHTML(TEMPLATE, PARTIALS_DIR, HTML_FINAL));
