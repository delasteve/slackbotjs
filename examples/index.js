const SlackBot = require(`..`).SlackBot;
const path = require(`path`);

require(`dotenv`).load({
  path: path.join(__dirname, `.env`),
  silent: true
});

const slackbot = new SlackBot(process.env.SLACK_TOKEN);

slackbot.start();
