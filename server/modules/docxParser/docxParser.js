const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const AdmZip = require('adm-zip');
const section = require('./section');
const table = require('./table');
const { paragraph } = require('./paragraph');

// =======================================================
// This piece of code below convert word content into json
// =======================================================

function docxContentToJson(xml) {
  const $1 = cheerio.load(xml, { xmlMode: true, xml: true });
  const xmlChildren = $1('w\\:body').children();
  const document = { attributes: {}, blocks: [] };
  for (const xmlChild of xmlChildren) {
    const { name, children } = xmlChild;
    if (name === 'w:sectPr') {
      document.attributes = section(children);
    } else if (name === 'w:p') {
      document.blocks.push({ type: 'paragraph', ...paragraph(children) });
    } else if (name === 'w:tbl') {
      document.blocks.push({ type: 'table', ...table(children) });
    }
  }
  return document;
}

// zipReader(filePath : String || Buffer ) => buffer

function zipReader(filePath) {
  const zip = new AdmZip(filePath);
  const reduce = filePath.split(/\\|\//).reduceRight((i) => i);
  const docXML = zip.getEntry('word/document.xml');
  zip.extractEntryTo(docXML, path.resolve('xml'), false, true);
  return docXML.getData();
}
//
// docxParser(filePath : String ) => Promise<void>

async function docxParser(filePath) {
  try {
    const basename = path.basename(filePath);
    if (!/.docx$/i.test(basename) || /^~/i.test(basename)) {
      const error = new Error(
        `invalid file "${filePath}" file must be a docx file`
      );
      throw error;
    }

    const buffer = zipReader(filePath);
    const xml = buffer.toString('utf-8');
    return await docxContentToJson(xml);
  } catch (err) {
    console.log(err);
  }
  return {};
}

module.exports = docxParser;
