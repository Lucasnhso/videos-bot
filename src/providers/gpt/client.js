const { G4F } = require("g4f");

class GptClient {
  constructor() {
    this.#client = new G4F();
  }
  #client;

  async translate(text, { source = 'en', target = 'pt' } = {}) {
    return this.#retry(async () => {
      const { translation } = await this.#client.translation({
        text,
        source,
        target
      });
      return translation.result;
    }, 3, 200);
  }

  async #retry(fn, retries, delay) {
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries) throw error;
        await this.#delay(delay);
      }
    }
  }

  #delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = GptClient;
