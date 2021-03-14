const { to20thPtUnit } = require('./modules');

function getDocumentAttributes(object = {}) {
  const { name, attribs } = object;
  let attr = {};
  if (name === 'w:pgSz') {
    attr['pageWidth'] = to20thPtUnit(attribs['w:w']);
    attr['pageHeight'] = to20thPtUnit(attribs['w:h']);
  } else if (name === 'w:pgMar') {
    const {
      'w:top': marginTop,
      'w:right': marginRight,
      'w:bottom': marginBottom,
      'w:left': marginLeft,
      'w:header': marginHeader,
      'w:footer': marginFooter,
      'w:gutter': marginGutter,
    } = attribs;
    attr['marginTop'] = to20thPtUnit(marginTop);
    attr['marginRight'] = to20thPtUnit(marginRight);
    attr['marginBottom'] = to20thPtUnit(marginBottom);
    attr['marginLeft'] = to20thPtUnit(marginLeft);
    attr['marginHeader'] = to20thPtUnit(marginHeader);
    attr['marginFooter'] = to20thPtUnit(marginFooter);
    attr['marginGutter'] = to20thPtUnit(marginGutter);
  } else if (name === 'w:cols') {
    const { 'w:space': space } = attribs;
    attr['space'] = to20thPtUnit(space);
  } else if (name === 'w:docGrid') {
    const { 'w:linePitch': linePitch } = attribs;
    attr['linePitch'] = to20thPtUnit(linePitch);
  }
  return attr;
}

function getSectionProperty(nodes) {
  let attr = {};
  for (const property of nodes) {
    const { name, attribs } = property;
    attr = { ...attr, ...getDocumentAttributes({ name, attribs }) };
  }
  return attr;
}

module.exports = getSectionProperty;
