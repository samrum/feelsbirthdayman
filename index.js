require("dotenv").config();
const FeelsBirthdayMan = require("./FeelsBirthdayMan");

new FeelsBirthdayMan(process.argv.slice(2))
  .postBirthdayMessage()
  .then(console.log)
  .catch(console.error);
