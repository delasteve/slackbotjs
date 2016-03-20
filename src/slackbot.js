import slack from 'slack';

class SlackBot {
  constructor(token) {
    if (!token) { throw new Error(`expected api token to be defined`); }

    this.token = token;
    this.slack = slack.rtm.client();
  }

  start() {
    this.slack.listen({ token: this.token });

    return Promise.resolve();
  }

  end() {
    this.slack.close();

    return Promise.resolve();
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

  postMessage(message) {
    return new Promise((resolve, reject) => {
      const defaultMessage = { token: this.token, as_user: true };
      const updatedMessage = Object.assign({}, defaultMessage, message);

      slack.chat.postMessage(updatedMessage, (error, data) => {
        if (error) { return reject(error); }
        return resolve(data);
      });
    });
  }

  getChannelList() {
    return new Promise((resolve, reject) => {
      slack.channels.list({ token: this.token }, (error, data) => {
        if (error) { return reject(error); }
        return resolve(data.channels);
      });
    });
  }

  getUserList() {
    return new Promise((resolve, reject) => {
      slack.users.list({ token: this.token }, (error, data) => {
        if (error) { return reject(error); }
        return resolve(data.members);
      });
    });
  }
}

export { SlackBot };
