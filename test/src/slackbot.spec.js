import { SlackBot } from '../../src/slackbot';
import slack from 'slack';

describe(`SlackBot`, () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(`constructor`, () => {
    it(`should throw an error if token is undefined`, () => {
      (() => { new SlackBot(); }).should.throw(Error, `expected api token to be defined`);
    });

    it(`should create a new slack rtm client`, () => {
      const clientStub = sandbox.stub(slack.rtm, `client`);

      new SlackBot(`foo`);

      clientStub.should.be.calledOnce;
    });
  });

  describe(`methods`, () => {
    const SLACK_TOKEN = `aFakeSlackToken`;
    let slackbot;

    beforeEach(() => {
      slackbot = new SlackBot(SLACK_TOKEN);
    });

    describe(`#start`, () => {
      let listenStub;

      beforeEach(() => {
        listenStub = sandbox.stub(slackbot.slack, `listen`)
          .withArgs({ token: SLACK_TOKEN });
      });

      it(`opens a new RTM connection with the slack API token`, () => {
        slackbot.start();

        listenStub.should.be.calledOnce;
      });

      it(`returns a promise on connect`, () => {
        const promise = slackbot.start();

        return promise.should.be.fullfilled;
      });
    });

    describe(`#end`, () => {
      let closeStub;

      beforeEach(() => {
        closeStub = sandbox.stub(slackbot.slack, `close`);
      });

      it(`closes the RTM connection`, () => {
        slackbot.end();

        closeStub.should.be.called;
      });

      it(`returns a promise on close`, () => {
        const promise = slackbot.end();

        return promise.should.be.fullfilled;
      });
    });

    describe(`#on`, () => {
      it(`should add a handler to the specified event`, () => {
        const eventName = `customEvent`;
        const messageHandler = () => { return `foo`; };
        const eventStub = sandbox.stub();

        slackbot.slack[eventName] = eventStub;

        slackbot.on(eventName, messageHandler);

        eventStub.should.be.calledOnce;
        eventStub.should.be.calledWithExactly(messageHandler);
      });
    });

    describe(`#off`, () => {
      const EVENT_NAME = `aMadeUpEvent`;

      it(`removes a handler from the specified event`, () => {
        const aFunc = () => { return `foo`; };

        slackbot.slack.handlers[EVENT_NAME] = [aFunc];
        slackbot.slack.handlers[EVENT_NAME].length.should.equal(1);

        slackbot.off(EVENT_NAME, aFunc);

        slackbot.slack.handlers[EVENT_NAME].length.should.equal(0);
      });

      it(`removes only the handler passed in`, () => {
        const aFunc = () => { return `foo`; };
        const aFunc2 = () => { return `bar`; };

        slackbot.slack.handlers[EVENT_NAME] = [aFunc, aFunc2];
        slackbot.slack.handlers[EVENT_NAME].length.should.equal(2);

        slackbot.off(EVENT_NAME, aFunc);

        slackbot.slack.handlers[EVENT_NAME].length.should.equal(1);
        slackbot.slack.handlers[EVENT_NAME][0].should.equal(aFunc2);
      });
    });

    describe(`#getChannelList`, () => {
      let channelListStub;

      beforeEach(() => {
        channelListStub = sandbox.stub(slack.channels, `list`);
      });

      it(`returns a resolved promise list of channels`, () => {
        const response = { channels: [{ id: `C024BE91L`, name: `foo` }] };

        const promise = slackbot.getChannelList();

        channelListStub.yield(null, response);

        return Promise.all([
          promise.should.be.fulfilled,
          promise.should.eventually.equal(response.channels)
        ]);
      });

      it(`returns a rejected promise on error`, () => {
        const invalidAuthError = new Error(`invalid_auth`);

        const promise = slackbot.getChannelList();

        channelListStub.yield(invalidAuthError);

        return Promise.all([
          promise.should.be.rejected,
          promise.should.be.rejectedWith(invalidAuthError)
        ]);
      });
    });

    describe(`#getUserList`, () => {
      let userListStub;

      beforeEach(() => {
        userListStub = sandbox.stub(slack.users, `list`);
      });

      it(`returns a resolved promise list of users`, () => {
        const response = { members: [{ id: `U023BECGF`, name: `bobby`, deleted: false }] };

        const promise = slackbot.getUserList();

        userListStub.yield(null, response);

        return Promise.all([
          promise.should.be.fulfilled,
          promise.should.eventually.equal(response.members)
        ]);
      });

      it(`returns a rejected promise on error`, () => {
        const invalidAuthError = new Error(`invalid_auth`);

        const promise = slackbot.getUserList();

        userListStub.yield(invalidAuthError);

        return Promise.all([
          promise.should.be.rejected,
          promise.should.be.rejectedWith(invalidAuthError)
        ]);
      });
    });

    describe(`#postMessage`, () => {
      let postMessageStub;

      beforeEach(() => {
        postMessageStub = sandbox.stub(slack.chat, `postMessage`);
      });

      it(`appends token to message by default`, () => {
        slackbot.postMessage();

        postMessageStub.should.be.calledOnce;
        postMessageStub.getCall(0).args[0].should.have.property(`token`, SLACK_TOKEN);
      });

      it(`appends { as_user: true } to message by default`, () => {
        slackbot.postMessage();

        postMessageStub.should.be.calledOnce;
        postMessageStub.getCall(0).args[0].should.have.property(`as_user`, true);
      });

      it(`respects as_user if present`, () => {
        slackbot.postMessage({ as_user: `fooValue` });

        postMessageStub.should.be.calledOnce;
        postMessageStub.getCall(0).args[0].should.have.property(`as_user`, `fooValue`);
      });

      it(`returns a resolved promise on successful post`, () => {
        const response = { ts: `1405895017.000506`, channel: `C024BE91L`, message: {} };

        const promise = slackbot.postMessage();

        postMessageStub.yield(null, response);

        return Promise.all([
          promise.should.be.fulfilled,
          promise.should.eventually.equal(response)
        ]);
      });

      it(`returns a rejected promise on error`, () => {
        const invalidAuthError = new Error(`invalid_auth`);

        const promise = slackbot.postMessage();

        postMessageStub.yield(invalidAuthError);

        return Promise.all([
          promise.should.be.rejected,
          promise.should.be.rejectedWith(invalidAuthError)
        ]);
      });
    });
  });
});
