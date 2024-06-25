const { EventEmitter} = require('node:events');
const CutlabsApi = require('../../cutlabs/Api');
const cutlabsApi = new CutlabsApi();

class VideoObserver extends EventEmitter {
  constructor(secondsInterval = 120) {
    super();
    this.#queue = [];
    this.#intervalId = null;
    this.#interval = secondsInterval * 1000;
  }
  #queue;
  #intervalId;
  #interval;

  addToQueue(cutlabsId) {
    this.#queue.push(cutlabsId);
    if (this.#queue.length === 1) {
      this.#startInterval();
    }
    return this
  }

  #startInterval() {
    if (this.#intervalId === null) {
      this.#checkQueueProcessing()
      this.#intervalId = setInterval(() => {
        this.#checkQueueProcessing();
      }, this.#interval);
    }
  }

  #stopInterval() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }

  async #checkProccessing(queueIndex) {
    const cutlabsId = this.#queue[queueIndex];
    try {
      const { project, processingState, clips } = await cutlabsApi.getProject(cutlabsId);

      if(processingState.workflowState === "FAILED") {
        this.emit('failed', cutlabsId);
      }
      if (
        processingState.currentStepName === "Completed" &&
        // processingState.workflowState === "ACTIVE" &&
        clips.length
      ) {
        this.emit('processed', { project, processingState, clips });
        this.#queue.splice(queueIndex, 1);
        if (this.#queue.length === 0) {
          this.#stopInterval();
        }
      }
    } catch (error) {
      this.emit('error', { cutlabsId, error });
      console.error(`Error checking status for cutlabsId ${cutlabsId}:`, error);
    }
  }
  
  async #checkQueueProcessing() {
    for(const index in this.#queue) {
      this.#checkProccessing(index);
    }
  }
}

module.exports = new VideoObserver();
