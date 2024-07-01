const VIDEO_STATUS = {
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  FAILED: 'failed'
};

const CLIP_STATUS = {
  PENDING: 'pending',
  DOWNLOADING: 'downloading',
  DOWNLOADED: 'downloaded',
  DOWNLOAD_FAILED: 'download-failed',
  TRANSLATING: 'translating',
  TRANSLATED: 'translated',
  TAGGING: 'tagging',
  TAGGED: 'tagged',
  AVAILABLE: 'available'
}

module.exports = {
  VIDEO_STATUS,
  CLIP_STATUS
}