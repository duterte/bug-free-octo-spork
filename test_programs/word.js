// const WordExtractor = require('word-extractor');
// const extractor = new WordExtractor();
// const extracted = extractor.extract('file.doc');
// extracted.then(function (doc) {
//   console.log(doc.getBody());
// });

const reader = require('any-text');
const path = require('path');

async function test() {
  const text = await reader.getText(path.join(__dirname, 'file.docx'));
  console.log(text);
}

test();
