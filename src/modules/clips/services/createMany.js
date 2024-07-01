const CutlabsApi = require("../../../providers/cutlabs/Api");
const { CLIP_STATUS } = require("../../../utils/consts");
const logger = require("../../../utils/logger");
const clipRepository = require("../../clips/repository");
const videoRepository = require("../../videos/repository");

const cutlabsApi = new CutlabsApi();

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
  })))
  
  await Promise.all(clips.map(async ({ id, cutlabsId }) => {
    await clipRepository.updateStatus(id, CLIP_STATUS.DOWNLOADING);
    try {
      await cutlabsApi.downloadClip(cutlabsId, id);
      await clipRepository.updateStatus(id, CLIP_STATUS.DOWNLOADED)
    } catch (error) {
      logger.error("Error on download clip ", id, error)
      await clipRepository.updateStatus(id, 'failed');
    }
  }))
}

module.exports = createMany;