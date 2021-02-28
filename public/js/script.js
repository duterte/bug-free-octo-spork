function removeQuestionHolder() {
  const element = document.getElementById("questions-holder");
  if (element) {
    element.remove();
  }
}

class Editor {
  constructor() {
    this.body = document.querySelector("body");
    this.head = document.querySelector("head");
    this.main = document.querySelector("main");
  }
  scripts() {
    const script = document.createElement("script");
    script.src = "/js/quill.js";
    script.addEventListener("load", () => {
      const script = document.createElement("script");
      script.src = "/js/editor.js";
      this.body.append(script);
    });
    this.body.append(script);
  }

  css() {
    const css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.href = "/css/quill.show.css";
    this.head.append(css);
  }

  toolbar() {
    const toolbar = document.createElement("div");
    toolbar.id = "toolbar";
    toolbar.innerText = "Editor Toolbar Section";
    return new Promise((resolve, reject) => {
      this.body.insertAdjacentElement("afterbegin", toolbar);
      resolve();
    });
  }

  // verticalMargin() {
  //   const outer = document.createElement("div");
  //   const paper = document.getElementById("paper");
  //   const computedStyleForMain = getComputedStyle(this.main);
  //   const paperBoundingBox = paper.getBoundingClientRect();

  //   outer.id = "vertical-margin";
  //   outer.style.position = "absolute";
  //   outer.style.width = "20px";
  //   outer.style.height = `${paperBoundingBox.height}px`;
  //   outer.style.top = computedStyleForMain["padding-top"];
  //   outer.style.backgroundColor = "white";
  //   outer.innerText = "Vertical Ruler Guide";
  //   outer.style.writingMode = "vertical-rl";
  //   outer.style.textOrientation = "upright";
  //   // outer.style.lineHeight = "2px";
  //   // outer
  //   this.main.insertAdjacentElement("afterbegin", outer);
  // }

  horizontalMargin() {
    const outer = document.createElement("div");
    const paper = document.getElementById("paper");
    const paperBoundingBox = paper.getBoundingClientRect();

    // const svg = document.createElement("svg");
    // svg.id = "horizontal-margin";
    // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    // svg.setAttribute("height", "20px");
    // svg.setAttribute("width", "816px");
    // svg.setAttribute("viewBox", "0 0 355.93019 215.9");
    // svg.height = "20px";
    // svg.style.width = "100%";
    // outer.append(svg);

    // outer.innerText = "Horizontal Ruler Guide";
    outer.id = "ruler";
    outer.style.position = "absolute";
    outer.style.minHeight = `${paperBoundingBox.height}px`;
    outer.style.top = "20px";
    outer.style.left = `${paperBoundingBox.left}px`;
    outer.style.width = `${paperBoundingBox.width}px`;
    outer.style.backgroundColor = "white";
    this.main.insertAdjacentElement("afterbegin", outer);
  }

  editor() {
    const paper = document.createElement("div");
    const editor = document.createElement("div");
    this.main.className = "text-editor";
    paper.className = "paper";
    paper.id = "paper";
    editor.id = "editor";
    paper.append(editor);
    this.main.append(paper);
  }
  render() {
    removeQuestionHolder();
    this.toolbar()
      .then(() => this.editor())
      .then(() => this.horizontalMargin())
      .then(() => this.css())
      .then(() => this.scripts())
      .catch((err) => console.log(err));
  }
}

// function renderEditor() {
//   const body = document.querySelector("body");
//   const head = document.querySelector("head");
//   const main = document.querySelector("main");
//   const wrapper = document.createElement("div");
//   const editor = document.createElement("div");
//   const script = document.createElement("script");
//   const css = document.createElement("link");

//   main.className = "text-editor";
//   wrapper.className = "paper";
//   editor.id = "editor";
//   css.setAttribute("rel", "stylesheet");
//   css.href = "/css/quill.show.css";
//   script.src = "/js/quill.js";
//   script.id = "quill";

//   wrapper.append(editor);
//   main.append(wrapper);
//   head.append(css);
//   new Promise((resolve, reject) => {
//     body.append(script);
//     let quill = document.querySelector("#quill");
//     while (!quill) {
//       quill = document.querySelector("#quill");
//     }
//     setTimeout(() => resolve(), 1000);
//   })
//     .then(() => {
//       const editorScript = document.createElement("script");
//       editorScript.src = "/js/editor.js";
//       body.append(editorScript);
//     })
//     .catch((err) => console.log(err));
// }

function networkRequest() {
  const networkIndicator = document.getElementById("network-indicator");
  const bar = document.getElementById("progress-indicator");
  networkIndicator.style.display = "block";
  bar.style.width = `1%`;
  // We use XHR since it is good on tracking networks progress unlike Fetch API
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api");
  xhr.addEventListener("progress", (e) => {
    const { lengthComputable, loaded, total } = e;
    const progress = lengthComputable ? (loaded / total) * 100 : 0;
    bar.style.width = `${progress}%`;
    if (progress === 100) {
      setTimeout(() => {
        networkIndicator.style.removeProperty("display");
      }, 1000);
    }
  });
  xhr.addEventListener("load", (e) => {
    const { target: res } = e;
    if (res.readyState === 4 && res.status === 200) {
      const json = res.responseText;
      sessionStorage.setItem("api", json);
      removeQuestionHolder();
      const editor = new Editor();
      editor.render();
      scrollTo({ top: 0 });
      // quill.setContents(json);
    }
  });
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send(sessionStorage.getItem("answers"));
}
