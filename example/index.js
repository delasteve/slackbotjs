require(`babel-core/register`);
require(`dotenv`).load({ silent: true });

const SlackBot = require(`../lib/slackbot`).default;
const slackbot = new SlackBot(process.env.SLACK_TOKEN);

slackbot.start();
