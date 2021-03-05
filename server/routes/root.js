const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    return res /* .setHeader('ACCEPT-CH', 'ch1,ch2,ch3') */
      .render('root');
  } catch (err) {
    return res.status(500).json();
  }
});

module.exports = {
  url: '/',
  route: router,
};
