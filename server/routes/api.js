const express = require("express");
const router = express.Router();

// API is hard coded for now
// For testing purposes only

const API = [
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
  {
    insert:
      "WHEREAS, Assignor is owner of a trademark (the “Mark”) registered with the United States Patent and Trademark Office (“USPTO”) with details as follows:\n\n",
  },
  {
    insert: "Registration Number: [RGN]\t\t\tRegistration Date: [RGD]\n\n\n",
    attributes: { bold: true },
  },
];

router.get("/", (req, res) => {
  try {
    console.log("request received", req.baseUrl);
    return res.status(200).json(API);
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = {
  url: "/api",
  route: router,
};
