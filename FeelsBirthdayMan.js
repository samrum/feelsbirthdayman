const { Translate } = require("@google-cloud/translate");
const fetch = require("node-fetch");

class FeelsBirthdayMan {
  constructor(usersToMention = []) {
    this.usersToMention = usersToMention;
  }

  static mentionMatchesUser(mention, userProfile) {
    return [
      userProfile.display_name_normalized,
      userProfile.display_name,
      userProfile.real_name_normalized,
      userProfile.real_name,
    ].includes(mention);
  }

  static async makeSlackRequest(apiMethod, method = "get", body = {}) {
    const headers = {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      "Content-type": "application/json; charset=utf-8",
      Accept: "application/json",
      "Accept-Charset": "utf-8",
    };

    const response = await fetch(`https://slack.com/api/${apiMethod}`, {
      method,
      headers,
      ...(method === "post" ? { body: JSON.stringify(body) } : {}),
    });

    if (!(response && response.ok && typeof response.json === "function")) {
      const error = new Error(`Slack ${apiMethod} request failed`);
      error.response = response;

      throw error;
    }

    const jsonResponse = await response.json();

    if (!jsonResponse.ok) {
      const error = new Error(`Slack ${apiMethod} request failed`);
      error.response = jsonResponse;

      throw error;
    }

    return jsonResponse;
  }

  static async postMessage(message) {
    return FeelsBirthdayMan.makeSlackRequest("chat.postMessage", "post", {
      channel: process.env.SLACK_CHANNEL,
      text: message,
      as_user: true,
      link_names: true,
    });
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

  async getSlackUsers() {
    const { members: users = [] } = await FeelsBirthdayMan.makeSlackRequest(
      "users.list",
    );

    return users;
  }

  async getMentions() {
    const userBits = [];

    const userList = await this.getSlackUsers();

    this.usersToMention.forEach(user => {
      if (user.indexOf("@") === 0) {
        const mention = user.substring(1);

        const mentionedUser = userList.find(user => {
          return FeelsBirthdayMan.mentionMatchesUser(mention, user.profile);
        });

        userBits.push(mentionedUser ? `<@${mentionedUser.id}>` : user);
      } else {
        userBits.push(user);
      }
    });

    return userBits.length > 0 ? `${userBits.join(" ")} ` : "";
  }

  async getBirthdayMessage() {
    const {
      language,
      translation,
    } = await FeelsBirthdayMan.getRandomTranslation("Happy Birthday!");

    const mentions = await this.getMentions();

    return {
      language,
      message: `${translation} ${mentions}:feelsbirthdayman: :balloon:`,
    };
  }
}

module.exports = FeelsBirthdayMan;
