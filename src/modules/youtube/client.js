const { google } = require('googleapis');
const fs = require('node:fs');
const routes = require('../../routes');

const youtube = google.youtube({ version: "v3"});
const OAuth2 = google.auth.OAuth2;

class YoutubeClient {
  constructor() {
    this.#createOAuthClient();

  }
  #oAuthClient;

  async uploadVideo(video, options = {
    categoryId: '22',
    tags: ['shorts']
  }) {
    await this.#authenticate();

    const videoFileSize = fs.statSync(video.path).size;

    const requestParams = {
      part: 'snippet, status',
      requestBody: {
        snippet: {
          title: video.title,
          description: video.description,
          tags: options.tags,
          // categoryId: options.categoryId,
        },
        status: {
          privacyStatus: 'unlisted',
          ...(options.publishAt && { publishAt: options.publishAt })
        }
      },
      media: {
        body: fs.createReadStream(video.path),
      }
    };

    const response = await youtube.videos.insert(requestParams, {
      onUploadProgress
    });
    console.log(`> Video available at: https://youtu.be/${response.data.id}`)

    return response;

    function onUploadProgress(event) {
      const progress = Math.round((event.bytesRead / videoFileSize) * 100);
      console.log(`> ${progress}% completed`);
    }
  }

  async #authenticate(){
    await this.#requestUserConsent();
    const authCode = await this.#waitForGoogleCallback();
    await this.#requestGoogleForAccessTokens(authCode);

    google.options({
      auth: this.#oAuthClient
    })
  }

  async #createOAuthClient() {
    const { web: credentials } = require('../../../credentials/google-youtube.json');
    this.#oAuthClient = new OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
  }

  async #waitForGoogleCallback() {
    return new Promise((resolve, reject) => {
      routes.get('/oauth2callback', (req, res) => {
        const authCode = req.query.code;
        console.log(`> Consent given: ${authCode}`);
      
        res.send('<h1>Thank you!</h1><p>Now close this tab.</p>');
        resolve(authCode)
      })
    })
  }

  async #requestUserConsent() {
    const consentUrl = this.#oAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube']
    })

    console.log(`> Please give your consent ${consentUrl}`);
  }

  async #requestGoogleForAccessTokens(authorizationToken) {
    return new Promise((resolve, reject) => {
      this.#oAuthClient.getToken(authorizationToken, (error, tokens) => {
        if (error) {
          return reject(error);
        }
        console.log('> Access tokens received:');
        // console.log(tokens);
        this.#oAuthClient.setCredentials(tokens);
        resolve()
      })
    })
  }
}

module.exports = YoutubeClient;
