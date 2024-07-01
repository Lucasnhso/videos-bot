const clc = require('cli-color');

module.exports = {
  info: (message) => {
    console.log(clc.white(message));
  },
  success: (message) => {
    console.log(clc.green(message));
  },
  error: (message) => {
    console.log(clc.red(message));
  }
};