const path = require('node:path');

const postsRepository = require('../repository');
const clipsRepository = require("../../clips/repository");
const YoutubeClient = require("../../youtube/client");

async function create(platforms) {
  for(const platform of platforms) {
    const clip = await clipsRepository.findOneToPost(platform);
    const clipPath = path.join(__dirname, '../../../../data/pending', `${clip.id}.mp4`);
    
    if(platform === 'youtube') {
      const youtubeClient = new YoutubeClient();

      await youtubeClient.uploadVideo({
        path: clipPath,
        title: clip.title,
        description: clip.description,
        tags: ['shorts'],
      });

    }
    await postsRepository.create({
      platform,
      clipId: clip.id
    })
  }
}

module.exports = create;
