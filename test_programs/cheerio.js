const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

fs.readFile(path.join(__dirname, 'word/document.xml'), (err, data) => {
  if (err) {
    console.log('ERROR:', err);
  } else {
    const $ = cheerio.load(data, { xmlMode: true, xml: true });
    console.log($.contains('w:body'));
  }
});
