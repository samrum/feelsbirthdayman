require("dotenv").config();
const FeelsBirthdayMan = require("./FeelsBirthdayMan");

new FeelsBirthdayMan(process.argv.slice(2))
  .postBirthdayMessage()
  .then(result => console.log(result))
  .catch(e => console.log(e));
