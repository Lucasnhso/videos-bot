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

  async extractTagsFromText(text) {
    const systemPrompt = `
      Você é um especialista em marketing digital com foco em otimização de SEO para vídeos do YouTube.
      Seu objetivo é selecionar as melhores tags para um vídeo com base em sua transcrição.
      As tags devem ser relevantes, populares e ajudar a melhorar a visibilidade do vídeo.

      Atenha-se 100% ao formato de retorno esperado. Nunca, hipotese alguma envie qualquer caracter não permitido na lista
      Formato de retorno esperado:
      - As tags devem ser separadas por vírgulas, por exemplo: saude,negócios.
      - Não conter nada que não seja as tags na resposta
      - Caracteres não permitidos: números em geral, traços "-", ponto ".", hashtag "#", dois pontos ":"
    `;

    const userPrompt = `
      Aqui está a transcrição de um vídeo do YouTube:
      
      ${text}
      
      Por favor, selecione e escolha as melhores tags para esse vídeo.
    `

    const retryCondition = (text) => !/\d\.\s|\-\s|\n|#|:/.test(text);

    const result = await this.#message(
      systemPrompt,
      userPrompt,
      { retryCondition }
    );

    if(!retryCondition(result)) {
      throw new Error('it was not possible extract tags from text')
    }

    return result.replace('.', '').split(', ');
  }

  async #message(system, user, options = {}) {
    const messages = [
      { role: "system", content: system},
      { role: "user", content: user },
    ];

    return this.#client.chatCompletion(messages, {
      model: 'gpt-4',
      ...(options.retryCondition && {
        retry: {
          times: 10,
          condition: options.retryCondition
        }
      })
    })
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
