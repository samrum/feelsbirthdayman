require("dotenv").config();
import FeelsBirthdayMan from "./FeelsBirthdayMan";
import SlackRequest from "./SlackRequest";
import TranslateRequest from "./TranslateRequest";

const usersToMention = process.argv
  .slice(2)
  .join(" ")
  .split(",")
  .map(user => user.trim());

if (
  !(
    process.env.GOOGLE_CLOUD_PROJECT_ID &&
    process.env.SLACK_TOKEN &&
    process.env.SLACK_CHANNEL
  )
) {
  throw new Error("Missing configuration in .env file");
}

new FeelsBirthdayMan(
  new SlackRequest(process.env.SLACK_TOKEN),
  new TranslateRequest(process.env.GOOGLE_CLOUD_PROJECT_ID),
)
  .postBirthdayMessage(process.env.SLACK_CHANNEL, usersToMention)
  .then(console.log)
  .catch(console.error);
