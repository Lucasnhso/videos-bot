const CutlabsApi = require("../../cutlabs/Api");
const clipRepository = require("../../clips/repository");
const videoRepository = require("../../videos/repository");

const cutlabsApi = new CutlabsApi();

async function createMany(videoCutlabsId, data) {
  const video = await videoRepository.findByCutlabsId(videoCutlabsId);
  if(!video) {
    throw new Error('Video not exists on db');
  }

  const clips = await clipRepository.createMany(data.map(e => ({
    videoId: video.id,
    cutlabsId: e.uuid,
    title: e.title,
    description: e.description,
    status: 'pending',
    viralityScore: e.viralityScore,
    sedDuration: e.lengthSec
  })))
  
  for await(const { id, cutlabsId } of clips) {
    await clipRepository.updateStatus(id, 'started');
    try {
      await cutlabsApi.downloadClip(cutlabsId, id);
      await clipRepository.updateStatus(id, 'downloaded')
    } catch (error) {
      await clipRepository.updateStatus(id, 'failed');
    }
  }
}

module.exports = createMany;