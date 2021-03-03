const toolbarOption = [['bold', 'italic', 'underline', 'strike']];
const sizeStyle = Quill.import('attributors/style/size');
const fontFamily = Quill.import('attributors/style/font');
Quill.register(sizeStyle, true);
Quill.register(fontFamily, true);
const { delta, attributors } = JSON.parse(sessionStorage.getItem('api'));
sizeStyle.whitelist = attributors.sizes;
fontFamily.whitelist = attributors.fonts;

console.log(Quill.imports);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: {
      container: '#toolbar',
    },
  },
});

quill.setContents(delta);

var myRuler = new ruler({
  container: document.getElementById('ruler'), // reference to DOM element to apply rulers on
  // rulerHeight: 15, // thickness of ruler
  // fontFamily: "arial", // font for points
  // fontSize: "7px",
  // strokeStyle: "black",
  // lineWidth: 1,
  // enableMouseTracking: true,
  // enableToolTip: true,
});
myRuler.api.setScale(1);
myRuler.api.setPos({ x: 0, y: 0 });
// myRuler.api.setGuides([{ dimension: 2, poxX: 0, posY: 2 }]);
// console.log(myRuler.api.getGuides());
