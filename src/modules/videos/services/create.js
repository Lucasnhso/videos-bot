const CutlabsScrapper = require("../../../providers/cutlabs/Scrapper");
const CutlabsApi = require('../../../providers/cutlabs/Api');
const videoRepository = require("../repository");
const videoObserver = require('./observer');
const clipServices = require('../../clips/services');
const { VIDEO_STATUS } = require("../../../utils/consts");
const logger = require("../../../utils/logger");

const cutlabsApi = new CutlabsApi();
const cutlabsScrapper = new CutlabsScrapper();

async function create({ url, cutlabsId }) {
  if(url) {
    cutlabsId = await cutlabsScrapper.execute('createClips', url);
  }

  const { project, processingState } = await cutlabsApi.getProject(cutlabsId);

  const createdVideo = await videoRepository.createIfNotExists({
    cutlabsId,
    title: project.title,
    url: project.inputUrl,
    status: VIDEO_STATUS.PROCESSING
  });

  videoObserver
    .addToQueue(cutlabsId)
    .on('failed', async failedId => {
      await videoRepository.updateStatus(failedId, VIDEO_STATUS.FAILED);
    })
    .on('processed', async ({ clips, project: { sid }}) => {
      await videoRepository.updateStatus(sid, VIDEO_STATUS.PROCESSED);
      await clipServices.createMany(sid, clips);
      logger.success('Vídeo processado')
    })
    .on('error', async e => {
      logger.error('Erro no processamento de video')
      await videoRepository.updateStatus(failedId, VIDEO_STATUS.FAILED);
    })
  return createdVideo;
}

module.exports = create;