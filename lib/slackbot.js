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

  on(rtmEvent, callback) {
    this.slack[rtmEvent](callback);
  }

  off(rtmEvent, callback) {
    const handlers = this.slack.handlers[rtmEvent];

    for (let index = 0; index < handlers.length; index++) {
      if (handlers[index] === callback) {
        handlers.splice(index, 1);
        break;
      }
    }
  }
}

export default SlackBot;
