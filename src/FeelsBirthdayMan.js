class FeelsBirthdayMan {
  static mentionMatchesUser(mention, user) {
    return [
      user.profile.display_name_normalized,
      user.profile.display_name,
      user.profile.real_name_normalized,
      user.profile.real_name,
    ].includes(mention);
  }

  constructor(slackRequest, translateRequest) {
    this.slackRequest = slackRequest;
    this.translateRequest = translateRequest;
  }

  async postBirthdayMessage(usersToMention = []) {
    const mentions = await this.getMentions(usersToMention);

    const { language, message } = await this.getBirthdayMessage(mentions);

    const postResponse = await this.slackRequest.postMessage(
      process.env.SLACK_CHANNEL,
      message,
    );

    return {
      language,
      message,
      postResponse,
    };
  }

  async getMentions(usersToMention) {
    const userList = await this.slackRequest.getSlackUsers();

    const mentionBits = this.getMentionBits(usersToMention, userList);

    return mentionBits.length > 0 ? `${mentionBits.join(" ")} ` : "";
  }

  getMentionBits(usersToMention, userList) {
    const mentionBits = [];

    usersToMention.forEach(user => {
      if (user.indexOf("@") === 0) {
        const mention = user.substring(1);

        const mentionedUser = userList.find(user => {
          return FeelsBirthdayMan.mentionMatchesUser(mention, user);
        });

        mentionBits.push(mentionedUser ? `<@${mentionedUser.id}>` : user);
      } else {
        mentionBits.push(user);
      }
    });

    return mentionBits;
  }

  async getBirthdayMessage(mentions = "") {
    const {
      language,
      translation,
    } = await this.translateRequest.getRandomTranslation("Happy Birthday!");

    return {
      language,
      message: `${translation} ${mentions}:feelsbirthdayman: :balloon:`,
    };
  }
}

module.exports = FeelsBirthdayMan;
