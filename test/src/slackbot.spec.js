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
      it(`opens a new RTM connection with the slack API token`, () => {
        const listenStub = sandbox.stub(slackbot.slack, `listen`)
          .withArgs({ token: SLACK_TOKEN });

        slackbot.start();

        listenStub.should.be.calledOnce;
      });
    });

    describe(`#end`, () => {
      it(`closes the RTM connection`, () => {
        const closeStub = sandbox.stub(slackbot.slack, `close`);

        slackbot.end();

        closeStub.should.be.called;
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
      it(`returns a resolved promise list of channels`, () => {
        const response = { ok: true, channels: [{ id: `C024BE91L`, name: `foo` }] };
        const channelsListStub = sandbox.stub(slack.channels, `list`);

        const promise = slackbot.getChannelList();

        channelsListStub.yield(null, response);

        return Promise.all([
          promise.should.be.fulfilled,
          promise.should.eventually.equal(response.channels)
        ]);
      });

      it(`returns a rejected promise on error`, () => {
        const channelsListStub = sandbox.stub(slack.channels, `list`);
        const invalidAuthError = new Error(`invalid_auth`);

        const promise = slackbot.getChannelList();

        channelsListStub.yield(invalidAuthError);

        return Promise.all([
          promise.should.be.rejected,
          promise.should.be.rejectedWith(invalidAuthError)
        ]);
      });
    });
  });
});
