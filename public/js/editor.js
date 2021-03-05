const toolbarOption = [['bold', 'italic', 'underline', 'strike']];
const sizeStyle = Quill.import('attributors/style/size');
const fontFamily = Quill.import('attributors/style/font');
const { json, attributors } = JSON.parse(sessionStorage.getItem('api'));
const delta = json.contents;
Quill.register(sizeStyle, true);
Quill.register(fontFamily, true);
sizeStyle.whitelist = attributors.sizes;
fontFamily.whitelist = attributors.fonts;

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: '#toolbar',
    },
  },
});

function setContents(delta) {
  const contents = quill.setContents(delta);
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

setContents(delta);

// var myRuler = new ruler({
// container: document.getElementById('ruler'),
// reference to DOM element to apply rulers on
// rulerHeight: 15, // thickness of ruler
// fontFamily: "arial", // font for points
// fontSize: "7px",
// strokeStyle: "black",
// lineWidth: 1,
// enableMouseTracking: true,
// enableToolTip: true,
// });
// myRuler.api.setScale(1);
// myRuler.api.setPos({ x: 0, y: 0 });
// myRuler.api.setGuides([{ dimension: 2, poxX: 0, posY: 2 }]);
// console.log(myRuler.api.getGuides());
