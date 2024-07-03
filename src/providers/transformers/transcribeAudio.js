const fs = require('node:fs');
const logger = require('../../utils/logger');
const wavefile = require('wavefile');

async function prepareAudio(audioPath) {
  let buffer = fs.readFileSync(audioPath);

  let wav = new wavefile.WaveFile(buffer);
  wav.toBitDepth('32f');
  wav.toSampleRate(16000);
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);

      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
      }
    }

    audioData = audioData[0];
  }
  return audioData
}

async function transcribeAudio(path) {
  logger.info('> Start transcribe');

  const { pipeline } = await import('@xenova/transformers');

  const audioData = prepareAudio(path);
  const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-small');
  
  const { text } = await transcriber(audioData, {
    language: 'portuguese',
    task: 'transcribe',
    chunk_length_s: 30,
    stride_length_s: 5
  })
  
  logger.success('> Transcribed');
  return text;
}

module.exports = transcribeAudio;
