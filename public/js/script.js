function removeQuestionHolder() {
  const element = document.getElementById('questions-holder');
  if (element) {
    element.remove();
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
    const toolbar = document.createElement('div');
    toolbar.id = 'toolbar';
    toolbar.innerText = 'Editor Toolbar Section';
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
    paper.append(editor);
    this.main.append(paper);
  }
  render() {
    removeQuestionHolder();
    this.toolbar()
      .then(() => this.editor())
      .then(() => this.css())
      .then(() => this.scripts())
      .catch((err) => console.log(err));
  }
}

function networkRequest() {
  const networkIndicator = document.getElementById('network-indicator');
  const bar = document.getElementById('progress-indicator');
  networkIndicator.style.display = 'block';
  bar.style.width = `1%`;
  // We use XHR since it is good on tracking networks progress unlike Fetch API
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
      const editor = new Editor();
      editor.render();
      scrollTo({ top: 0 });
    } else if (res.status === 500) {
      location.href = '/500';
    }
  });
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(sessionStorage.getItem('answers'));
}
