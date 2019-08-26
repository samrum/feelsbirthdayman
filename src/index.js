require("dotenv").config();
const FeelsBirthdayMan = require("./FeelsBirthdayMan");
const SlackRequest = require("./SlackRequest");
const TranslateRequest = require("./TranslateRequest");

const usersToMention = process.argv
  .slice(2)
  .join(" ")
  .split(",")
  .map(user => user.trim());

new FeelsBirthdayMan(
  new SlackRequest(process.env.SLACK_TOKEN),
  new TranslateRequest(process.env.GOOGLE_CLOUD_PROJECT_ID),
)
  .postBirthdayMessage(usersToMention)
  .then(console.log)
  .catch(console.error);
