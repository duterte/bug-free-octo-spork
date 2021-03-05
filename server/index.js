const express = require('express');
const chalk = require('chalk');
const modules = require('./modules');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();
const LAN = modules.network['Local Area Connection'];

app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(express.json());
modules.routes(express, app);
modules.logger();

app.listen(PORT, () => {
  console.log(chalk.yellow(`server is running`));
  console.log('Local Machine: ', chalk.green(`http://localhost:${PORT}/`));
  console.log('Local Area Network: ', chalk.green(`http://${LAN}:${PORT}/`));
  modules.docxParser;
});
