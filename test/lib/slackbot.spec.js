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

  describe(`#constructor`, () => {
    it(`should throw an error if token is undefined`, () => {
      (() => { new SlackBot(); }).should.throw(Error, `expected api token to be defined`);
    });

    it(`should create a new slack rtm client`, () => {
      const clientStub = sandbox.stub(slack.rtm, `client`);

      new SlackBot(`foo`);

      clientStub.should.be.calledOnce;
    });
  });

  describe(`#run`, () => {
    const SLACK_TOKEN = `aFakeSlackToken`;
    let slackbot;

    beforeEach(() => {
      slackbot = new SlackBot(SLACK_TOKEN);
    });

    it(`opens a new RTM connection with the slack API token`, () => {
      const listenStub = sandbox.stub(slackbot.slack, `listen`)
        .withArgs({ token: SLACK_TOKEN });

      slackbot.run();

      listenStub.should.be.calledOnce;
    });
  });
});
