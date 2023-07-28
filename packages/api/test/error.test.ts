import { assert } from 'chai';

import { call } from './utils';

suite('error', () => {
  test('unhandled routes return 404', async () => {
    const response = await call('/unhandled-route');

    assert.equal(response.statusCode, 404);

    assert.equal(
      response.headers['content-type'],
      'application/json; charset=utf-8',
    );

    const data = response.json();

    assert.equal(data.error, 'Not Found');
    assert.equal(data.statusCode, 404);
  });
});
