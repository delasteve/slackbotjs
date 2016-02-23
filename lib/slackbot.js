import slack from 'slack';

class SlackBot {
  constructor(token) {
    if (!token) { throw new Error(`expected api token to be defined`); }

    this.token = token;
    this.slack = slack.rtm.client();
  }

  start() {
    this.slack.listen({ token: this.token });
  }

  end() {
    this.slack.close();
  }

  addHandler(rtmEvent, callback) {
    this.slack[rtmEvent](callback);
  }
}

export default SlackBot;
