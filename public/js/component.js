function Component(object) {
  class TypeQuestion {
    constructor(item) {
      this.text = item.text;
    }
    render() {
      const element = document.createElement("div");
      element.className = "question";
      element.innerText = this.text;
      return element;
    }
  }

  class CategorySelect {
    constructor(item) {
      this.text = item.text;
    }
    render() {
      const element = document.createElement("div");
      element.classList.add("answer");
      element.classList.add("select");
      element.innerHTML = this.text;

      element.addEventListener("click", (e) => {
        const element = e.target;
        const parentElement = element.parentElement;
        parentElement.querySelectorAll(".select").forEach((item) => {
          item.classList.remove("selected");
        });
        element.classList.add("selected");
      });
      return element;
    }
  }

  class CategoryInput {
    render() {
      const element = document.createElement("input");
      element.classList.add("answer");
      return element;
    }
  }

  class CategoryToggle {
    constructor(item) {
      this.props = { ...item };
    }

    checkbox() {
      const element = document.createElement("input");
      element.type = "checkbox";
      element.className = "answer";

      element.addEventListener("change", (e) => {
        if (e.target.checked && this.props.afterToggle) {
          for (const item of Object.keys(this.props.afterToggle)) {
            if (item === "render") {
              const entries = this.props.afterToggle[item].components;
              const element = e.target.parentElement;
              this.afterToggle()[item](element, entries);
            }
          }
        } else if (!e.target.checked && this.props.afterToggle) {
          for (const item of Object.keys(this.props.afterToggle)) {
            if (item === "render") {
              const element = e.target.parentElement;
              const parentElement = element.parentElement;
              parentElement
                .querySelectorAll(".adjacent")
                .forEach((item) => item.remove());
            }
          }
        }
      });
      return element;
    }

    label() {
      const element = document.createElement("span");
      element.innerText = this.props.text;
      element.className = "question";
      return element;
    }

    afterToggle() {
      return {
        render: (element, entries) => {
          for (const item of entries) {
            let { element: el } = componentSelector(item);
            let adjacent = el.render();
            adjacent.classList.add("adjacent");
            element.insertAdjacentElement(item.insert, adjacent);
          }
        },
      };
    }

    render() {
      const element = document.createElement("label");
      element.append(this.checkbox());
      element.append(this.label());
      return element;
    }
  }

  class CategoryDate {
    render() {
      const element = document.createElement("input");
      element.classList.add("answer");
      element.classList.add("input");
      flatpickr(element, {});
      return element;
    }
  }

  class CategoryTable {
    constructor(entry) {
      this.entry = entry;
    }

    generateTableRow(element) {
      let rows = Number(this.entry.tr);
      let columns = this.entry.th.length;
      for (let x = 0; x < rows; x++) {
        for (let i = 0; i < columns; i++) {
          const input = document.createElement("input");
          input.type = "text";
          input.className = `row-${x + 1} col-${i + 1} answer`;
          if (i === 2) flatpickr(input, {});
          element.append(input);
        }
      }
    }

    tableHead(element, ths) {
      for (let i = 0; i < ths.length; i++) {
        const th = document.createElement("div");
        th.innerText = ths[i];
        th.className = `th col-${i + 1}`;
        element.append(th);
      }
    }

    render() {
      const element = document.createElement("div");
      element.classList.add("table");
      this.tableHead(element, this.entry.th);
      this.generateTableRow(element);
      return element;
    }
  }

  class QuestionBox {
    constructor({ components = [], answer = "single", id }) {
      this.entries = components;
      this.answer = answer;
      this.id = id;
    }

    next() {
      const element = document.createElement("span");
      element.className = "next";
      element.innerText = "OK";
      element.addEventListener("click", (e) => {
        const parentElement = e.target.parentElement.parentElement;
        const answers = parentElement.getAttribute("data-answers");
        const payload = [];
        if (answers === "single") {
          // single
          const question = parentElement.querySelector(".question").innerText;
          const answer = parentElement.querySelector(".selected").innerText;
          payload.push({ question, answer });
        } else if (answers === "multiple") {
          // multiple
          const dataClass = parentElement.getAttribute("data-class").split(",");
          const questions = parentElement.querySelectorAll(".question");
          const answers = parentElement.querySelectorAll(".answer");
          for (let i = 0; i < questions.length; i++) {
            payload.push({
              question: questions[i].innerText,
              answer: (() => {
                let answer = "";
                const answerType = dataClass[i];
                if (answerType === "select") {
                  answer === answers[i].innerText;
                } else if (answerType === "input" || answerType === "date") {
                  answer = answers[i].value;
                } else if (answerType === "toggle") {
                  answer = answers[i].checked ? "yes" : "no";
                } else {
                  answer = answers[i].innerText || answers[i].value;
                }
                return answer;
              })(),
            });
          }
        }
        renderUI({ payload, id: parentElement.id });
      });
      return element;
    }

    buttons() {
      const element = document.createElement("div");
      element.className = "box-buttons";
      element.append(this.next());
      return element;
    }

    render() {
      const holder = document.querySelector("#questions-holder");
      const element = document.createElement("div");
      element.className = "question-box";
      element.id = this.id;
      element.setAttribute("data-answers", this.answer);

      for (const item of this.entries) {
        let { element: el, dataClass } = componentSelector(item);
        element.append(el.render());

        if (dataClass) {
          const dataClass2 = element.getAttribute("data-class");
          if (!dataClass2) {
            element.setAttribute("data-class", dataClass);
          } else {
            const split = dataClass2.split(",");
            split.push(dataClass);
            element.setAttribute("data-class", split.join(","));
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
    if (item.type === "question") {
      element = new TypeQuestion(item);
    } else if (item.type === "answer") {
      if (item.category === "select") {
        element = new CategorySelect(item);
      } else if (item.category === "input") {
        element = new CategoryInput();
      } else if (item.category === "toggle") {
        element = new CategoryToggle(item);
      } else if (item.category === "date") {
        element = new CategoryDate(item);
      } else if (item.category === "table") {
        element = new CategoryTable(item);
      }
      dataClass = item.category;
    }
    return { element, dataClass };
  }

  return new QuestionBox(object);
}
