const prismaClient = require("../../database/prismaClient");

async function createManyIfNotExists(data) {
  const existent = await prismaClient.clip.findMany({
    where: {
      cutlabsId: {
        in: data.map(e => e.cutlabsId)
      }
    }
  });

  const toCreate = data.filter(d => !existent.find(e => e.cutlabsId === d.cutlabsId));
  const created = await prismaClient.clip.createManyAndReturn({
    data: toCreate
  });
  
  const notDownloadedItems = await prismaClient.clip.findMany({
    where: {
      cutlabsId: {
        in: ids
      },
      status: { not: 'downloaded'}
    }
  });

  return [...created, ...notDownloadedItems];
}

async function updateStatus(id, newStatus) {
  return prismaClient.clip.update({
    where: {
      id
    },
    data: {
      status: newStatus
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

async function findOneToPost(platform) {
  return prismaClient.clip.findFirst({
    where: {
      posts: {
        none: {
          platform
        }
      }
    },
    orderBy: [
      {
        viralityScore: 'desc'
      },
      {
        createdAt: 'asc'
      }
    ]
  });
}

module.exports = {
  createManyIfNotExists,
  updateStatus,
  findMany,
  findOneToPost
};
