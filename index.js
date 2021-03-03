// This module is a process manager
// running this module will run two process
// One is for the server
// and the other is for the back-end process
// docxParser which automatically convert docx file into JSON file

const { spawn } = require('child_process');
const chalk = require('chalk');

const child1 = spawn('node', ['docxParser']);
const child2 = spawn('node', ['server']);

function stdout(chunk) {
  console.log(chalk.yellow(`${chunk}`));
}

function stderr(chunk) {
  console.log(`stderr: ${chunk}`);
}

function error(err) {
  console.log(err);
}

function exit(code, signal) {
  if (code) console.log(`Process exit with code ${code}`);
  if (signal) console.log(`Process exit with code ${signal}`);
}

console.log('Two process will be running');
child1.stdout.on('data', stdout);
child1.stderr.on('data', stderr);
child1.on('error', error);
child1.on('exit', exit);
child2.stdout.on('data', stdout);
child2.stderr.on('data', stderr);
child2.on('error', error);
child2.on('exit', exit);
