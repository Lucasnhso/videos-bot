const { G4F } = require("g4f");

class GptClient {
  constructor() {
    this.#client = new G4F();
  }
  #client;

  async translate({ text, source, target}) {
    const { translation } = await this.#client.translation({
      text,
      source,
      target
    })

    return translation.result
  }
}

module.exports = GptClient;
