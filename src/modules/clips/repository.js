const prismaClient = require("../../database/prismaClient");

async function createMany(data) {
  await prismaClient.clip.createMany({
    data
  })
  return prismaClient.clip.findMany({
    where: {
      cutlabsId: {
        in: data.map(e => e.cutlabsId)
      }
    }
  })
}

async function updateStatus(id, newStatus) {
  return prismaClient.clip.update({
    where: {
      id
    },
    data: {
      state: newStatus
    }
  })
}

async function findMany({ status } = {}) {
  return prismaClient.clip.findMany({
    where: {
      ...status && ({ state: status})
    }
  })
}

module.exports = {
  createMany,
  updateStatus,
  findMany
};
