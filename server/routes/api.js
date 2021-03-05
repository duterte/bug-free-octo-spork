const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    fs.readFile(
      path.resolve('apis/trademark_application.json'),
      { encoding: 'utf-8' },
      (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const json = JSON.parse(data);
          let attributors = { fonts: [], sizes: [] };
          for (const item of json.contents) {
            const { font, size } = item.attributes;
            if (font) {
              const fontExist = attributors.fonts.find((i) => i === font);
              if (!fontExist) attributors.fonts.push(font);
            }
            if (size) {
              const sizesExist = attributors.sizes.find((i) => i === size);
              if (!sizesExist) attributors.sizes.push(size);
            }
          }
          return res.status(200).json({ json, attributors });
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(200).render('500');
  }
});

module.exports = {
  url: '/api',
  route: router,
};
