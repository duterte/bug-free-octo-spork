const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');
const AdmZip = require('adm-zip');

function getAttributes(obj) {
  //  getting text properties
  const font = obj['w:rFonts'] ? obj['w:rFonts'][0]['$']['w:ascii'] : undefined;

  const size = obj['w:sz'] ? obj['w:sz'][0]['$']['w:val'] / 2 : undefined;

  const color = obj['w:color'] ? obj['w:color'][0]['$']['w:val'] : undefined;

  const bold = obj['w:b'] ? true : false;
  const italic = obj['w:i'] ? true : false;
  const strike = obj['w:strike'] ? true : false;

  const underline = obj['w:u'] ? obj['w:u'][0]['$']['w:val'] : undefined;

  // underline possible values
  // 'single', 'double', 'thick', 'dotted', 'wave', 'dash'
  // 'dotDash', 'dotDotDash'

  // underline depends on docx XML schema and values

  const highlight = obj['w:highlight']
    ? obj['w:highlight'][0]['$']['w:val']
    : undefined;

  return {
    font,
    size: `${size}pt`,
    color: `#${color}`,
    bold,
    italic,
    strike,
    underline,
    background: highlight,
  };
}

// =======================================================
// This piece of code below convert word content into json
// =======================================================

// NOTE: This module only support RTL text direction

// (buffer : Buffer ) => {fontSize : string, fontFamily : string, insert : string}
// fontSize = size of the text in .pt
// fontFamily = font thats used on the insert
// insert = text content in word document

function docx2Json(buffer) {
  return new Promise((resolve, reject) => {
    parseString(buffer, (err, result) => {
      if (err) reject(err);
      const xmlBody = result['w:document']['w:body'];
      const paragraph = [];
      for (const item of xmlBody) {
        const object = item['w:p'];
        for (let i = 0; i < object.length; i++) {
          const p = object[i];
          const runs = p['w:r'];
          const property = p['w:pPr'];

          if (runs && runs.length) {
            for (let i = 0; i < runs.length; i++) {
              const attr = runs[i]['w:rPr'][0];
              const attrib = getAttributes(attr);
              const wt = runs[i]['w:t'];
              const tab = runs[i]['w:tab'];
              let insert;
              if (wt) {
                if (typeof wt[0] !== 'string') {
                  const { $, _ } = wt[0];
                  if (!_) {
                    insert = ' ';
                  } else {
                    insert = _;
                  }
                } else {
                  insert = wt[0];
                }
              }
              if (tab) insert = '\t';
              if (i === runs.length - 1) insert += '\n';
              paragraph.push({ insert, attributes: { ...attrib } });
            }
          } else {
            for (let i = 0; i < property.length; i++) {
              const attr = property[i]['w:rPr'][0];
              const attrib = getAttributes(attr);
              insert = ' \n';
              paragraph.push({ insert, attributes: { ...attrib } });
            }
          }
        }
      }
      resolve(paragraph);
    });
  });
}

// zipReader(filePath : String || Buffer ) => buffer

function zipReader(filePath) {
  const zip = new AdmZip(filePath);
  const docXML = zip.getEntry('word/document.xml');
  return docXML.getData();
}

// docxParser(filePath : String ) => Promise<void>

async function docxParser(filePath) {
  const json = [];
  try {
    const basename = path.basename(filePath);
    if (!/.docx$/i.test(basename) || /^~/i.test(basename)) {
      const error = new Error(
        `invalid file "${filePath}" file must be a docx file`
      );
      throw error;
    }

    const buffer = zipReader(filePath);
    json.push(...(await docx2Json(buffer)));
  } catch (err) {
    console.log(err);
  }
  return json;
}

module.exports = docxParser;
