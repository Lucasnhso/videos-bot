const CutlabsScrapper = require("../../cutlabs/Scrapper");
const CutlabsApi = require('../../cutlabs/Api');
const videoRepository = require("../repository");
const videoObserver = require('./observer');
const clipServices = require('../../clips/services')

const cutlabsApi = new CutlabsApi();
const cutlabsScrapper = new CutlabsScrapper();

async function create({ url, cutlabsId }) {
  if(url) {
    cutlabsId = await cutlabsScrapper.execute('createClips', url);
  }

  const { project, processingState } = await cutlabsApi.getProject(cutlabsId);

  const createdVideo = await videoRepository.create({
    cutlabsId,
    title: project.title,
    url: project.inputUrl,
    status: 'processing'
  });

  videoObserver
    .addToQueue(cutlabsId)
    .on('failed', async failedId => {
      await videoRepository.updateStatus(failedId, 'failed');
    })
    .on('processed', async ({ clips, project: { sid }}) => {
      await videoRepository.updateStatus(sid, 'processed');
      await clipServices.createMany(sid, clips);
      console.log('Vídeo processado')
    })
    .on('error', async e => {
      console.log('Erro no processamento')
    })
  return createdVideo;
}

module.exports = create;