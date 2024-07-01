const VIDEO_STATUS = {
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  FAILED: 'failed'
};

const CLIP_STATUS = {
  PENDING: 'pending',
  DOWNLOADING: 'downloading',
  DOWNLOADED: 'donwloaded',
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