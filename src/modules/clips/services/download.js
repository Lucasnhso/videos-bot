const CutlabsApi = require("../../../providers/cutlabs/Api");
const { CLIP_STATUS } = require("../../../utils/consts");
const clipRepository = require("../../clips/repository");

async function download({ id, cutlabsId}) {
  await clipRepository.updateStatus(id, CLIP_STATUS.DOWNLOADING);
  try {
    await CutlabsApi.downloadClip(cutlabsId, id);
    await clipRepository.updateStatus(id, CLIP_STATUS.DOWNLOADED)
  } catch (error) {
    await clipRepository.updateStatus(id, CLIP_STATUS.DOWNLOAD_FAILED);
    throw new Error(error);
  }
}

module.exports = download;
