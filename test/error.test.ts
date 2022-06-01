import { assert } from 'chai';

import { call } from './utils';

suite('error', () => {
  test('unhandled routes return 404', async () => {
    const { result, error } = await call('/unhandled-route');

    assert.isUndefined(result);

    assert.equal(error?.response?.status, 404);

    assert.equal(error?.response?.data.error, 'Not Found');
    assert.equal(error?.response?.data.statusCode, 404);

    assert.equal(
      error?.response?.headers['content-type'],
      'application/json; charset=utf-8',
    );
  });
});
