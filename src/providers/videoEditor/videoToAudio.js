const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const path = require('node:path');

const videoToAudio = (video) => new Promise((resolve, reject) => {
  ffmpeg.setFfmpegPath(ffmpegStatic);
  const fileName = path.basename(video).split('.')[0] + '.wav';

  ffmpeg()
    .input(video)
    .outputOptions('-ab', '30k')
    .saveToFile(path.join(__dirname, '../../../data/audios', fileName))
    .on('end', () => {
      resolve()
    })
    .on('error', (error) => {
      reject(error);
    });
})

module.exports = videoToAudio;
