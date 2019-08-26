require("dotenv").config();
const FeelsBirthdayMan = require("./FeelsBirthdayMan");

const usersToMention = process.argv
  .slice(2)
  .join(" ")
  .split(",")
  .map(user => user.trim());

new FeelsBirthdayMan(usersToMention)
  .postBirthdayMessage()
  .then(console.log)
  .catch(console.error);
