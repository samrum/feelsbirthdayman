import SlackRequest from "./SlackRequest";
import TranslateRequest from "./TranslateRequest";
import { SlackUser, BirthdayMessage } from "./types";

class FeelsBirthdayMan {
  static mentionMatchesUser(mention: string, user: SlackUser): boolean {
    return [
      user.profile.display_name_normalized,
      user.profile.display_name,
      user.profile.real_name_normalized,
      user.profile.real_name,
    ].includes(mention);
  }

  constructor(
    private slackRequest: SlackRequest,
    private translateRequest: TranslateRequest,
  ) {}

  async postBirthdayMessage(
    channel: string,
    usersToMention: string[] = [],
  ): Promise<any> {
    const mentions = await this.getMentions(usersToMention);

    const { language, message } = await this.getBirthdayMessage(mentions);

    const postResponse = await this.slackRequest.postMessage(channel, message);

    return {
      language,
      message,
      postResponse,
    };
  }

  async getMentions(usersToMention: string[]): Promise<string> {
    const userList = await this.slackRequest.getSlackUsers();

    const mentionBits = this.getMentionBits(usersToMention, userList);

    return mentionBits.length > 0 ? `${mentionBits.join(" ")} ` : "";
  }

  getMentionBits(usersToMention: string[], userList: SlackUser[]): string[] {
    const mentionBits: string[] = [];

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

  async getBirthdayMessage(mentions = ""): Promise<BirthdayMessage> {
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

export default FeelsBirthdayMan;
