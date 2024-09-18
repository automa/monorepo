// @ts-ignore
import quibble from 'quibble';
import { createSandbox } from 'sinon';

export const quibbleSandbox = createSandbox();

export const zxCmdArgsStub = quibbleSandbox
  .stub()
  .resolves()
  .withArgs([['git rev-parse HEAD']])
  .resolves({ stdout: '353fabbf70ac7a2cad3d9e27889bfc77f419d61b' });
export const zxCmdStub = quibbleSandbox.stub().returns(zxCmdArgsStub);

quibble('zx', { $: zxCmdStub });
