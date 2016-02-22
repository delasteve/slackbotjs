const path = require(`path`);

require(`babel-core/register`);
require(`dotenv`).load({
  path: path.join(__dirname, `.env`),
  silent: false
});

const SlackBot = require(`../lib/slackbot`).default;
const slackbot = new SlackBot(process.env.SLACK_TOKEN);

slackbot.run();
