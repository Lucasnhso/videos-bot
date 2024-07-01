const createQueue = require("../../../queue/create");
const logger = require("../../../utils/logger");
const clipsServices = require('../services');

const download = createQueue('clip-download');

download.process(async clip => {
  logger.info('> Dowloading clip');
  await clipsServices.download(clip);
})

download.on('failed', (job, err) => {
  logger.error('> Clip download failed', err);
});


download.on('completed', () => {
  logger.success('> Clip downloaded');
});

module.exports = download;
