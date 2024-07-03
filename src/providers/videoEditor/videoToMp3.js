const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('node:path');
const logger = require('../../utils/logger');

const videoToAudio = (video) => new Promise((resolve, reject) => {
  logger.info('> Start convert video to audio')
  ffmpeg.setFfmpegPath(ffmpegStatic);
  const fileName = path.basename(video).split('.')[0] + '.mp3';

  ffmpeg()
    .input(video)
    .outputOptions('-ab', '30k')
    .saveToFile(path.join(__dirname, '../../../data/audios', fileName))
    .on('end', () => {
      logger.success('Video converted to audio');
      resolve()
    })
    .on('error', (error) => {
      logger.error('> Error on convert video to audio')
      reject(error);
    });
})

module.exports = videoToAudio;
