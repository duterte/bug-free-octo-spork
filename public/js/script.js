function removeQuestionHolder() {
  const element = document.getElementById('questions-holder');
  if (element) {
    element.remove();
  }
}

class Select {
  render() {
    const element = document.createElement('select');
    element.id = this.id;
    element.className = 'font-select';
    for (const font of this.list) {
      const option = document.createElement('option');
      option.value = font;
      option.innerText = font;
      option.style.fontFamily = font;
      element.append(option);
    }
    return element;
  }
}

class FontFamily extends Select {
  constructor(fontFamily) {
    super();
    fontFamily = ['MS Reference Sans Serif', 'Arial Black'];
    this.list = fontFamily;
    this.id = 'fontFamily';
  }
}

class FontWeight extends Select {
  constructor(fontWeight) {
    super();
    fontWeight = [8, 9, 11, 12, 14, 16, 18, 20];
    this.list = fontWeight;
    this.id = 'fontWeight';
  }
}

class FontBold {
  render() {
    const element = document.createElement('span');
    element.innerText = 'B';
    element.style.fontWeight = 'bold';
    return element;
  }
}

class FontItalic {
  render() {
    const element = document.createElement('span');
    element.innerText = 'I';
    element.style.fontStyle = 'Italic';
    element.style.fontFamily = 'serif';
    element.style.fontWeight = 'bold';
    return element;
  }
}

class FontUnderline {
  render() {
    const element = document.createElement('span');
    element.innerText = 'U';
    element.style.textDecoration = 'underline';
    element.style.fontWeight = 'bold';
    return element;
  }
}

class ToolBar {
  fontSection() {
    const element = document.createElement('div');
    element.id = 'toolbar-font';
    const fontFamily = new FontFamily();
    const fontWeight = new FontWeight();
    const fontBold = new FontBold();
    const fontItalic = new FontItalic();
    const fontUnderline = new FontUnderline();
    element.append(fontFamily.render());
    element.append(fontWeight.render());
    element.append(fontBold.render());
    element.append(fontItalic.render());
    element.append(fontUnderline.render());
    return element;
  }

  render() {
    const element = document.createElement('div');
    element.id = 'toolbar-font';
    element.append(this.fontSection());
    return element;
  }
}

class Editor {
  constructor() {
    this.body = document.querySelector('body');
    this.head = document.querySelector('head');
    this.main = document.querySelector('main');
  }
  scripts() {
    new Promise((resolve, reject) => {
      const script1 = document.createElement('script');
      this.body.append(script1);
      script1.src = '/js/quill.js';
      script1.addEventListener('load', () => resolve());
    }).then(() => {
      const script3 = document.createElement('script');
      script3.src = '/js/editor.js';
      this.body.append(script3);
    });
  }

  css() {
    const css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.href = '/css/quill.show.css';
    this.head.append(css);
  }

  toolbar() {
    const toolbar = new ToolBar().render();
    toolbar.id = 'toolbar';
    return new Promise((resolve, reject) => {
      this.body.insertAdjacentElement('afterbegin', toolbar);
      resolve();
    });
  }

  editor() {
    const paper = document.createElement('div');
    const editor = document.createElement('div');
    const { attributes } = JSON.parse(sessionStorage.getItem('api'));
    this.main.className = 'text-editor';

    paper.className = 'paper';
    paper.id = 'paper';
    paper.style.width = attributes.pageWidth;
    paper.style.minHeight = attributes.pageHeight;
    editor.id = 'editor';
    editor.style.marginTop = attributes.marginTop;
    editor.style.marginRight = attributes.marginRight;
    editor.style.marginBottom = attributes.marginBottom;
    editor.style.marginLeft = attributes.marginLeft;
    const holder = document.createElement('div');
    holder.classList = 'editor-holder';
    paper.append(editor);
    holder.append(paper);
    this.main.append(holder);
  }
  render() {
    this.toolbar()
      .then(() => this.editor())
      .then(() => this.css())
      .then(() => this.scripts())
      .catch((err) => console.log(err));
  }
}

class SideBar {
  constructor() {
    this.main = document.querySelector('main');
  }
  border() {
    const element = document.createElement('div');
    element.id = 'sidebar';
    element.innerText = 'Right Pane Placeholder';
    return element;
  }

  render() {
    this.main.append(this.border());
  }
}

function networkRequest(docx = 'trademark') {
  const networkIndicator = document.getElementById('network-indicator');
  const bar = document.getElementById('progress-indicator');
  networkIndicator.style.display = 'block';
  bar.style.width = `1%`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api');
  xhr.addEventListener('progress', (e) => {
    const { lengthComputable, loaded, total } = e;
    const progress = lengthComputable ? (loaded / total) * 100 : 0;
    bar.style.width = `${progress}%`;
    if (progress === 100) {
      setTimeout(() => {
        networkIndicator.style.removeProperty('display');
      }, 1000);
    }
  });
  xhr.addEventListener('load', (e) => {
    const { target: res } = e;
    if (res.readyState === 4 && res.status === 200) {
      const json = res.responseText;
      sessionStorage.setItem('api', json);
      removeQuestionHolder();
      const sidebar = new SideBar();
      const editor = new Editor();
      editor.render();
      sidebar.render();
      scrollTo({ top: 0 });
    } else if (res.status === 500) {
      location.href = '/500';
    }
  });
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(JSON.stringify({ document: docx }));
}
