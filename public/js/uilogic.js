(function () {
  const answers = {};
  const UI_HANDLER = {};
  let renderLevel = [];

  const API = [
    {
      components: [
        {
          type: "question",
          text: `Are you assigning (a) a trademark application, OR: (b) registered trademark?`,
        },
        { type: "answer", category: "select", text: `trademark application` },
        { type: "answer", category: "select", text: `registered trademark` },
      ],
      answer: "single",
      id: "trademark",
    },
    {
      components: [
        { type: "question", text: `Serial Number` },
        { type: "answer", category: "input" },
        { type: "question", text: `Application Date` },
        { type: "answer", category: "date" },
        {
          type: "answer",
          category: "toggle",
          text: `I want to assign more than one trademark within this agreement`,
          afterToggle: {
            render: {
              components: [
                {
                  type: "answer",
                  category: "input",
                  insert: "afterend",
                },
                {
                  type: "question",
                  text: "Number of trademarks",
                  insert: "afterend",
                },
              ],
            },
          },
        },
      ],
      answer: "multiple",
      id: "application",
    },
    {
      components: [
        { type: "question", text: `Registration Number` },
        { type: "answer", category: "input" },
        { type: "question", text: `Registration Date` },
        { type: "answer", category: "date" },
        {
          type: "answer",
          category: "toggle",
          text: `I want to assign more than one trademark within this agreement`,
          afterToggle: {
            render: {
              components: [
                {
                  type: "answer",
                  category: "input",
                  insert: "afterend",
                },
                {
                  type: "question",
                  text: "Number of trademarks",
                  insert: "afterend",
                },
              ],
            },
          },
        },
      ],
      answer: "multiple",
      id: "registration",
    },
    {
      components: [
        { type: "question", text: "List of Trademarks" },
        {
          type: "answer",
          category: "table",
          th: [
            "Application/Registration No.",
            "Name",
            "Application/Registration Date",
          ],
          tr: 1,
        },
      ],
      answer: "multiple",
      id: "trademarks",
    },
    {
      components: [
        {
          type: "question",
          text: `What is the RELATIONSHIP between assignor and assignee:`,
        },
        {
          type: "answer",
          category: "select",
          text: `<b>“internal assignment”</b> – both assignor and assignee are under the same or similar control, and no extensive representations and warranties have to be provided for`,
        },
        {
          type: "answer",
          category: "select",
          text: `<b>“between friendly parties”</b> – this format is recommended if there is an established trust between assignor and assignee, and there is no need to spell out extensive obligations`,
        },
        {
          type: "answer",
          category: "select",
          text: `<b>“unknown party”</b> – check here if you are not sure how trustworthy your counterparty is, so all obligations are spelled out in the contract`,
        },
      ],
      answer: "single",
      id: "relationship",
    },
    {
      components: [
        {
          type: "question",
          text: `Is there a significant purchase price to be paid (Y/N)?`,
        },
        {
          type: "answer",
          category: "select",
          text: `Yes`,
        },
        {
          type: "answer",
          category: "select",
          text: `No`,
        },
      ],
      answer: "single",
      id: "purchasePrice",
    },
    {
      components: [
        {
          type: "question",
          text: `Does the contract need to take care of payment modalities (Y/N)?`,
        },
        {
          type: "answer",
          category: "select",
          text: `Yes`,
        },
        {
          type: "answer",
          category: "select",
          text: `No`,
        },
      ],
      answer: "single",
      id: "paymentModalities",
    },
    {
      components: [
        {
          type: "question",
          text: `When shall the purchase price be due?`,
        },
        {
          type: "answer",
          category: "select",
          text: `upon signing of the contract`,
        },
        {
          type: "answer",
          category: "select",
          text: `upon filing the assignment with the USPTO`,
        },
        {
          type: "answer",
          category: "select",
          text: `upon the USPTO registering the assignment`,
        },
      ],
      answer: "single",
      id: "priceDue",
    },
    {
      components: [
        {
          type: "question",
          text: `Who is responsible for filing the assignment with the USPTO`,
        },
        {
          type: "answer",
          category: "select",
          text: `Assignee`,
        },
        {
          type: "answer",
          category: "select",
          text: `Assignor`,
        },
      ],
      answer: "single",
      id: "responsible",
    },
  ];

  Component(API[0]).render();

  function updateJson(array) {
    for (const item of array) {
      const { question, answer } = item;
      answers[question] = answer;
    }
  }

  function conditionallyRenderTable(array) {
    const multiAgreement = array.find(
      (item) =>
        item.question ===
        "I want to assign more than one trademark within this agreement"
    );
    if (multiAgreement.answer === "yes") {
      const num = array.find((item) => item.question === "Number of trademarks")
        .answer;
      const object = API.find((item) => item.id === "trademarks");
      object.components.find((item) => item.category === "table").tr = Number(
        num
      );
      const nextQuestion = Component(object);
      nextQuestion.render();
    }
  }

  function retainedUI(caller) {
    const index = renderLevel.findIndex((item) => item === caller);
    const questionBoxes = document.querySelectorAll("#questions-holder > div");
    if (index === -1) {
      renderLevel.push(caller);
    } else {
      renderLevel = renderLevel.slice(0, index + 1);
    }
    questionBoxes.forEach((item) => {
      if (!renderLevel.find((item2) => item2 === item.id) && index !== -1) {
        item.remove();
      }
    });
  }

  function findBox(string) {
    return Component(API.find((item) => item.id === string));
  }

  UI_HANDLER.trademark = function (array) {
    const { answer } = array[0];
    const answers = [
      { text: "Trademark Application", render: "application" },
      { text: "Registered Trademark", render: "registration" },
    ];
    const render = answers.find((item) => item.text === answer).render;
    findBox(render).render();
    updateJson(array);
  };

  UI_HANDLER.application = function (array) {
    conditionallyRenderTable(array);
    findBox("relationship").render();
    updateJson(array);
  };

  UI_HANDLER.registration = function (array) {
    conditionallyRenderTable(array);
    findBox("relationship").render();
    updateJson(array);
  };

  UI_HANDLER.trademarks = function (array) {
    //
  };

  UI_HANDLER.relationship = function (array) {
    findBox("purchasePrice").render();
    updateJson(array);
  };

  UI_HANDLER.purchasePrice = function (array) {
    findBox("paymentModalities").render();
    updateJson(array);
  };

  UI_HANDLER.paymentModalities = function (array) {
    const { answer } = array[0];
    if (answer === "Yes") {
      findBox("priceDue").render();
    }
    updateJson(array);
  };

  UI_HANDLER.priceDue = function (array) {
    findBox("responsible").render();
    updateJson(array);
  };

  UI_HANDLER.responsible = function (array) {
    updateJson(array);
  };

  window.renderUI = function (array) {
    const { id, payload } = array;
    retainedUI(id);
    UI_HANDLER[id](payload);
  };
})();
