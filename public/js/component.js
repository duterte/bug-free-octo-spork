function component() {
  // UI component
  class TypeQuestion {
    constructor(item) {
      this.text = item.text;
    }
    render() {
      const element = document.createElement('div');
      element.className = 'question';
      element.innerText = this.text;
      return element;
    }
  }

  // UI component
  class CategorySelect {
    constructor(item) {
      this.text = item.text;
    }
    render() {
      const element = document.createElement('div');
      element.classList.add('answer');
      element.classList.add('select');
      element.innerHTML = this.text;

      element.addEventListener('click', (e) => {
        const element = e.target;
        const parentElement = element.parentElement;
        parentElement.querySelectorAll('.select').forEach((item) => {
          item.classList.remove('selected');
        });
        element.classList.add('selected');
      });
      return element;
    }
  }

  // UI component
  class CategoryInput {
    render() {
      const element = document.createElement('input');
      element.classList.add('answer');
      return element;
    }
  }

  // UI component
  class CategoryToggle {
    constructor(item) {
      this.props = { ...item };
    }

    checkbox() {
      const element = document.createElement('input');
      element.type = 'checkbox';
      element.className = 'answer';

      element.addEventListener('change', (e) => {
        if (e.target.checked && this.props.afterToggle) {
          for (const item of Object.keys(this.props.afterToggle)) {
            if (item === 'render') {
              const entries = this.props.afterToggle[item].components;
              const element = e.target.parentElement;
              this.afterToggle()[item](element, entries);
            }
          }
        } else if (!e.target.checked && this.props.afterToggle) {
          for (const item of Object.keys(this.props.afterToggle)) {
            if (item === 'render') {
              const element = e.target.parentElement;
              const parentElement = element.parentElement;
              parentElement
                .querySelectorAll('.adjacent')
                .forEach((item) => item.remove());
            }
          }
        }
      });
      return element;
    }

    label() {
      const element = document.createElement('span');
      element.innerText = this.props.text;
      element.className = 'question';
      return element;
    }

    afterToggle() {
      return {
        render: (element, entries) => {
          for (const item of entries) {
            let { element: el } = componentSelector(item);
            let adjacent = el.render();
            adjacent.classList.add('adjacent');
            element.insertAdjacentElement(item.insert, adjacent);
          }
        },
      };
    }

    render() {
      const element = document.createElement('label');
      element.append(this.checkbox());
      element.append(this.label());
      return element;
    }
  }

  // Controls the view and the behavior of the date picker
  function datePicker(element) {
    flatpickr(element, {});
  }

  // UI component
  class CategoryDate {
    render() {
      const element = document.createElement('input');
      element.classList.add('answer');
      element.classList.add('input');
      datePicker(element);
      return element;
    }
  }

  // UI component
  class CategoryTable {
    constructor(entry) {
      this.entry = entry;
    }

    generateTableRow(element) {
      let rows = Number(this.entry.tr);
      let columns = this.entry.th.length;
      for (let x = 0; x < rows; x++) {
        for (let i = 0; i < columns; i++) {
          const input = document.createElement('input');
          input.type = 'text';
          input.className = `row-${x + 1} col-${i + 1} answer`;
          if (i === 2) datePicker(input);
          element.append(input);
        }
      }
    }

    tableHead(element, ths) {
      for (let i = 0; i < ths.length; i++) {
        const th = document.createElement('div');
        th.innerText = ths[i];
        th.className = `th col-${i + 1}`;
        element.append(th);
      }
    }

    render() {
      const element = document.createElement('div');
      element.classList.add('table');
      this.tableHead(element, this.entry.th);
      this.generateTableRow(element);
      return element;
    }
  }

  function multiple(object) {
    const { parentElement } = object;
    const dataClass = parentElement.getAttribute('data-class').split(',');
    const questions = parentElement.querySelectorAll('.question');
    const answers = parentElement.querySelectorAll('.answer');

    const payload = [];

    for (let i = 0; i < questions.length; i++) {
      const testA = (() => {
        let answer = '';
        const answerType = dataClass[i];
        if (answerType === 'table') {
          answer = [];
          const thead = parentElement.querySelectorAll('.th');
          for (let i = 0; i < answers.length; i++) {
            const row = Number(answers[i].classList[0].split('-')[1]) - 1;
            const col = Number(answers[i].classList[1].split('-')[1]) - 1;
            answer[row] = {
              ...answer[row],
              [thead[col].innerText]: answers[i].value,
            };
          }
        } else if (answerType === 'select') {
          answer === answers[i].innerText;
        } else if (answerType === 'input' || answerType === 'date') {
          answer = answers[i].value;
        } else if (answerType === 'toggle') {
          answer = answers[i].checked ? 'Yes' : 'No';
        } else {
          answer = answers[i].innerText || answers[i].value;
        }
        // returns array or string;
        return answer;
      })();

      payload.push({
        question: questions[i].innerText,
        answer: testA,
      });
    }
    return payload;
  }

  function single(object) {
    const { parentElement } = object;
    const question = parentElement.querySelector('.question');
    const answer = parentElement.querySelector('.selected');
    const payload = [];
    if (question && answer) {
      payload.push({ question: question.innerText, answer: answer.innerText });
    }
    return payload;
  }

  const answers = [];

  function identifyNeededDocx() {
    let docx = 'trademark';
    const trademarks = answers.find((i) => i.question === 'List of trademarks');
    if (trademarks && trademarks.answer.length) {
      document = 'trademarks';
    }
    return docx;
  }

  function submit() {
    sessionStorage.setItem('answers', JSON.stringify(answers));
    const docx = identifyNeededDocx();
    networkRequest(docx);
  }

  class SubmitButton {
    submit() {
      const element = document.createElement('span');
      element.className = 'page-btn submit ripple-btn';
      element.innerText = 'Submit';
      element.id = 'submit';
      element.addEventListener('click', (e) => {
        rippleEffect(e);
        submit();
      });
      return element;
    }

    buttons() {
      const element = document.createElement('div');
      element.className = 'submit-buttons';
      element.append(this.submit());
      return element;
    }

    render() {
      const holder = document.querySelector('#questions-holder');
      const element = document.createElement('div');
      element.className = 'question-box';
      element.id = 'submit-box';
      element.append(this.buttons());
      holder.append(element);
    }
  }

  // UI component
  class QuestionBox {
    constructor({ components = [], answer = 'single', id }) {
      this.entries = components;
      this.answer = answer;
      this.id = id;
    }

    next() {
      const element = document.createElement('span');
      element.className = 'page-btn ok ripple-btn';
      element.innerText = 'OK';
      element.addEventListener('click', (e) => {
        rippleEffect(e);
        const parentElement = e.target.parentElement.parentElement;
        const answers = parentElement.getAttribute('data-answers');
        let payload = [];
        if (answers === 'single') {
          payload = single({ parentElement });
        } else if (answers === 'multiple') {
          payload = multiple({ parentElement });
        }

        const filterEmptyAnswer = payload.filter((item) => {
          const { answer } = item;
          const instanceOfArray = answer instanceof Array;
          if (!instanceOfArray) {
            return answer === '';
          } else {
            for (const item of answer) {
              const emptyValues = Object.values(item).filter(
                (item) => item === ''
              );
              if (emptyValues.length) {
                return true;
              }
            }
            return undefined;
          }
        });
        if (filterEmptyAnswer && filterEmptyAnswer.length) {
          payload = [];
        }

        if (payload.length) {
          const successSoundFx = document.getElementById('success-sound-fx');
          successSoundFx.play();
          renderUI({ payload, id: parentElement.id });
        } else {
          const errSoundFx = document.getElementById('error-sound-fx');
          errSoundFx.play();
          parentElement.classList.add('quake');
          setTimeout(() => parentElement.classList.remove('quake'), 200);
        }
      });
      return element;
    }

    buttons() {
      const element = document.createElement('div');
      element.className = 'box-buttons';
      element.append(this.next());
      return element;
    }

    render() {
      const holder = document.querySelector('#questions-holder');
      const element = document.createElement('div');
      element.className = 'question-box';
      element.id = this.id;
      element.setAttribute('data-answers', this.answer);

      for (const item of this.entries) {
        let { element: el, dataClass } = componentSelector(item);
        element.append(el.render());

        if (dataClass) {
          const dataClass2 = element.getAttribute('data-class');
          if (!dataClass2) {
            element.setAttribute('data-class', dataClass);
          } else {
            const split = dataClass2.split(',');
            split.push(dataClass);
            element.setAttribute('data-class', split.join(','));
          }
        }
      }

      element.append(this.buttons());
      holder.append(element);
    }
  }

  function componentSelector(item) {
    let element;
    let dataClass;
    if (item.type === 'question') {
      element = new TypeQuestion(item);
    } else if (item.type === 'answer') {
      if (item.category === 'select') {
        element = new CategorySelect(item);
      } else if (item.category === 'input') {
        element = new CategoryInput();
      } else if (item.category === 'toggle') {
        element = new CategoryToggle(item);
      } else if (item.category === 'date') {
        element = new CategoryDate(item);
      } else if (item.category === 'table') {
        element = new CategoryTable(item);
      }
      dataClass = item.category;
    }
    return { element, dataClass };
  }

  return {
    Question: QuestionBox,
    Submit: SubmitButton,
    answers: answers,
  };
}
