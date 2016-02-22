import slack from 'slack';

class SlackBot {
  constructor(token) {
    if (!token) { throw new Error(`expected api token to be defined`); }

    this.token = token;
    this.slack = slack.rtm.client();
  }

  run() {
    this.slack.listen({ token: this.token });
  }
}

export default SlackBot;
