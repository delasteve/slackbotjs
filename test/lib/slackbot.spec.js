import SlackBot from '../../lib/slackbot';
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

    describe(`#close`, () => {
      it(`should close the RTM connection`, () => {
        const closeStub = sandbox.stub(slackbot.slack, `close`);

        slackbot.end();

        closeStub.should.be.called;
      });
    });

    describe(`#addHandler`, () => {
      it(`should add a handler to the specified event`, () => {
        const eventName = `customEvent`;
        const messageHandler = () => { return `foo`; };
        const eventStub = sandbox.stub();

        slackbot.slack[eventName] = eventStub;

        slackbot.addHandler(eventName, messageHandler);

        eventStub.should.be.calledOnce;
        eventStub.should.be.calledWithExactly(messageHandler);
      });
    });
  });
});
