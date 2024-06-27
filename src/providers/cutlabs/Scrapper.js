const puppeteer = require('puppeteer');
const { CUTLABS_EMAIL, CUTLABS_PASSWORD } = process.env;

const cutlabsUrl = "https://cutlabs.ai";

class CutlabsScrapper {
  async #signIn(page){
    const signInUrl = `${cutlabsUrl}/signin`
    await page.goto(signInUrl);
    const selectors = {
      buttonEmailLogin: '.firebaseui-idp-button.mdl-button.mdl-js-button.mdl-button--raised.firebaseui-idp-password.firebaseui-id-idp-button',
      inputEmail: '#ui-sign-in-email-input',
      inputPassword: '#ui-sign-in-password-input',
      buttonSubmit: '.firebaseui-id-submit'
    }
    await page.waitForSelector(selectors.buttonEmailLogin);
    await page.click(selectors.buttonEmailLogin);

    await page.waitForSelector(selectors.inputEmail);
    await page.type(selectors.inputEmail, CUTLABS_EMAIL);
    await page.click(selectors.buttonSubmit);
    
    await page.waitForSelector(selectors.inputPassword);
    await page.type(selectors.inputPassword, CUTLABS_PASSWORD);
    await page.click(selectors.buttonSubmit);
  }

  async #createClips(page, videoUrl){
    const selectors = {
      buttonCreateNewClips: ".mantine-1lvqbn9",
      inputVideoUrl: ".mantine-1imqe6k",
      inputVideoLanguage: ".mantine-sz3tw3",
      buttonCreate: ".mantine-8exuas"
    }
    
    await page.waitForSelector(selectors.buttonCreateNewClips);
    await page.click(selectors.buttonCreateNewClips);
    
    await page.waitForSelector(selectors.inputVideoUrl);
    await page.type(selectors.inputVideoUrl, videoUrl);
  
    await page.waitForSelector(selectors.inputVideoLanguage);
    // await page.click(selectors.inputVideoLanguage);
    // await page.type(selectors.inputVideoLanguage, "Portuguese")
    await page.waitForSelector(selectors.buttonCreate);
    await page.click(selectors.buttonCreate);
    await page.waitForNavigation()
    const projectId = page.url().split('/')[4];

    await page.close();
    return projectId
  }

  async execute(scrapperName, ...params){
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await this.#signIn(page)
    if (scrapperName === 'createClips') {
      await this.#createClips(page, ...params)
    }

    await browser.close();
  }
}

module.exports = CutlabsScrapper;