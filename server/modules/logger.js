const chalk = require('chalk');

module.exports = function () {
  process.on('warning', (warning) => {
    console.log(chalk.yellow('PROCESS WARNING STACK START'));
    console.log(warning.stack);
    console.log(chalk.yellow('PROCESS WARNING STACK END'));
  });
  process.on('error', (err) => {
    console.log(chalk.red('PROCESS ERROR STACK START'));
    console.log(err);
    console.log(chalk.red('PROCESS ERROR STACK END'));
  });
  process.on('uncaughtException', (err) => {
    console.log(chalk.red('UNCAUGHTEXCEPTION'));
    console.log(err);
  });
};
