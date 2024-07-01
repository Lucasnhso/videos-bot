const path = require('node:path');
const fs = require('node:fs');

const postsRepository = require('../repository');
const clipsRepository = require("../../clips/repository");
const YoutubeClient = require("../../../providers/youtube/client");

async function create(platforms, publishAt) {
  for(const platform of platforms) {
    const clip = await clipsRepository.findOneToPost(platform);
    const clipPath = path.join(__dirname, '../../../../data/pending', `${clip.id}.mp4`);
    
    if(platform === 'youtube') {
      const youtubeClient = new YoutubeClient();

      await youtubeClient.uploadVideo({
        path: clipPath,
        title: clip.title,
        description: clip.description,
        tags: ['shorts']
      }, { publishAt });

    }
    await postsRepository.create({
      platform,
      clipId: clip.id
    })
    // fs.renameSync(`../../../../data/done/${clip.id}.mp4`)
  }
}

module.exports = create;
