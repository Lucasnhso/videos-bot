const prismaClient = require("../../database/prismaClient");
const model = prismaClient.post;

async function create(data) {
  return await model.create({
    data
  })
}

module.exports = {
  create
};
