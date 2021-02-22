const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    return res.status(200).render("editor");
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = {
  url: "/editor",
  route: router,
};
