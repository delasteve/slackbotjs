import { SlackBot } from '..';
import dotenv from 'dotenv';
import path from 'path';

dotenv.load({
  path: path.join(__dirname, `.env`),
  silent: true
});

const slackbot = new SlackBot(process.env.SLACK_TOKEN);

let me;

slackbot.start()
  .then(() => { return slackbot.getUserList(); })
  .then((users) => { me = users.find((user) => { return user.name === `stephen.cavaliere`; }); })
  .then(() => {
    slackbot.postMessage({
      channel: me.id,
      text: `I have connected!`
    });
  });

slackbot.on(`message`, (payload) => {
  if (payload.text === `turn off`) {
    slackbot
      .end()
      .then(() => {
        slackbot.postMessage({
          channel: me.id,
          text: `Good bye!`
        });
      });
  }
});
