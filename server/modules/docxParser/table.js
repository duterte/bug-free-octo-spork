const { to20thPtUnit } = require('./modules');
const { getParagraphProperties, getParagraphRun } = require('./paragraph');

function getTableProperties(nodes) {
  const properties = {};
  for (const property of nodes) {
    const { name, attribs } = property;
    if (name === 'w:tblStyle') {
      properties.tableStyle = attribs['w:val'];
    } else if (name === 'w:tblW') {
      properties.tableWith = {
        width: attribs['w:w'],
        type: attribs['w:type'],
      };
    } else if (name === 'w:tblLook') {
      // No added support for table look for now
    }
  }
}

function getTableColumn(nodes) {
  const coloumns = [];
  for (const property of nodes) {
    const { name, attribs } = property;
    if (name === 'w:gridCol') {
      const twentiethOfPt = attribs['w:w'] / 20;
      coloumns.push(`${twentiethOfPt}pt`);
    }
  }
}

function getTableCellProperties(nodes) {
  const properties = {};
  for (const property of nodes) {
    const { name, attribs } = property;
    if (name === 'w:tcW') {
      properties.width = to20thPtUnit(attribs['w:w']);
    } else if (name === 'w:shd') {
      properties.backgroundColor = '#' + attribs['w:fill'];
    } else if (name === 'w:vAlign') {
      properties.verticalAlignment = attribs['w:val'];
    }
  }
  return properties;
}

function getTableData(nodes) {
  const data = { properties: {}, content: [] };
  for (const property of nodes) {
    const { name, children } = property;
    if (name === 'w:r') {
      // ***
      data.content.push(getParagraphRun(children));
    } else if (name === 'w:pPr') {
      // ***
      data.properties = getParagraphProperties(children);
    }
  }
  return data;
}

function getTableCell(nodes) {
  const cell = {};
  for (const property of nodes) {
    const { name, children } = property;
    if (name === 'w:tcPr') {
      cell.properties = getTableCellProperties(children);
    } else if (name === 'w:p') {
      cell.data = getTableData(children);
    }
  }
  return cell;
}

function getRowProperty(nodes) {
  const properties = {};

  for (const property of nodes) {
    const { name, attribs } = property;
    if (name === 'w:trHeight') {
      properties.height = to20thPtUnit(attribs['w:val']);
    }
  }

  return properties;
}

function getTableRow(nodes) {
  const row = [];
  let properties = {};
  for (const property of nodes) {
    const { name, children } = property;
    if (name === 'w:tc') {
      row.push(getTableCell(children));
    } else if (name === 'w:trPr') {
      properties = getRowProperty(children);
    }
  }
  return { properties, row };
}

function parseTable(nodes) {
  const table = { rows: [] };
  for (const property of nodes) {
    const { name, children } = property;
    if (name === 'w:tblPr') {
      table.properties = getTableProperties(children);
    } else if (name === 'w:tblGrid') {
      table.column = getTableColumn(children);
    } else if (name === 'w:tr') {
      table.rows.push(getTableRow(children));
    }
  }
  return table;
}

module.exports = parseTable;
