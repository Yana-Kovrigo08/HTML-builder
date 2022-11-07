//Импорт всех требуемых модулей
const path = require("path");
const fs = require("fs/promises");
const dir = path.join(__dirname, "files");
const dircopy = path.join(__dirname, "files-copy");


fs.rm(dircopy, {
  recursive: true,
  force: true,
}).finally(function () {
  fs.mkdir(dircopy, {
    recursive: true,
  });
  fs.readdir(dir, {
    withFileTypes: true,
  }).then(function (data) {
    data.forEach(function (item) {
      if (item.isFile()) {
        const Item = path.join(dir, item.name);
        const ItemDes = path.join(dircopy, item.name);
        fs.copyFile(Item, ItemDes);
      }
    });
  });
});
