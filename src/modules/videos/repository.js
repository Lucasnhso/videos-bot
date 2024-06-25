const prismaClient = require("../../database/prismaClient");

async function create(data) {
  return prismaClient.video.create({
    data
  })
}

async function updateStatus(cutlabsId, newStatus) {
  return prismaClient.video.update({
    where: {
      cutlabsId
    },
    data: {
      status: newStatus
    }
  })
}

async function findByCutlabsId(cutlabsId) {
  return prismaClient.video.findUnique({ where: {cutlabsId }});
}

module.exports = {
  create,
  updateStatus,
  findByCutlabsId
};
