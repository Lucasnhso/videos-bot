const Bull = require('bull');
const { REDIS_URL } = process.env;

function createQueue(name) {
  return new Bull(name, REDIS_URL)
}

module.exports = createQueue;
