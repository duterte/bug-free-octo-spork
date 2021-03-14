function getTextProperties(children) {
  let attributes = {};
  for (const child of children) {
    const { name, attribs } = child;
    if (name === 'w:rFonts') {
      // Font Family
      attributes['fontFamily'] = attribs['w:ascii'];
      attributes['font'] = attribs['w:ascii'];
    } else if (name === 'w:sz') {
      // Font Size
      attributes['fontSize'] = `${attribs['w:val'] / 2}pt`;
      attributes['size'] = `${attribs['w:val'] / 2}pt`;
    } else if (name === 'w:color') {
      // Font Color
      attributes['color'] = `#${attribs['w:val']}`;
    } else if (name === 'w:u') {
      // Underline
      attributes['underline'] = attribs['w:val'];
      attributes['textDecoration'] = 'underline';
    } else if (name === 'w:highlight') {
      // font highlight in docx is backgroundColor in html
      attributes['background'] = attribs['w:val'];
    } else if (name === 'w:b') {
      // Bold
      attributes['bold'] = true;
      attributes['fontWeight'] = 'bold';
    } else if (name === 'w:i') {
      // Italic
      attributes['italic'] = true;
      attributes['fontStyle'] = 'italic';
    } else if (name === 'w:strike') {
      // Strike
      attributes['strike'] = true;
      attributes['textDecoration'] = 'line-through';
    }
  }

  // sorting object alphabetically according to its keys
  const sort = Object.keys(attributes).sort();
  const object = {};
  for (const item of sort) {
    object[item] = attributes[item];
  }

  return object;
}

function getParagraphProperties(nodes) {
  let attr = {};
  for (const property of nodes) {
    const { name, children, attribs } = property;
    if (name === 'w:rPr') {
      attr = { ...attr, ...getTextProperties(children) };
    } else if (name === 'w:jc') {
      attr = { ...attr, textAlign: attribs['w:val'] };
    }
  }
  return attr;
}

function getParagraphRun(nodes) {
  let attr = {};
  let txt = '';
  for (const property of nodes) {
    const { name, children } = property;
    if (name === 'w:rPr') attr = getTextProperties(children);
    if (name === 'w:tab') txt += '\t';
    if (name === 'w:t') txt += children[0].data;
  }
  if (!attr.fontSize) {
    attr.fontSize = '11pt';
    attr.size = '11pt';
  }
  if (!attr.fontFamily) {
    attr.fontFamily = 'MS Reference Sans Serif';
    attr.fontFamily = 'MS Reference Sans Serif';
  }
  return { insert: txt, attributes: attr };
}

function paragraph(nodes) {
  const paragraph = { properties: {}, contents: [] };
  for (const property of nodes) {
    const { name, children } = property;
    if (!/w:bookmark/.test(name)) {
      if (name === 'w:r') {
        paragraph.contents.push(getParagraphRun(children));
      } else if (name === 'w:pPr') {
        paragraph.properties = getParagraphProperties(children);
      }
    }
  }
  paragraph.contents.push({ insert: '\n' });
  // **************************************************
  // This piece of codes marked with stars is in testing mode
  //
  // const contents = paragraph.contents;
  // if (contents.length > 1) {
  //   // Compare two objects
  //   for (let i = 0; i < contents.length; i++) {
  //     const content1 = contents[i];
  //     const content2 = contents[i + 1];
  //     if (content1 && content2 && content1.attributes && content2.attributes) {
  //       const attr1 = contents[i].attributes;
  //       const attr2 = contents[i + 1].attributes;
  //       const entries1 = Object.entries(attr1);
  //       const entries2 = Object.entries(attr2);
  //       for (const entry of entries1) {
  //         console.log(entry);
  //       }
  //     }
  //   }
  // }
  // ***********************************************
  return paragraph;
}

module.exports = {
  getParagraphRun,
  getParagraphProperties,
  paragraph,
};
