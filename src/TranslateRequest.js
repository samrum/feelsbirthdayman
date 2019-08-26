const { Translate } = require("@google-cloud/translate");

class TranslateRequest {
  constructor(projectId) {
    this.projectId = projectId;
  }

  async getRandomTranslation(message) {
    const translate = new Translate({
      projectId: this.projectId,
    });

    let [languages] = await translate.getLanguages();

    languages = languages.filter(language => language.code !== "en");

    const targetLanguage =
      languages[Math.floor(Math.random() * languages.length)];

    const [translation] = await translate.translate(
      message,
      targetLanguage.code,
    );

    return {
      translation,
      language: targetLanguage.name,
    };
  }
}

module.exports = TranslateRequest;
