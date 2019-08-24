const { Translate } = require("@google-cloud/translate");
const fetch = require("node-fetch");

class FeelsBirthdayMan {
  constructor(people = []) {
    this.people = people;
  }

  static async postMessage(message) {
    const headers = {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      "Content-type": "application/json; charset=utf-8",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    };

    const body = {
      channel: process.env.SLACK_CHANNEL,
      text: message,
      as_user: true,
      link_names: true,
    };

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "post",
      headers,
      body: JSON.stringify(body),
    });

    if (!(response && response.ok && typeof response.json === "function")) {
      const error = new Error("Failed to post message to Slack");
      error.response = response;

      throw error;
    }

    return response.json();
  }

  static async getRandomTranslation(message) {
    const translate = new Translate({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
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

  async postBirthdayMessage() {
    const { language, message } = await this.getBirthdayMessage();

    const postResponse = await FeelsBirthdayMan.postMessage(message);

    return {
      language,
      message,
      postResponse,
    };
  }

  async getBirthdayMessage() {
    const {
      language,
      translation,
    } = await FeelsBirthdayMan.getRandomTranslation("Happy Birthday!");

    const peopleString =
      this.people.length > 0 ? `${this.people.join(" ")} ` : "";

    return {
      language,
      message: `${translation} ${peopleString}:feelsbirthdayman: :balloon:`,
    };
  }
}

module.exports = FeelsBirthdayMan;
