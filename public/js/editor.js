const sizeStyle = Quill.import('attributors/style/size');
const fontFamily = Quill.import('attributors/style/font');
const Parchment = Quill.import('parchment');
const Block = Quill.import('blots/block');
const Embed = Quill.import('blots/embed');
const Container = Quill.import('blots/container');
const Module = Quill.import('core/module');

class TableData extends Block {
  static blotName = 'td';
  static tagName = 'td';
  static className = 'ql-td';
  static create(object) {
    const { text, attributes } = object;
    let node = super.create();
    for (const key in attributes) {
      node.style[key] = attributes[key];
    }
    node.innerText = text;
    return node;
  }
}

class TableRow extends Block {
  static blotName = 'tr';
  static tagName = 'tr';
  static className = 'ql-tr';
  static create(row) {
    const { properties, cells } = row;
    let node = super.create();
    for (const key in properties) {
      node.style[key] = properties[key];
    }
    for (const cell of cells) {
      node.append(TableData.create(cell));
    }
    return node;
  }
}

class Table extends Parchment.Embed {
  static blotName = 'table';
  static tagName = 'table';
  static className = 'ql-table';
  static create(rows = []) {
    let node = super.create();
    node.setAttribute('contenteditable', false);
    for (const row of rows) {
      node.append(TableRow.create(row));
    }
    return node;
  }
  static allowedChildren = [TableRow];

  static value(domNode) {
    const tr = domNode.querySelectorAll('tr');
    const table = [];
    for (const node of tr) {
      const trStyle = node.getAttribute('style');
      let properties = {};
      let cells = [];
      if (trStyle) {
        const style = trStyle.split(';').filter((i) => i);
        for (const item of style) {
          const entry = item.split(':');
          properties[entry[0]] = entry[1].trim();
        }
      }
      const td = node.querySelectorAll('td');
      for (const node2 of td) {
        const tdStyle = node2.getAttribute('style');
        let attributes = {};
        let text = node2.innerText;
        if (tdStyle) {
          const style = tdStyle.split(';').filter((i) => i);
          for (const item of style) {
            const entry = item.split(':');
            const hypen = entry[0].split('-');
            if (hypen.length === 2) {
              hypen[1] =
                hypen[1].charAt(0).toUpperCase() + hypen[1].substring(1);
            }
            entry[0] = hypen.join('').trim();
            attributes[entry[0]] = entry[1].trim();
          }
        }
        // console.log(attributes);
        cells.push({ attributes, text });
      }
      table.push({ properties, cells });
    }
    const delta = table;
    return delta;
  }
}

Quill.register(sizeStyle, true);
Quill.register(fontFamily, true);
Quill.register('formats/table', Table);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: false,
  },
});

function setContents(delta) {
  const contents = quill.setContents(delta);
  // console.log(contents.ops);
  sessionStorage.setItem('contents', JSON.stringify(contents.ops));
}

function throwError(message, typeError = undefined) {
  const error = new Error(message);
  error.name = typeError || undefined;
  throw error;
}

const regex = {
  pattern: /{{\s?[a-zA-Z0-9_]*\s?}}/gim,
  variable: /{{\s?([a-zA-Z0-9_]*)\s?}}/i,
};

function findTemplateVariable(sessionStorageKey) {
  const delta = JSON.parse(sessionStorage.getItem(sessionStorageKey));
  const tempVariable = [];

  if (typeof sessionStorageKey !== 'string') {
    throwError('argument must be a type of string', 'RangeError');
  }
  if (!delta) {
    const msg = `failed to get sessionStorage Item with "${sessionStorageKey}" key`;
    throwError(msg);
  }
  for (let i = 0; i < delta.length; i++) {
    const insert = delta[i].insert;
    const templateVariable = regex.pattern.test(insert);
    if (templateVariable) {
      const multiLineMatch = insert.match(regex.pattern);
      for (const result of multiLineMatch) {
        const singleMatch = result.match(regex.variable);
        const variable = singleMatch[1];
        let isExist = tempVariable.find((item) => item.pattern === result);
        if (!isExist) {
          tempVariable.push({ index: i, pattern: result, variable, count: 1 });
        } else {
          isExist = { ...isExist, count: isExist.count++ };
        }
      }
    }
  }
  return tempVariable.sort((a, b) => a.index - b.index);
}

function replaceTemplateVariable(object) {
  const { variable, replaceValue, sessionStorageKey } = object;
  const tempVar = findTemplateVariable('contents');
  const targetVariable = tempVar.filter((item) => item.variable === variable);
  let delta = JSON.parse(sessionStorage.getItem(sessionStorageKey));

  for (const item of targetVariable) {
    const variableRegEx = new RegExp(`{{\\s?${item.variable}\\s?}}`, 'gim');
    delta[item.index].insert = delta[item.index].insert.replace(
      variableRegEx,
      replaceValue
    );
  }
  const contents = quill.setContents(delta);
  sessionStorage.setItem('contents', JSON.stringify(contents.ops));
}

function createTable() {
  const answers = JSON.parse(sessionStorage.getItem('answers'));
  const group = answers.filter((i) => i.groupName === 'trademarks');
  const rows = [];
  for (const member of group) {
    const answer = member.answer;
    for (let i = 0; i < answer.length; i++) {
      if (i === 0) {
        const keys = Object.keys(answer[i]);
        const cells = [];
        for (const key of keys) {
          cells.push({
            text: key,
            attributes: { textAlign: 'center', bold: true },
          });
        }
        rows.push({ properties: { height: '22pt' }, cells });
      }
      const values = Object.values(answer[i]);
      const cells = [];
      for (const value of values) {
        cells.push({ text: value, attributes: {} });
      }
      rows.push({ properties: {}, cells });
    }
  }
  // console.log(rows);
  return rows;
}

const { delta: json, attributors } = JSON.parse(sessionStorage.getItem('api'));
sizeStyle.whitelist = attributors.sizes;
fontFamily.whitelist = attributors.fonts;
const delta = json;
setContents(delta);
createTable();

// console.log(delta[36]);
