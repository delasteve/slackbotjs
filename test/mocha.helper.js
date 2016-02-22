import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

global.sinon = sinon;
global.should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
