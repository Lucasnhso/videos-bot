const prismaClient = require("../../database/prismaClient");

async function createIfNotExists(data) {
  const video = await prismaClient.video.findUnique({
    where: {
      cutlabsId: data.cutlabsId
    }
  })

  return video ? video : prismaClient.video.create({ data })
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
  return prismaClient.video.findUnique({ where: { cutlabsId }});
}

module.exports = {
  createIfNotExists,
  updateStatus,
  findByCutlabsId
};
