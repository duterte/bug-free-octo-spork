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
