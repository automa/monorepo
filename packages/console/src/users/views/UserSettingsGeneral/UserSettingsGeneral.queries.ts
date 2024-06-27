import { gql } from 'gql';

export const USER_UPDATE_MUTATION = gql(`
  mutation UserUpdate($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      id
      name
      email
    }
  }
`);
