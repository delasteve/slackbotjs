require(`babel-core/register`);
require(`dotenv`).load({ silent: true });

const SlackBot = require(`../lib/slackbot`).SlackBot;
const slackbot = new SlackBot(process.env.SLACK_TOKEN);

slackbot.start();
