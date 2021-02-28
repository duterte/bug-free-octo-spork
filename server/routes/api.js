const express = require("express");
const router = express.Router();

// API is hard coded for now
// For testing purposes only

const APIS = {
  0: [
    {
      insert: "TRADEMARK ASSIGNMENT\n\n",
      attributes: { header: 1 },
    },
    {
      insert:
        "This Trademark Assignment Agreement (“Assignment”), made effective as of the date set forth at the end of this document, is agreed to by the following parties:\n\n",
    },
    {
      insert: "[insert assignor]\n\n",
      attributes: {
        bold: true,
      },
    },
    {
      insert: "[insert assignee]\n\n",
      attributes: {
        bold: true,
      },
    },
    {
      insert: "RECITALS\n\n",
      attributes: { header: 3 },
    },
  ],
  1: {
    registration: [
      {
        insert:
          "WHEREAS, Assignor is owner of a trademark (the “Mark”) registered with the United States Patent and Trademark Office (“USPTO”) with details as follows:\n\n",
      },
      {
        insert:
          "Registration Number: [RGN]\t\t\tRegistration Date: [RGD]\n\n\n",
        attributes: { bold: true },
      },
    ],
    application: [
      {
        insert:
          "WHEREAS, Assignor is owner of a trademark application (the “Application”) registered with the United States Patent and Trademark Office (“USPTO”) with details as follows:\n\n",
      },
      {
        insert: "Serial Number: [RGN]\t\t\tApplication Date: [RGD]\n\n\n",
        attributes: { bold: true },
      },
    ],
  },
  2: {
    registration: [
      {
        insert:
          "WHEREAS, Assignor is owner of the following trademarks (the “Marks”) registered with the United States Patent and Trademark Office (“USPTO”) with details as follows:\n\n\n",
      },
      {
        insert: "(insert table with the marks)\n\n\n",
        attributes: { bold: true },
      },
    ],
    application: [
      {
        insert:
          "WHEREAS, Assignor is owner of the following trademarks (the “Applications”) registered with the United States Patent and Trademark Office (“USPTO”) with details as follows:\n\n\n",
      },
      {
        insert: "(insert table with the applications)\n\n\n",
        attributes: { bold: true },
      },
    ],
  },
  3: [
    {
      insert:
        "NOW, therefore, in consideration of the promises and covenants contained herein, as well as other good and valuable consideration (the receipt and sufficiency of which is hereby acknowledge), Assignee and Assignor hereby agree as follows:\n\n\n",
    },
    { insert: "Article 1: Assignment\n\n", attributes: { header: 3 } },
    {
      insert:
        "Assignor hereby sells, assigns, transfers, and conveys to Assignee the whole and complete right, title, interest in and to the Mark that has been or may be granted in the territory of the United States, together with the goodwill of the business symbolized by the Mark. This Assignment includes any goodwill of any business relating to products or services on which the Mark has been used and for which it is registered. The Assignment also includes any and all royalties, income, or other such fees (which may include damages or fees for infringement) due or payable to Assignor related to the Mark.\n\n",
    },
    {
      insert:
        "Under the terms of this Agreement, Assignee is specifically authorized to bring any actions for infringement of the Mark, even if the infringement started or took place before the effective date of this Assignment.\n\n",
    },
    {
      insert:
        "Assignor agrees to completely cease use of the Mark or any trade name or brand name that is confusingly similar to the Mark, and Assignor agrees not to challenge Assignee’s right in the Mark going forward.\n\n",
    },
  ],
};

function pushContentConditionally(json) {
  //
  const API = [];
  //
  //
  //
  // console.log(json);
  API.push(...APIS[0]);

  if (json[0].answer === "Trademark Application") {
    const answer = json.find((item) => {
      const { question } = item;
      return (
        question ===
        "I want to assign more than one trademark within this agreement"
      );
    }).answer;
    const moreThan1 = answer === "Yes" ? true : false;

    if (moreThan1) {
      API.push(...APIS[2].application);
      API.push(...APIS[3]);
    } else if (!moreThan1) {
      API.push(...APIS[1].application);
    } else {
      throw new Error(
        "Invalid Answer on: I want to assign more than one trademark within this agreement"
      );
      //
    }
  } else if (json[0].answer === "Registered Trademark") {
    throw new Error("Registered Trademark not yet implemented");
  } else {
    throw new Error(
      "Invalid Answer on: Are you assigning (a) a trademark application, OR: (b) registered trademark?"
    );
  }

  return API;
}

router.post("/", (req, res) => {
  try {
    const API = pushContentConditionally(req.body);
    console.log(API);
    return res.status(200).json(API);
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = {
  url: "/api",
  route: router,
};
