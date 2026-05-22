import { type User } from 'auth/types';

import reducer, { setAuth, setUserOrg, unsetAuth } from './auth';

const dummyUser: User = {
  id: '1',
  email: 'test@test.com',
};

describe('authReducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ user: null });
  });

  test('should set auth user', () => {
    expect(reducer(undefined, setAuth(dummyUser))).toEqual({ user: dummyUser });
  });

  test('should set auth user org', () => {
    const result = reducer({ user: dummyUser }, setUserOrg('456'));

    expect(result.user).toEqual({ ...dummyUser, org_id: '456' });
  });

  test('should not set auth user org if no auth user', () => {
    expect(reducer(undefined, setUserOrg('123'))).toEqual({ user: null });
  });

  test('should unset auth user', () => {
    expect(reducer({ user: dummyUser }, unsetAuth())).toEqual({ user: null });
  });
});
