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

quill.on('text-change', function (a, b, source) {
  if (source === 'user') {
    console.log(source);
    sessionStorage.setItem('contents', JSON.stringify(quill.getContents().ops));
  }
});

function setContents(delta) {
  const contents = quill.setContents(delta);
  sessionStorage.setItem('contents', JSON.stringify(contents.ops));
}

class DeltaProcessor {
  constructor(sessionStorageKey) {
    this.key = sessionStorageKey;
    this.delta = JSON.parse(sessionStorage.getItem(this.key));
    this.require = DeltaProcessor.requisite(this.delta, this.key);
    this.targets = [];
  }

  static requisite(key, delta) {
    if (!delta) {
      throw new Error(
        `failed to get sessinStorage item with sessionStorageKey of ${key}`
      );
    }
  }

  set _targets(array = []) {
    if (!array) {
      throw new Error('targets must be type array');
    } else if (!array.length) {
      throw new Error(`target not found`);
    }
    this.targets = array;
  }

  // Methods that's prepended with # "hashtag"
  // is uncoventional way of defining private methods
  // And thus the can't be used outide the scope of its class definition

  #find(regex) {
    const array = [];
    const delta = this.delta;
    for (let i = 0; i < delta.length; i++) {
      const insert = delta[i].insert || '';
      const match = insert.match(regex);
      if (match && match.length) {
        for (const item of match) {
          let exist = array.find((item) => item.index === i);
          if (!exist) {
            array.push({ index: i, pattern: item, count: 1 });
          } else {
            exist = { ...exist, count: exist.count++ };
          }
        }
      }
    }
    this._targets = array;
    return array;
  }

  variable(string = '') {
    const regex = new RegExp(`{{\\s\?${string}\\s\?}}`, 'gm');
    if (this.delta && this.delta.length) {
      this.#find(regex);
    }
    return this;
  }
  string(string = '') {
    const regex = new RegExp(string, 'gm');
    if (this.delta && this.delta.length) {
      this.#find(regex);
    }
    return this;
  }

  replace() {
    // There is supposed to be a method that replace one value at a time.
    // But this is not implemented yet
    // depends within requirements of this project
    // This (maybe or maybe not) implemented in the future.
  }

  replaceAll(value) {
    for (const item of this.targets) {
      const regex = new RegExp(item.pattern, 'gm');
      let target = this.delta[item.index].insert;
      this.delta[item.index].insert = target.replace(regex, value);
    }
    setContent();
  }
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
        cells.push({ text: value, attributes: { width: '155.8pt' } });
      }
      rows.push({ properties: {}, cells });
    }
  }
  return rows;
}

const { delta: json, attributors } = JSON.parse(sessionStorage.getItem('api'));
sizeStyle.whitelist = attributors.sizes;
fontFamily.whitelist = attributors.fonts;
const delta = json;
setContents(delta);
