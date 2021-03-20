const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

function parseAttributors(contents, attributors) {
  for (const content of contents) {
    const { attributes = {} } = content;
    if (attributes.fontFamily) {
      const font = attributors.fonts.find(
        (item) => item === attributes.fontFamily
      );
      // get font family
      if (!font) attributors.fonts.push(attributes.fontFamily);
    }
    // get font sizes
    if (attributes.fontSize) {
      const size = attributors.sizes.find(
        (item) => item === attributes.fontSize
      );
      if (!size) attributors.sizes.push(attributes.fontSize);
    }
  }
}

function parseCell(cells = []) {
  const array = [];
  for (const cell of cells) {
    const { properties, data } = cell;
    let attributes = properties;
    let text = ' ';
    attributes = { ...attributes, ...data.properties };
    if (data.content[0]) {
      text = data.content[0].insert;
      attributes = { ...attributes, ...data.content[0].attributes };
    }
    array.push({ text, attributes });
  }
  return array;
}

function parseRows(nodes) {
  const array = [];
  for (const property of nodes) {
    const { properties, row: cells } = property;
    const object = { properties, cells: parseCell(cells) };
    array.push(object);
  }
  return array;
}

function documents(array = []) {
  const delta = [];
  const attributors = {
    fonts: ['MS Reference Sans Serif'],
    sizes: ['12pt'],
  };

  for (const item of array) {
    const { type, rows, contents } = item;
    if (type === 'paragraph') {
      delta.push(...contents);
      parseAttributors(contents, attributors);
    } else if (type === 'table') {
      const table = parseRows(rows);
      delta.push({ insert: { table: table } });
      delta.push({ insert: '\n' });
    }
  }
  return { delta, attributors };
}

router.post('/', (req, res) => {
  try {
    const document = req.body.document;
    console.log(document);
    if (!document) {
      const error = new Error('document is empty');
      error.code = 400;
      throw error;
    }
    fs.readFile(
      path.resolve(`apis/${document}.json`),
      { encoding: 'utf-8' },
      (err, data) => {
        if (err) {
          throw err;
        } else {
          const json = JSON.parse(data);
          const docs = documents(json.blocks);
          docs.attributes = json.attributes;
          return res.status(200).json(docs);
        }
      }
    );
  } catch (err) {
    console.log(err);
    if (err.code && err.code === 400) {
      return res.status(400).render('500');
    }
    return res.status(500).render('500');
  }
});

module.exports = {
  url: '/api',
  route: router,
};
