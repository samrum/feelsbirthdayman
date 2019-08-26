import SlackRequest from "./SlackRequest";
import TranslateRequest from "./TranslateRequest";
import { SlackUser, BirthdayMessage } from "./types";

class FeelsBirthdayMan {
<<<<<<< HEAD:src/FeelsBirthdayMan.ts
  private static mentionMatchesUser(mention: string, user: SlackUser): boolean {
=======
  static mentionMatchesUser(mention: string, user: SlackUser): boolean {
>>>>>>> 597f303e940298e4e5e9b51b6672bebb78a3e311:src/FeelsBirthdayMan.ts
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

<<<<<<< HEAD:src/FeelsBirthdayMan.ts
  private async getMentions(usersToMention: string[]): Promise<string> {
=======
  async getMentions(usersToMention: string[]): Promise<string> {
>>>>>>> 597f303e940298e4e5e9b51b6672bebb78a3e311:src/FeelsBirthdayMan.ts
    const userList = await this.slackRequest.getSlackUsers();

    const mentionBits = this.getMentionBits(usersToMention, userList);

    return mentionBits.length > 0 ? `${mentionBits.join(" ")} ` : "";
  }

<<<<<<< HEAD:src/FeelsBirthdayMan.ts
  private getMentionBits(
    usersToMention: string[],
    userList: SlackUser[],
  ): string[] {
=======
  getMentionBits(usersToMention: string[], userList: SlackUser[]): string[] {
>>>>>>> 597f303e940298e4e5e9b51b6672bebb78a3e311:src/FeelsBirthdayMan.ts
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

<<<<<<< HEAD:src/FeelsBirthdayMan.ts
  private async getBirthdayMessage(mentions = ""): Promise<BirthdayMessage> {
=======
  async getBirthdayMessage(mentions = ""): Promise<BirthdayMessage> {
>>>>>>> 597f303e940298e4e5e9b51b6672bebb78a3e311:src/FeelsBirthdayMan.ts
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
