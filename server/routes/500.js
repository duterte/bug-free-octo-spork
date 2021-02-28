const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.render("500");
});

module.exports = {
  url: "/500",
  route: router,
};
