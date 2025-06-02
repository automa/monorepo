import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';

export const throwGraphQLError = (
  code: string,
  message: string,
  path: string[],
) => {
  throw new GraphQLError('Unprocessable Entity', {
    extensions: {
      code: ApolloServerErrorCode.BAD_USER_INPUT,
      errors: [
        {
          code,
          message,
          path,
        },
      ],
    },
  });
};
