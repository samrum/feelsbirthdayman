import { Translate } from "@google-cloud/translate";
import { RandomTranslation } from "./types";

class TranslateRequest {
  constructor(private projectId: string) {}

  async getRandomTranslation(message: string): Promise<RandomTranslation> {
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

export default TranslateRequest;
