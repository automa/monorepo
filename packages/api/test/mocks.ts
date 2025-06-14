// @ts-ignore
import quibble from 'quibble';
import { createSandbox } from 'sinon';

export const quibbleSandbox = createSandbox();

export const zxCmdArgsStub = quibbleSandbox.stub().callsFake((args) => {
  if (args[0].includes('git rev-parse HEAD')) {
    return Promise.resolve({
      stdout: '353fabbf70ac7a2cad3d9e27889bfc77f419d61b',
    });
  }

  if (args[0].includes('git write-tree')) {
    return Promise.resolve({
      stdout: '7d9ff19f227379dabecd6dfd07514c13a412a466',
    });
  }

  // Default fallback
  return Promise.resolve({
    stdout: '85e10273ac6513bd5bad6148e0657bc3c4b8d946',
  });
});

export const zxCmdStub = quibbleSandbox.stub().returns(zxCmdArgsStub);

quibble('zx', { $: zxCmdStub });
