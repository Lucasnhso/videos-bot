const { CLIP_STATUS } = require("../../../utils/consts");
const clipRepository = require("../../clips/repository");
const videoRepository = require("../../videos/repository");
const clipQueue = require("../queues");


async function createMany(videoCutlabsId, data) {
  const video = await videoRepository.findByCutlabsId(videoCutlabsId);
  if(!video) {
    throw new Error('Video not exists on db');
  }

  const clips = await clipRepository.createManyIfNotExists(data.map(e => ({
    videoId: video.id,
    cutlabsId: e.uuid,
    title: e.title,
    description: e.description,
    status: CLIP_STATUS.PENDING,
    viralityScore: e.viralityScore,
    sedDuration: e.lengthSec
  })));

  clips.forEach(clip => {
    clipQueue.download.add(clip);
  });
}

module.exports = createMany;