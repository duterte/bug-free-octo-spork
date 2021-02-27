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
