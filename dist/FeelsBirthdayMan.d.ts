import SlackRequest from "./SlackRequest";
import TranslateRequest from "./TranslateRequest";
declare class FeelsBirthdayMan {
    private slackRequest;
    private translateRequest;
    private static mentionMatchesUser;
    constructor(slackRequest: SlackRequest, translateRequest: TranslateRequest);
    postBirthdayMessage(channel: string, usersToMention?: string[]): Promise<any>;
    private getMentions;
    private getMentionBits;
    private getBirthdayMessage;
}
export default FeelsBirthdayMan;
