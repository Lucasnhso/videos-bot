const axios = require('axios');
const fs = require('node:fs')
const path = require('node:path')

class CutlabsApi {
  constructor() {
    this.#url = "https://cutlabs.ai/api";
  }
  #url;

  async getProject(projectId) {
    const { data } = await axios(`https://cutlabs.ai/api/project?sid=${projectId}`)
    return data;
  }
  async downloadClip(cutlabsId, id) {
    const response = await axios({
      url: `https://static.cutlabs.ai/clip/${cutlabsId}/highres.mp4`,
      method: 'GET',
      responseType: 'stream'
    });
    const outputPath = path.join(__dirname, '../../../data/pending');

    const writer = fs.createWriteStream(`${outputPath}/${id}.mp4`);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}

module.exports = CutlabsApi;
