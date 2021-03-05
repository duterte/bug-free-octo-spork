const path = require('path');
const fs = require('fs-extra');
// const watch = require('node-watch');
const chalk = require('chalk');
const docxParser = require('./docxParser');

const dest = 'apis';
const entry = 'docx';

fs.watch(path.resolve(entry), { persistent: true }, (event, fileName) => {
  if (/.docx$/i.test(fileName) && !/^\~/i.test(fileName)) {
    (async function () {
      try {
        fs.mkdirSync(path.resolve(dest), { recursive: true });
        const filePath = path.resolve(entry, fileName);
        const pathExists = await fs.pathExists(filePath);
        if (!pathExists) return;
        const API = await docxParser(filePath);
        const name = fileName.match(/(.*)\.(.*)$/i)[1] + '.json';
        console.log({ dest, name, fileName });
        const destPath = path.resolve(dest, name);
        const json = fs.createWriteStream(destPath, { mode: 0o777 });
        json.write(JSON.stringify(API, null, 2));
        json.end();
      } catch (err) {
        console.log('ERROR');
        console.log(err);
      }
    })();
  } else if (/.txt$/.test(fileName)) {
    console.log('File "' + fileName + '" was changed: ' + event);
  }
});

console.log(
  chalk.yellow(
    `Watching "${path.resolve(process.cwd(), entry)}" for any file change`
  )
);
