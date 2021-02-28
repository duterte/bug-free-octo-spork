const toolbarOption = [["bold", "italic", "underline", "strike"]];

const quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: {
      container: "#toolbar",
      option: toolbarOption,
    },
  },
});

const API = JSON.parse(sessionStorage.getItem("api"));
quill.setContents(API);

var myRuler = new ruler({
  container: document.getElementById("ruler"), // reference to DOM element to apply rulers on
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
